import { makeExecutableSchema } from "graphql-tools";
import GraphQLDateTime from "graphql-type-datetime";
import { readFile } from "fs-extra";
import { join } from "path";

// Schemas:
import { GameCharacterSchema, GameCharacterResolvers } from "./impl/game-character";
import { CharacterSchema, CharacterResolvers } from "./impl/character";
import { UserSchema, UserResolvers } from "./impl/user";
import { GameSessionSchema, GameSessionResolvers } from "./impl/game-session";

import { RootResolvers } from "./impl/root";
import { GraphQLSchema } from "../../../node_modules/@types/graphql";

let loadSchema = async () => {
	// load root.graphql
	let Schema: string = await readFile(join(__dirname, "schemas", "root.graphql"), "utf-8");

	try {
		let schema: GraphQLSchema = makeExecutableSchema<GraphQLSchema>({
			typeDefs: [Schema, GameSessionSchema, GameCharacterSchema, CharacterSchema, UserSchema],
			resolvers: [
				RootResolvers,
				GameSessionResolvers,
				GameCharacterResolvers,
				CharacterResolvers,
				UserResolvers,
				{ DateTime: GraphQLDateTime }
			]
		});

		return schema;
	} catch (e) {
		console.log(e);
		return null;
	}
};

export default loadSchema;
