import { describe, it, mock } from "node:test";
import { strict as assert } from "node:assert/strict";
import { Pokemon } from "../../models/pokemon.js";
import { Database } from "sqlite3";

const rawPokemon = {
  id: 1,
  name: "Bulbasaur",
  imageUrl:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
  description: "A grass type pokemon.",
};

const examplePokemon = [new Pokemon(rawPokemon)];

describe("Pokemon", () => {
  it("fetches all pokemon from the database", async () => {
    const all = mock.fn((_, callback) => {
      callback(null, [rawPokemon]);
    });
    const db = { all } as unknown as Database;
    const pokemon = await Pokemon.getAll(db);
    assert.equal(all.mock.calls.length, 1);
    assert.deepEqual(pokemon, examplePokemon);
  });
});
