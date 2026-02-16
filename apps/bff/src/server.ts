// apps/bff/src/server.ts
import express from "express";
import { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "passport";
import apiRouter from "./routers/api";
import bffRouter from "./routers/bff";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Add session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Add passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization (required for sessions)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user as any);
});

app.use("/api", apiRouter);
app.use("/bff", bffRouter);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("/:any", (req: Request, res: Response) => {
  console.info("Serving index.html for unmatched route", req.path);
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(5173, () => {
  console.log("BFF running on 5173");
});