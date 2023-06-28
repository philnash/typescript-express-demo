import { Database } from "sqlite3";

interface PokemonData {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
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
}
