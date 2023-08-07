const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://user:abc@cluster0.5lroxkm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
let orderCollection, inventoryCollection, userCollection;
async function connectToDb() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");

    const db = client.db("web68");
    orderCollection = db.collection("order");
    inventoryCollection = db.collection("inventory");
    userCollection = db.collection("users");
    allUsers = await userCollection.find({}).toArray();

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

async function getAllUsers() {
  return allUsers;
}


async function getInventories(lowQuantity) {
  try {
    let query = {};
    if (lowQuantity === "true") {
      query = { instock: { $lt: 100 } };
    }
    const inventories = await inventoryCollection.find(query).toArray();
    return inventories;
  } catch (err) {
    console.error("Error fetching inventories:", err);
    throw err;
  }
}

async function orderWithProductDescriptions() {
  try {
    const ordersWithDescriptions = await orderCollection.aggregate([
      {
        $lookup: {
          from: "inventory",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $project: {
          _id: 1,
          item: 1,
          price: 1,
          quantity: 1,
          description: "$productDetails.description",
        },
      },
    ]).toArray();
    return ordersWithDescriptions;
  } catch (err) {
    console.error("Error fetching orders with product descriptions:", err);
    throw err;
  }
}


module.exports = {
  connectToDb, getInventories, getAllUsers, orderWithProductDescriptions
};


