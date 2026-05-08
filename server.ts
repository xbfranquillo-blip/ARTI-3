import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

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

  // Frontend Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor  corriendo en http://0.0.0.0:${PORT}`);
  });
}

startServer();