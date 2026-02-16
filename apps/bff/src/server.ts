/**
 * @fileoverview Express BFF (Backend for Frontend) server for the PUMVA application.
 * Acts as a proxy between the frontend and backend services, handling authentication,
 * session management, and serving static assets.
 * 
 * Features:
 * - Express session management with Passport.js
 * - Static file serving for frontend SPA
 * - API proxying to backend services
 * - Authentication middleware integration
 * - Catch-all routing for SPA support
 * 
 * @module server
 * @requires express
 * @requires express-session
 * @requires passport
 * @author PUMVA Team
 */

import express from "express";
import { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "passport";
import apiRouter from "./routers/api";
import bffRouter from "./routers/bff";
import { redirectToFrontend } from "./libs/usertools";

/**
 * Current directory path for ES module compatibility
 * @type {string}
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Express application instance
 * @type {express.Application}
 */
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

/**
 * Passport user serialization for session storage
 * @param {any} user - User object to serialize
 * @param {Function} done - Callback function
 */
passport.serializeUser((user, done) => {
  done(null, user);
});

/**
 * Passport user deserialization from session storage
 * @param {any} user - Serialized user data
 * @param {Function} done - Callback function
 */
passport.deserializeUser((user, done) => {
  done(null, user as any);
});

// Serve static files BEFORE auth middleware to avoid authentication on assets
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use("/api", apiRouter);
app.use("/bff", bffRouter);

/**
 * Catch-all middleware for SPA routing support
 * Serves the frontend for non-API routes while returning 404 for missing assets
 * This must be the last middleware as it handles all unmatched routes
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
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

/**
 * Start the BFF server on port 5173
 * Logs server startup to console
 */
app.listen(5173, () => {
  console.log("BFF running on 5173");
});