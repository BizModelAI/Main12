import express from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./vite";

const app = express();
const port = process.env.PORT || 9000;

(async () => {
  await registerRoutes(app);
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  }
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})(); 