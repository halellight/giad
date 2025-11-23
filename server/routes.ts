import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Updated 2025-11-23T03:23 - Serverless function fix
export function registerRoutesSync(app: Express): void {
  app.get("/api/attacks", async (req, res) => {
    try {
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
    } catch (error) {
      console.error("Error fetching attacks:", error);
      res.status(500).json({ error: "Failed to fetch attacks" });
    }
  });

  app.get("/api/attacks/:id", async (req, res) => {
    try {
      const attack = await storage.getAttackById(req.params.id);
      if (!attack) {
        return res.status(404).json({ error: "Attack not found" });
      }
      res.json(attack);
    } catch (error) {
      console.error("Error fetching attack:", error);
      res.status(500).json({ error: "Failed to fetch attack" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  registerRoutesSync(app);
  const httpServer = createServer(app);
  return httpServer;
}
