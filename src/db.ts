import sqlite from "sqlite3";
import { join, resolve } from "node:path";
import { dbName } from "./config.js";

const sqlite3 = sqlite.verbose();
export const db = new sqlite3.Database(resolve(join("data", `${dbName}.db`)));
