import express from "express";
import amqp from "amqplib";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// import connectMongo from "@src/loaders/mongoose";

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/recieve", async (req, res, next) => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    const result = await channel.assertQueue("jobs");
    channel.consume("jobs", (msg) => {
      console.log("Received message", msg.content.toString());
    });
    channel.ack(msg);
  });

  app
    .listen(3000, () => {
      console.log(`🛡️  Server listening on port: 3000 🛡️`);
    })
    .on("error", (err) => {
      Logger.error(err);
      process.exit(1);
    });
}
startServer();
