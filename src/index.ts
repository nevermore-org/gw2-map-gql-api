import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema, Resolver, Mutation, Arg, Query } from "type-graphql";
import TYRIA_MAPS from "./api/data/TYRIA_MAPS";
import MapInfo from "./api/models/interfaces/MapInfo";
import MapInfoGQL from "./api/models/typesGQL/MapInfoGQL";

console.log("Hello World");


@Resolver()
class MapResolver {
    @Query(() => MapInfoGQL)
    async getMapInfo(
        @Arg("id") id: number
    ): Promise<MapInfo | undefined> {
        return TYRIA_MAPS.find(map => map.id === id);
    }


    @Mutation(() => String)
    async createMap(
        @Arg("id") id: number,
        @Arg("mode") mode: string
    ): Promise<String> {
        console.log("Hello there");
        return `${id} ${mode}`;
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