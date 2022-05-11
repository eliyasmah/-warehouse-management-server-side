const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xkfnh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const fruitsCollection = client
      .db("inventoryManaging")
      .collection("fruits");

    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = fruitsCollection.find(query);
      const inventories = await cursor.toArray();
      res.send(inventories);
    });

    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const inventory = await fruitsCollection.findOne(query);
      res.send(inventory);
    });

    //POST
    app.post("/inventory", async (req, res) => {
      const newInventory = req.body;
      const result = await fruitsCollection.insertOne(newInventory);
      res.send(result);
    });

    //Update
    app.put("inventory/:id", async (req, res) => {
      const id = req.params.id;
      const updateQuantity = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateFiled = {
        $set: updateQuantity,
      };
      const result = await fruitsCollection.updateOne(
        filter,
        updateFiled,
        options
      );
      res.send(result);
    });

    //DELETE
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await fruitsCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from inventory-managing-server-site");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
