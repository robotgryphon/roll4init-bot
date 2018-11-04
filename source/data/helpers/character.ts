import { Character, User } from "@roll4init/objects";
import { DateTime } from "luxon";
import { StatementResult, Node } from "neo4j-driver/types/v1";
import { SimpleDataDeserializer } from "../serializers/SimpleDataDeserializer";
import { connection } from "../connection";
import { UserNodeHelper, UserNotFoundError } from "./User";

export class CharacterNodeHelper {
    public static async findByUnique(unique: string): Promise<Character> {
        let query = `MATCH (c:Character) 
			WHERE c.Unique = {unique}
			RETURN c`;

        try {
            let session = connection.session();
            let result: StatementResult = await session.run(query, {
                unique: unique
            });

            return result.records
                .map(rec => rec.get(0))
                .map((rec: Node) =>
                    SimpleDataDeserializer.deserialize<Character>(
                        new Character(),
                        rec
                    )
                )
                .shift();
        } catch (e) {
            throw new Error(e);
        }
    }

    public static async getOwner(character: Character): Promise<User> {
        let query = `MATCH (u:User)-[:OwnsCharacter]->(c:Character) 
			WHERE c.Unique = {unique}
			RETURN u`;

        try {
            let session = connection.session();
            let result: StatementResult = await session.run(query, {
                unique: character.Unique
            });

            return result.records
                .map(rec => rec.get(0))
                .map((rec: Node) =>
                    SimpleDataDeserializer.deserialize<User>(new User(), rec)
                )
                .shift();
        } catch (e) {
            throw new UserNotFoundError(e);
        }
    }
}
