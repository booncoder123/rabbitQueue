import express from "express";
import amqp from "amqplib";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import Store from "./model/store.model.js";
dotenv.config();

import connectMongo from "./loaders/mongoose.js";

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  await connectMongo();
  app.use("/send-message", async (req, res, next) => {
    try {
      //connect to queue
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();
      const result = await channel.assertQueue("jobs");
      console.log("Sending message to queue", req.body);
      channel.sendToQueue("jobs", Buffer.from(JSON.stringify(req.body)));
    } catch (error) {
      console.log(error);
    }
  });
  app.use("/store", async (req, res, next) => {
    const { position } = req.body;
    console.log("position");
    axios.get("https://fakestoreapi.com/products").then(function (response) {
      // handle success
      // console.log(response);
      const store = response.data;

      const ob = store[1];
      const { title, price, description, category, image } = ob;
      console.log(title, price, description, category, image);

      const product = new Store({
        title,
        price,
        description,
        category,
        image,
      });
      product.save();

      res.send(product);
    });
  });

  app
    .listen(process.env.PORT_NUMBER, () => {
      console.log(
        `🛡️  Server listening on port: ${process.env.PORT_NUMBER} 🛡️`
      );
    })
    .on("error", (err) => {
      console.log(err);
      process.exit(1);
    });
}
startServer();
