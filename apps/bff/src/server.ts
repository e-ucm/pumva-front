// apps/bff/src/server.ts
import express from "express";
import { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "passport";
import apiRouter from "./routers/api";
import bffRouter from "./routers/bff";
import { redirectToFrontend } from "./libs/usertools";

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

// Serve static files BEFORE auth middleware to avoid authentication on assets
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use("/api", apiRouter);
app.use("/bff", bffRouter);

// Catch-all middleware for frontend SPA (must be last)
app.use((req: Request, res: Response) => {
  // Only serve frontend for non-API, non-asset routes
  if (!req.path.startsWith('/api') && 
      !req.path.startsWith('/bff') && 
      !req.path.startsWith('/assets/') &&
      !req.path.endsWith('.js') &&
      !req.path.endsWith('.css') &&
      !req.path.endsWith('.ico') &&
      !req.path.endsWith('.svg') &&
      !req.path.endsWith('.png') &&
      !req.path.endsWith('.jpg')) {
    redirectToFrontend(req as any, res);
  } else {
    res.status(404).send('Not Found');
  }
});

app.listen(5173, () => {
  console.log("BFF running on 5173");
});