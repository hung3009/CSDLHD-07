import { cassandraClient } from "../config/db";
import { v4 as uuidv4 } from "uuid";

import { Request, Response } from "express";


export async function checkAndNotify(item: any) {
    console.log("in check noti", item);
    
    if (item.stock <= item.restock_threshold) {
      const message = `Sản phẩm ${item.product_id} sắp hết hàng`;
  
      // Optional: check if an unread notification already exists
      const query = `
        SELECT * FROM inventory_notifications 
        WHERE seller_id = ? AND product_id = ? 
        ALLOW FILTERING
      `;
      const existing = await cassandraClient.execute(query, [item.seller_id, item.product_id]);
  
      const hasUnread = existing.rows.some((row) => !row.is_read);
      if (!hasUnread) {
        const insertQuery = `
          INSERT INTO inventory_notifications (id, seller_id, product_id, message, created_at, is_read)
          VALUES (?, ?, ?, ?, toTimestamp(now()), false)
        `;
        await cassandraClient.execute(insertQuery, [
          uuidv4(),
          item.seller_id,
          item.product_id,
          message,
        ]);
        console.log("✅ Notification added:", message);
      }
    }
  }
  export async function getListNoti(req: Request<{ sellerId: string }>, res: Response) {
    const { sellerId } = req.params;
  
    try {
      const query = `
        SELECT * FROM inventory_notifications
        WHERE seller_id = ?
        ALLOW FILTERING
      `;
  
      const result = await cassandraClient.execute(query, [sellerId], {
        prepare: true,
      });
  
      res.json({
        notifications: result.rows,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  