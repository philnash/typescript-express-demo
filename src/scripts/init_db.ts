import { Database } from "sqlite3";
import { db } from "../db.js";
import { readFile } from "fs/promises";
const crypto = require('crypto');

export default async function init(database: Database) {
  const pokemon = await readFile("./data/pokemon.txt", "utf-8");

  database.serialize(() => {
    database.run("DROP TABLE IF EXISTS POKEDEX;");
    database.run(`CREATE TABLE POKEDEX (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      imageUrl TEXT NOT NULL,
      description TEXT NOT NULL
    );`);

    database.run("DROP TABLE IF EXISTS SUBSCRIBERS;");
    database.run(`CREATE TABLE SUBSCRIBERS (
      id INTEGER PRIMARY KEY,
      email TEXT NOT NULL UNIQUE
    );`);

    try {

      var { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 1024,  // Noncompliant
          publicKeyEncoding:  { type: 'spki', format: 'pem' },
          privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        },
        callback);
      
      const statement = database.prepare(
        "INSERT INTO POKEDEX (id, name, imageUrl, description) VALUES (?, ?, ?, ?);"
      );
      pokemon.split("\n").forEach((line, index) => {
        const [name, description] = line.split(";");
        const pokemonId = index + 1;
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
        statement.run(pokemonId, name, imageUrl, description);
      });
      statement.finalize();
    } catch (error) {
      console.error(error);
      console.error("Could not load pokemon data into the database.");
    }
  });

  database.close();
}

function callback(err, pub, priv) {}

init(db);
