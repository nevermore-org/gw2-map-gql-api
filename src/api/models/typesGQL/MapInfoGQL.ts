import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class MapInfoGQL {
    @Field()
    id!: number;
    @Field()
    name!: string;
    @Field()
    min_level!: number;
    @Field()
    max_level!: number;
    @Field()
    default_floor!: number;
    @Field()
    type!: string; // our stuff should pretty much only be of the 'Public' type
    @Field(() => [Number])
    floors!: number[];
    @Field()
    region_id!: number;
    @Field({ nullable: true })
    region_name?: string;
    @Field()
    continent_id!: number;
    @Field({ nullable: true })
    continent_name?: string;
    @Field(() => [[Number]])
    map_rect!: number[][]; // Honestly not sure, what even are these coordinates
    @Field(() => [[Number]])
    continent_rect!: number[][]; // Coordinates we care about - first item in array is upper-left (NW) point, second is the lower-right (SE) one 
}