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

// Cassandra Connection
export const cassandraClient = new CassandraClient({
  contactPoints: [cassandraContactPoint],
  localDataCenter: "datacenter1",
  keyspace: cassandraKeyspace,
});

// MySQL Connection
export const sequelize = new Sequelize(mysqlURI, {
  dialect: "mysql",
});

export const connectDatabases = async () => {
  await connectMongoDB();
  await cassandraClient.connect();
  await sequelize.authenticate();
  console.log("✅ MySQL & Cassandra Connected");
};
