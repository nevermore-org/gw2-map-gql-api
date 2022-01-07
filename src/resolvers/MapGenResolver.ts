import { Arg, Mutation, Query, Resolver } from "type-graphql";
import MapGenController from "../controllers/MapGenController";
import TYRIA_MAPS from "../data/TYRIA_MAPS";
import MapInfo from "../models/interfaces/MapInfo";
import MapInfoGQL from "../models/typesGQL/MapInfoGQL";


@Resolver()
export default class MapGenResolver {
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