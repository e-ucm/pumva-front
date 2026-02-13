// apps/bff/src/server.ts
import express from "express";
import { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import apiRouter from "./routers/api";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use("/api", apiRouter);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("/:any", (req: Request, res: Response) => {
  console.info("Serving index.html for unmatched route", req.path);
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(5173, () => {
  console.log("BFF running on 5173");
});