import fs from "node:fs";
import path from "node:path";
import express from "express";
import { app } from "../server/app";
import { registerRoutesSync } from "../server/routes";

// Register routes using the shared function
registerRoutesSync(app);

// Serve static files
const distPath = path.resolve(process.cwd(), "dist/public");

if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.use("*", (_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
    });
}

export default app;
