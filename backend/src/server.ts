import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectDatabases } from "./config/db";

<<<<<<< HEAD
const PORT = process.env.PORT || 5001;

connectDatabases().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
=======
const PORT = process.env.PORT || 5000;

connectDatabases().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
>>>>>>> refs/remotes/origin/main
