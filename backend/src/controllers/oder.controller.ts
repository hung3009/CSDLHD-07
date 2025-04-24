import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { cassandraClient } from "../config/db";
import { CartItem } from "../models/CartItem";
import { Client, types } from 'cassandra-driver';  // Importing cassandra-driver and types

export const getClientOrder = async (req: Request, res: Response) => {
  const { customer_id } = req.query;


  try {
    const orders = await cassandraClient.execute(
      "SELECT * FROM seller_orders WHERE customer_id = ?",
      [customer_id],
      { prepare: true }
    );

    // Process orders
    const formattedOrders = orders.rows.map((order) => {
      let totalAmount = order.total_amount;

      // Check if total_amount is a BigDecimal and if it's in scientific notation
      if (totalAmount instanceof types.BigDecimal) {
                try {
          // Convert to a string safely and handle large values
          totalAmount = totalAmount.toString();
          if (totalAmount.includes('E')) {
            // If it's scientific notation, fix it
            totalAmount = parseFloat(totalAmount).toFixed(2);
          }
        } catch (e) {
          console.error("Error processing BigDecimal:", e);
          totalAmount = '0';  // Default to 0 if conversion fails
        }
      }

      return {
        ...order,
        total_amount: totalAmount.toString(), // Ensure it's a string
      };
    });

    return res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export const getOrderList = async (req: Request, res: Response) => {
  const { sellerId } = req.query;
  const chunkSize = 100;

  try {
    // Step 1: Query seller_order_items to get all order IDs for the specific seller
    const orderItemsQuery = `
      SELECT order_id
      FROM seller_order_items
      WHERE seller_id = ? ALLOW FILTERING;`;

    const orderItemsResult = await cassandraClient.execute(orderItemsQuery, [sellerId]);
    const orderIds = orderItemsResult.rows.map(row => row.order_id);

    if (orderIds.length === 0) {
      console.log("No orders found for this seller.");
      return;
    }

    // Step 2: Chunk the orderIds array into smaller parts
    const chunkedOrderIds = [];
    for (let i = 0; i < orderIds.length; i += chunkSize) {
      chunkedOrderIds.push(orderIds.slice(i, i + chunkSize));
    }

    // Step 3: Query seller_orders for each chunk
    const allOrders = [];
    for (let i = 0; i < chunkedOrderIds.length; i++) {
      const ordersQuery = `
        SELECT customer_id, order_id, address, created_at, name, payment_method, phone, status, total_amount
        FROM seller_orders
        WHERE order_id IN ? ALLOW FILTERING;`;

      const ordersResult = await cassandraClient.execute(ordersQuery, [chunkedOrderIds[i]]);
      const orders = ordersResult.rows;

      // Map the results and handle potential missing data
      const simplifiedOrders = orders.map(order => {
        let totalAmount = "0"; // Default value for total_amount

        // Ensure total_amount is not undefined and handle BigDecimal safely
        if (order.total_amount) {
          // If total_amount is a BigDecimal, convert it to string with appropriate handling
          try {
            let totalAmountStr = order.total_amount.toString();

            // Check for excessively large numbers or scientific notation
            if (totalAmountStr.includes("e") || totalAmountStr.includes("E")) {
              totalAmountStr = parseFloat(totalAmountStr).toFixed(2); // Fixing to 2 decimal places
            }

            totalAmount = totalAmountStr;
          } catch (err) {
            console.error("Error converting BigDecimal to string:", err);
            totalAmount = "0";
          }
        }

        return {
          customer_id: order.customer_id ? order.customer_id.toString() : null,
          order_id: order.order_id ? order.order_id.toString() : null,
          address: order.address || "N/A",
          created_at: order.created_at || "N/A",
          name: order.name || "N/A",
          payment_method: order.payment_method || "N/A",
          phone: order.phone || "N/A",
          status: order.status || "N/A",
          total_amount: totalAmount, // Ensure total_amount is handled correctly
        };
      });

      allOrders.push(...simplifiedOrders);
    }

    console.log("Data orders:", allOrders);

    // Send response
    res.status(200).json({
      message: "Orders retrieved successfully",
      orders: allOrders,
    });
  } catch (error) {
    console.error("Error fetching orders and items:", error);
    res.status(500).json({
      message: "Error fetching orders and items",
      error: (error as { message: "" }).message,
    });
  }
};
