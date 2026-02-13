// apps/bff/src/server.ts
import express from "express";
import { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import apiRouter from "./routers/api";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from BFF" });
});

app.get("/*", (_ : Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});


app.listen(5173, () => {
  console.log("BFF running on 5173");
});