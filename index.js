// import all libs
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = 3000;

// to prevent cors errors
app.use(cors());

// url to connect to mongodb
const uri =
  "mongodb+srv://root:root@band.vjeaa.mongodb.net/companies?retryWrites=true&w=majority";

// home get response
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/search", async (req, res) => {
  let doc = {};
  if (req.query.type === "name") {
    doc["company"] = req.query.term;
  } else {
    doc["ticker"] = req.query.term;
  }
  let result = [];
  // connect with the mongodb collection
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  await client.connect(async (err) => {
    const collection = await client.db("companies").collection("companies");
    console.log(">>> Connected*", doc);

    await collection
      .find(doc, { projection: { _id: 0, company: 1, ticker: 1 } })
      .forEach((e) => {
        result.push(e);
      });
    client.close();
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
