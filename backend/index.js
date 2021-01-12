const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  return res.send("Hello world");
});

app.listen(port, () => console.log(`The server is running on port: ${port}`));
