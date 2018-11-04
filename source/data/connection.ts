import { v1 as neo4j } from "neo4j-driver";
import * as dotenv from "dotenv";
dotenv.config();

let connection = neo4j.driver(
	process.env.DB_HOST || "bolt://localhost:7687",
	neo4j.auth.basic(
		process.env.DB_USER || "neo4j",
		process.env.DB_PASS || "neo4j"
	)
);

export { connection };
