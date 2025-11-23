import fs from "node:fs";
import path from "node:path";
import express from "express";
import { app } from "../server/app";
import { registerRoutesSync } from "../server/routes";
import { storage } from "../server/storage";

// Register API routes synchronously for serverless
registerRoutesSync(app);

// Serve static files from dist/public
const distPath = path.resolve(process.cwd(), "dist/public");

if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));

    // Fall through to index.html for client-side routing
    app.use("*", (_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
    });
}

// Export the Express app for Vercel
export default app;
