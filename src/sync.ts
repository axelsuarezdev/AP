import { Sequelize } from "sequelize-cockroachdb";

// Conexión a la DB
export const sequelize = new Sequelize(process.env.DATABASE_URL as string);