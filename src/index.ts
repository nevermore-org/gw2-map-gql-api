import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import dotenv from "dotenv";
import { buildSchema, Resolver, Mutation, Arg, Query } from "type-graphql";
import TYRIA_MAPS from "./api/data/TYRIA_MAPS";
import MapInfo from "./api/models/interfaces/MapInfo";
import MapInfoGQL from "./api/models/typesGQL/MapInfoGQL";
import MapGenController from "./api/controllers/MapGenController";
const cloudinary = require('cloudinary').v2;

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true
})

@Resolver()
class MapResolver {
    @Query(() => MapInfoGQL)
    async getMapInfo(
        @Arg("id") id: number
    ): Promise<MapInfo | undefined> {
        return TYRIA_MAPS.find(map => map.id === id);
    }

    @Query(() => String)
    async getAllTyrianMaps() {
      return "Success";
    }


    @Mutation(() => String)
    async generateMap(
        @Arg("id") id: number,
        @Arg("mode") mode: string
    ): Promise<String> {
        return await new MapGenController(id, mode).handleMutation();
    }
}


const main = async () => {
  const schema = await buildSchema({
    resolvers: [MapResolver]
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