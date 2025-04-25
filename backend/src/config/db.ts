import mongoose from "mongoose";
import { Client as CassandraClient } from "cassandra-driver";
import { Sequelize } from "sequelize";

const mongoURI = process.env.MONGO_URI as string;
const cassandraContactPoint = process.env.CASSANDRA_HOST as string;
const cassandraKeyspace = process.env.CASSANDRA_KEYSPACE as string;
const mysqlURI = process.env.MYSQL_URI as string;

// MongoDB Connection
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      family: 4,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
};

// Temporary Cassandra client (no keyspace)
const tempCassandraClient = new CassandraClient({
  contactPoints: [cassandraContactPoint],
  localDataCenter: "datacenter1",
});

// Main Cassandra client (uses keyspace after creation)
export const cassandraClient = new CassandraClient({
  contactPoints: [cassandraContactPoint],
  localDataCenter: "datacenter1",
  keyspace: cassandraKeyspace,
});

// Ensure Cassandra keyspace exists
const ensureCassandraKeyspace = async () => {
  try {
    await tempCassandraClient.connect();

    const createKeyspaceQuery = `
      CREATE KEYSPACE IF NOT EXISTS ${cassandraKeyspace}
      WITH REPLICATION = {
        'class': 'SimpleStrategy',
        'replication_factor': 1
      };
    `;
    await tempCassandraClient.execute(createKeyspaceQuery);
    console.log(`✅ Keyspace "${cassandraKeyspace}" is ready.`);

    // Connect to keyspace
    await cassandraClient.connect();

    // Table creation queries
    const tableQueries = [
      `CREATE TABLE IF NOT EXISTS seller_products (
        seller_id UUID,
        product_id UUID,
        name TEXT,
        description TEXT,
        price DECIMAL,
        stock INT,
        status TEXT,
        images LIST<TEXT>,
        created_at TIMESTAMP,
        updated_at TIMESTAMP,
        PRIMARY KEY (seller_id, product_id)
      );`,
      `CREATE TABLE IF NOT EXISTS seller_orders (
        customer_id UUID,
        order_id UUID,
        total_amount DECIMAL,
        payment_method TEXT,
        address TEXT,
        phone TEXT,
        name TEXT,
        status TEXT,
        created_at TIMESTAMP,
        updated_at TIMESTAMP,
        PRIMARY KEY (customer_id, order_id)
      );`,
      `CREATE TABLE IF NOT EXISTS seller_order_items (
        seller_id UUID,
        order_id UUID,
        product_id UUID,
        quantity INT,
        price DECIMAL,
        total_price DECIMAL,
        PRIMARY KEY ((seller_id, order_id), product_id)
      );`,
      `CREATE TABLE IF NOT EXISTS seller_inventory (
        seller_id UUID,
        product_id UUID,
        stock INT,
        restock_threshold INT,
        last_updated TIMESTAMP,
        PRIMARY KEY (seller_id, product_id)
      );`,
      `CREATE TABLE IF NOT EXISTS seller_revenue (
        seller_id UUID,
        date DATE,
        total_orders INT,
        total_revenue DECIMAL,
        PRIMARY KEY (seller_id, date)
      );`,
      `CREATE TABLE IF NOT EXISTS inventory_notifications (
        id UUID PRIMARY KEY,
        seller_id UUID,
        product_id UUID,
        message TEXT,
        created_at TIMESTAMP,
        is_read BOOLEAN
      );`
    ];

    for (const query of tableQueries) {
      await cassandraClient.execute(query);
    }

    console.log("✅ Cassandra tables created or verified.");

    await tempCassandraClient.shutdown();
  } catch (error) {
    console.error("❌ Error setting up Cassandra:", error);
    process.exit(1);
  }
};

// MySQL Connection
export const sequelize = new Sequelize(mysqlURI, {
  dialect: "mysql",
});

// Connect all databases
export const connectDatabases = async () => {
  await connectMongoDB();
  await ensureCassandraKeyspace(); // create keyspace if needed
  await cassandraClient.connect();
  await sequelize.authenticate();
  console.log("✅ MySQL & Cassandra Connected");
};