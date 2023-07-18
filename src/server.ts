import Express, { urlencoded } from "express";
import { engine } from "express-handlebars";
import { router } from "./routes.js";
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
import { join } from "node:path";

export const app = Express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

app.use(urlencoded({ extended: false }));

app.use("/static", Express.static(join(__dirname, "public")));

app.use("/", router);
app.get("/vulnerable", (req, res) => {
  const json = JSON.stringify({ data: req.query.input });
  res.send(json);
});
