import { describe, it, before, mock } from "node:test";
import { strict as assert } from "node:assert/strict";
import { home, subscribe } from "../routes.js";
import { Request, Response } from "express";
import { initPokemon } from "./utils/helper.js";
import { db } from "../db.js";
import { Pokemon } from "../models/pokemon.js";

const examplePokemon = [
  new Pokemon({
    id: 1,
    name: "Bulbasaur",
    imageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    description: "A grass type pokemon.",
  }),
];

describe("routes", () => {
  before(() => {
    initPokemon(db, examplePokemon);
  });

  describe("home", () => {
    it("should render the home template", async () => {
      const mockRequest = {} as Request;
      const render = mock.fn(() => {});
      const mockResponse = { render } as unknown as Response;
      await home(mockRequest, mockResponse);
      assert.equal(render.mock.calls.length, 1);
      assert.deepEqual(render.mock.calls[0].arguments, [
        "home",
        { pokemon: examplePokemon },
      ]);
    });
  });

  describe("subscribe", () => {
    it("should redirect to home and store a subscriber if successful", async () => {
      const mockRequest = { body: { email: "valid@example.com" } } as Request;
      const redirect = mock.fn(() => {});
      const mockResponse = { redirect } as unknown as Response;
      await subscribe(mockRequest, mockResponse);
      assert.equal(redirect.mock.calls.length, 1);
      assert.deepEqual(redirect.mock.calls[0].arguments, ["/"]);
    });

    it("should render the home template with an error if unsuccessful", async () => {
      const mockRequest = { body: { email: "invalid" } } as Request;
      const render = mock.fn(() => {});
      const mockResponse = { render } as unknown as Response;
      await subscribe(mockRequest, mockResponse);
      assert.equal(render.mock.calls.length, 1);
      assert.deepEqual(render.mock.calls[0].arguments, [
        "home",
        {
          pokemon: examplePokemon,
          email: "invalid",
          error: "Please provide a valid email address",
        },
      ]);
    });
  });
});
