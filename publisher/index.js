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

  app
    .listen(process.env.PORT_NUMBER, () => {
      console.log(
        `🛡️  Server listening on port: ${process.env.PORT_NUMBER} 🛡️`
      );
    })
    .on("error", (err) => {
      Logger.error(err);
      process.exit(1);
    });
}
startServer();
