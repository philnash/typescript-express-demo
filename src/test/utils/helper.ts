import { Pokemon } from "../../models/pokemon.js";
import { Database } from "sqlite3";

export function initPokemon(db: Database, pokemon: Pokemon[]) {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS POKEDEX;");
    db.run(`CREATE TABLE POKEDEX (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        imageUrl TEXT NOT NULL,
        description TEXT NOT NULL
      );`);

    db.run("DROP TABLE IF EXISTS SUBSCRIBERS;");
    db.run(`CREATE TABLE SUBSCRIBERS (
        id INTEGER PRIMARY KEY,
        email TEXT NOT NULL UNIQUE
      );`);

    const statement = db.prepare(
      "INSERT INTO POKEDEX (id, name, imageUrl, description) VALUES (?, ?, ?, ?);"
    );
    pokemon.forEach((pokemon) => {
      const { id, name, imageUrl, description } = pokemon;
      statement.run(id, name, imageUrl, description);
    });
    statement.finalize();
  });
}
