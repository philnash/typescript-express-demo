import { Request, Router, Response } from "express";
import { NotFoundError, Pokemon } from "./models/pokemon.js";
import { Subscriber } from "./models/subscriber.js";
import { db } from "./db.js";

export async function home(_req: Request, res: Response) {
  try {
    const pokemon = await Pokemon.getAll(db);
    res.render("home", { pokemon });
  } catch (error) {
    console.log(error);
    res.send("An error occurred, please try again later.");
  }
}

export async function getPokemon(req: Request, res: Response) {
  const pokemonId = req.query.pokemonId;
  if (typeof pokemonId === "string") {
    try {
      const pokemon = await Pokemon.getById(db, pokemonId);
      res.render("pokemon", { pokemon, pokemonId });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res
          .status(404)
          .render("pokemon", { error: "Pokemon not found", pokemonId });
      } else {
        res.status(500).send("An error occurred, please try again later.");
      }
    }
  } else {
    res
      .status(404)
      .render("pokemon", { error: "Pokemon not found", pokemonId });
  }
}

export async function subscribe(req: Request, res: Response) {
  const { email } = req.body;
  try {
    const result = await Subscriber.save(db, email);
    if (result.success) {
      res.redirect("/");
    } else {
      const pokemon = await Pokemon.getAll(db);
      res.render("home", { pokemon, error: result.message, email });
    }
  } catch (error) {
    const pokemon = await Pokemon.getAll(db);
    res.render("home", {
      pokemon,
      error: "An error occurred, please try again later.",
      email,
    });
  }
}

export const router = Router();
router.get("/", home);
router.post("/subscriptions", subscribe);
router.get("/pokemon", getPokemon);
