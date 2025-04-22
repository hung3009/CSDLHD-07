import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectDatabases } from "./config/db";

const PORT = process.env.PORT || 5000;

connectDatabases().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});