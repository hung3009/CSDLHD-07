import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { cassandraClient } from "../config/db";
import { CartItem } from "../models/CartItem";


export const getCartList = async (req: Request, res: Response) => {

  try {
    const { userId } = req.params;
    
    const cartItems = await CartItem.find({ user_id: userId })
      .select("product_id quantity price total_price image seller_id") // Select only required fields
      .lean(); // Converts Mongoose document to plain JSON (better performance)

    res.status(200).json({ cartItems });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Error fetching cart items" });
  }
}

export const addToCart = async (req: Request, res: Response) => {

    try {
        const { user_id, name, product_id, quantity, seller_id, price, image } = req.body;

        console.log("data to cart ", req.body);
        
    
        if (!user_id || !product_id) {
          return res.status(400).json({ message: "User ID and Product ID are required" });
        }
    
        const total_price = quantity * price;
    
        // Check if the item is already in the cart
        let cartItem = await CartItem.findOne({ user_id, product_id });
    
        if (cartItem) {
          // If item exists, update quantity
          cartItem.quantity += quantity;
          cartItem.total_price = cartItem.quantity * cartItem.price;
          cartItem.seller_id = seller_id;
          await cartItem.save();
          return res.status(200).json({ message: "Cart updated!", cartItem });
        } else {
          // If item doesn't exist, add new item
          cartItem = new CartItem({ user_id, product_id, quantity, price, total_price, image, name, seller_id });
          await cartItem.save();
          return res.status(201).json({ message: "Item added to cart!", cartItem });
        }
      } catch (error) {
        res.status(500).json({ message: "Error adding to cart", error });
      }

}
