"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutesSync = registerRoutesSync;
exports.registerRoutes = registerRoutes;
const http_1 = require("http");
const storage_1 = require("./storage");
// Updated 2025-11-23T03:23 - Serverless function fix
function registerRoutesSync(app) {
    app.get("/api/attacks", async (req, res) => {
        try {
            const filters = {
                dateFrom: req.query.dateFrom,
                dateTo: req.query.dateTo,
                countries: req.query.countries ? (Array.isArray(req.query.countries) ? req.query.countries : [req.query.countries]) : undefined,
                regions: req.query.regions ? (Array.isArray(req.query.regions) ? req.query.regions : [req.query.regions]) : undefined,
                attackTypes: req.query.attackTypes ? (Array.isArray(req.query.attackTypes) ? req.query.attackTypes : [req.query.attackTypes]) : undefined,
                severities: req.query.severities ? (Array.isArray(req.query.severities) ? req.query.severities : [req.query.severities]) : undefined,
                casualtyMin: req.query.casualtyMin ? parseInt(req.query.casualtyMin) : undefined,
                casualtyMax: req.query.casualtyMax ? parseInt(req.query.casualtyMax) : undefined,
                searchQuery: req.query.searchQuery,
            };
            const attacks = await storage_1.storage.getAllAttacks(filters);
            res.json(attacks);
        }
        catch (error) {
            console.error("Error fetching attacks:", error);
            res.status(500).json({ error: "Failed to fetch attacks" });
        }
    });
    app.get("/api/attacks/:id", async (req, res) => {
        try {
            const attack = await storage_1.storage.getAttackById(req.params.id);
            if (!attack) {
                return res.status(404).json({ error: "Attack not found" });
            }
            res.json(attack);
        }
        catch (error) {
            console.error("Error fetching attack:", error);
            res.status(500).json({ error: "Failed to fetch attack" });
        }
    });
    app.get("/api/stats", async (req, res) => {
        try {
            const stats = await storage_1.storage.getStats();
            res.json(stats);
        }
        catch (error) {
            console.error("Error fetching stats:", error);
            res.status(500).json({ error: "Failed to fetch stats" });
        }
    });
}
async function registerRoutes(app) {
    registerRoutesSync(app);
    const httpServer = (0, http_1.createServer)(app);
    return httpServer;
}
