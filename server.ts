import express from "express";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // ---- TUS RUTAS DE API AQUÍ ----
  const apiRouter = express.Router();

  // Middleware logging for API
  apiRouter.use((req, res, next) => {
    console.log(`[API LOG] ${req.method} ${req.url}`);
    next();
  });

  apiRouter.get("/health", (req, res) => {
    console.log("API: Health check requested");
    res.json({ status: "ok", message: "La API integrada funciona correctamente" });
  });

  apiRouter.get("/users", (req, res) => {
    console.log("API: Users requested - Sending 3 demo users");
    res.json([
      { id: 1, name: "Ana P.", email: "ana@example.com" },
      { id: 2, name: "Carlos M.", email: "carlos@example.com" },
      { id: 3, name: "Elena R.", email: "elena@example.com" }
    ]);
  });

  app.use("/api", apiRouter);
  // --------------------------------

  // Serve static files if they exist
  app.use(express.static("public"));

  // Health check endpoint
  app.get("/", (req, res) => {
    res.json({ message: "ARTI-3 Server is running!", timestamp: new Date() });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Error starting server:", err);
  process.exit(1);
});
