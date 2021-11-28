import express from "express";
import cors from "cors";
import rowyRedirect from "./rowyRedirect";
const app = express();
// json is the default content-type for POST requests
app.use(express.json());

app.use(cors());

app.get("/", rowyRedirect);
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Rowy-deploy: listening on port ${port}!`);
});
// Exports for testing purposes.
module.exports = app;
