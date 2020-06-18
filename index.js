const express = require("express");
const processGet = require("./processGet.js");
const processPost = require("./processPost.js");
const path = require("path");
const config = require("./config.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/link/([1-9]|[a-z]|[A-Z]){8}", (req, res) => {
  var code = req.originalUrl.substring(6); //trim '/link/'
  console.log("GET: " + code);
  processGet(code, res);
});

app.post("/link/post", (req, res) => {
  var url = req.body.url;
  console.log("POST: " + url);
  processPost(url, res);
});

app.use("/link", express.static(path.join(__dirname, "frontend")));

app.use((req, res) => {
  res.status(404).send("Link not found\n");
});

app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}\n\n`);
});
