import { Sequelize } from "sequelize-cockroachdb";
import { configDotenv } from "dotenv";

// Dotenv
configDotenv();

// Conexión a la DB
export const sequelize = new Sequelize(process.env.DATABASE_URL as string,{
    dialect: "postgres",
    logging: false
});