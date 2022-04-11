import mongoose from "mongoose";

async function connectMongo() {
  await mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(` 🎈 Server connecting to database 🎈   `);
    })
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });
}
export default connectMongo;
