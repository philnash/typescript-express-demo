import { app } from "./server.js";
import { port } from "./config.js";

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
