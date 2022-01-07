import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import dotenv from "dotenv";
import { buildSchema } from "type-graphql";
import MapGenResolver from "./resolvers/MapGenResolver";
import path from "path/posix";
const cloudinary = require('cloudinary').v2;

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true
})

const main = async () => {
  const schema = await buildSchema({
    resolvers: [MapGenResolver]
  });

  const apolloServer = new ApolloServer({ schema });

  await apolloServer.start();

  const app = express();


  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000/graphql");
  });
};

main();