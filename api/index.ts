import fs from "node:fs";
import path from "node:path";
import { app } from "../server/app";

// Test endpoint to verify the function works
app.get("/api/test", (_req, res) => {
    res.json({ message: "Serverless function is working!" });
});

// Try to import and use storage
app.get("/api/attacks", async (req, res) => {
    try {
        // Dynamic import to avoid initialization issues
        const { storage } = await import("../server/storage");

        const filters = {
            dateFrom: req.query.dateFrom as string | undefined,
            dateTo: req.query.dateTo as string | undefined,
            countries: req.query.countries ? (Array.isArray(req.query.countries) ? req.query.countries as string[] : [req.query.countries as string]) : undefined,
            regions: req.query.regions ? (Array.isArray(req.query.regions) ? req.query.regions as string[] : [req.query.regions as string]) : undefined,
            attackTypes: req.query.attackTypes ? (Array.isArray(req.query.attackTypes) ? req.query.attackTypes as string[] : [req.query.attackTypes as string]) : undefined,
            severities: req.query.severities ? (Array.isArray(req.query.severities) ? req.query.severities as string[] : [req.query.severities as string]) : undefined,
            casualtyMin: req.query.casualtyMin ? parseInt(req.query.casualtyMin as string) : undefined,
            casualtyMax: req.query.casualtyMax ? parseInt(req.query.casualtyMax as string) : undefined,
            searchQuery: req.query.searchQuery as string | undefined,
        };

        const attacks = await storage.getAllAttacks(filters);
        res.json(attacks);
    } catch (error: any) {
        console.error("Error in /api/attacks:", error);
        res.status(500).json({
            error: "Failed to fetch attacks",
            message: error.message,
            stack: error.stack
        });
    }
});

app.get("/api/attacks/:id", async (req, res) => {
    try {
        const { storage } = await import("../server/storage");
        const attack = await storage.getAttackById(req.params.id);
        if (!attack) {
            return res.status(404).json({ error: "Attack not found" });
        }
        res.json(attack);
    } catch (error: any) {
        console.error("Error in /api/attacks/:id:", error);
        res.status(500).json({
            error: "Failed to fetch attack",
            message: error.message
        });
    }
});

app.get("/api/stats", async (req, res) => {
    try {
        const { storage } = await import("../server/storage");
        const stats = await storage.getStats();
        res.json(stats);
    } catch (error: any) {
        console.error("Error in /api/stats:", error);
        res.status(500).json({
            error: "Failed to fetch stats",
            message: error.message
        });
    }
});

// Serve static files
const distPath = path.resolve(process.cwd(), "dist/public");

if (fs.existsSync(distPath)) {
    app.use(require("express").static(distPath));
    app.use("*", (_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
    });
}

export default app;
