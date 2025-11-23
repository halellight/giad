"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertAttackSchema = exports.attacks = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
exports.attacks = (0, pg_core_1.pgTable)("attacks", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    date: (0, pg_core_1.date)("date").notNull(),
    city: (0, pg_core_1.text)("city").notNull(),
    country: (0, pg_core_1.text)("country").notNull(),
    region: (0, pg_core_1.text)("region").notNull(),
    latitude: (0, pg_core_1.real)("latitude").notNull(),
    longitude: (0, pg_core_1.real)("longitude").notNull(),
    attackType: (0, pg_core_1.text)("attack_type").notNull(),
    killed: (0, pg_core_1.integer)("killed").notNull().default(0),
    wounded: (0, pg_core_1.integer)("wounded").notNull().default(0),
    description: (0, pg_core_1.text)("description").notNull(),
    severity: (0, pg_core_1.text)("severity").notNull(),
});
exports.insertAttackSchema = (0, drizzle_zod_1.createInsertSchema)(exports.attacks).omit({
    id: true,
});
