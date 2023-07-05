import { Database } from "sqlite3";

interface PokemonData {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class Pokemon implements PokemonData {
  id: number;
  name: string;
  description: string;
  imageUrl: string;

  constructor({ id, name, imageUrl, description }: PokemonData) {
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  static getAll(db: Database) {
    return new Promise<Pokemon[]>((resolve, reject) => {
      db.all("SELECT * FROM POKEDEX;", (error, rows) => {
        if (error) {
          reject(error);
        } else {
          const pokemon = rows.map((row) => {
            const pokemonData: PokemonData = row as PokemonData;
            return new Pokemon(pokemonData);
          });
          resolve(pokemon);
        }
      });
    });
  }

  static getById(db: Database, id: string) {
    return new Promise<Pokemon>((resolve, reject) => {
      console.log(id);
      db.get(`SELECT * FROM POKEDEX WHERE id = ${id};`, (error, row) => {
        if (error) {
          console.error(error);
          reject(error);
        } else if (row) {
          const pokemonData: PokemonData = row as PokemonData;
          const pokemon = new Pokemon(pokemonData);
          resolve(pokemon);
        } else {
          reject(new NotFoundError(`Pokemon with id ${id} not found`));
        }
      });
    });
  }
}
