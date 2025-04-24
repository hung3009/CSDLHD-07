<<<<<<< HEAD

=======
>>>>>>> refs/remotes/origin/main
import { Request, Response } from 'express';
import { cassandraClient } from '../config/db';


export const getInventoryList = async (req: Request, res: Response) => {
    try {

        const { seller_id } = req.query;



   const query = 'SELECT * FROM seller_inventory WHERE seller_id = ? ALLOW FILTERING';
    const result = await cassandraClient.execute(query, [seller_id]);
  
      const inventories = result.rows.map(row => ({
        product_id: row.product_id,
        seller_id: row.seller_id,
        stock: row.stock,
        restock_threshold: row.restock_threshold,
      }));
  
      res.status(200).json(inventories);
    } catch (error) {
      console.error('Cassandra error:', error);
      res.status(500).json({ error: 'Failed to fetch inventory' });
    }
  };
  

export const addInventory = async (req: Request, res: Response) => {

    try {
        console.log("req body ", req.body);
        
        const { seller_id, product_id, stock, restock_threshold } = req.body;
    
        if (!seller_id || !product_id || stock === undefined || restock_threshold === undefined) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
    
    // Validate stock and restock_threshold are valid numbers
    const parsedStock = parseInt(stock);
    const parsedRestockThreshold = parseInt(restock_threshold);

    if (isNaN(parsedStock) || isNaN(parsedRestockThreshold)) {
      return res.status(400).json({ error: 'Stock and Restock Threshold must be valid numbers' });
    }

    // Prepare the query for Cassandra
    const query = `
      INSERT INTO seller_inventory (seller_id, product_id, stock, restock_threshold, last_updated)
      VALUES (?, ?, ?, ?, toTimestamp(now()))
    `;

    // Execute the query
    await cassandraClient.execute(query, [seller_id, product_id, parsedStock, parsedRestockThreshold], {
      prepare: true
    });

    
        res.status(200).json({ message: 'Inventory added successfully' });
      } catch (error) {
        console.error('Error adding inventory:', error);
        res.status(500).json({ error: 'Internal server error' });
      }

<<<<<<< HEAD
}

=======
}
>>>>>>> refs/remotes/origin/main
