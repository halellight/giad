import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const attacks = pgTable("attacks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: date("date").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  region: text("region").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  attackType: text("attack_type").notNull(),
  killed: integer("killed").notNull().default(0),
  wounded: integer("wounded").notNull().default(0),
  description: text("description").notNull(),
  severity: text("severity").notNull(),
});

export const insertAttackSchema = createInsertSchema(attacks).omit({
  id: true,
});

export type InsertAttack = z.infer<typeof insertAttackSchema>;
export type Attack = typeof attacks.$inferSelect;
