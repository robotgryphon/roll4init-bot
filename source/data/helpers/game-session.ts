import { Node, StatementResult, Relationship, Record } from "neo4j-driver/types/v1";

// Local imports
import { User, GameSession, GameCharacter } from "@roll4init/objects";
import { connection } from "../connection";
import { SimpleDataDeserializer } from "../serializers/SimpleDataDeserializer";

interface GameCharacterRelationship {
    initiative: number;
}

export class GameSessionNodeHelper {
    static async hasCharacter(game: GameSession, character: GameCharacter): Promise<boolean> {
        let query = `MATCH (c:Character)-[:InSession]-(gs:GameSession)
			WHERE c.Unique = {cUnique} AND gs.Unique = {gsUnique}
			RETURN COUNT(c);`;

        let session = connection.session();
        let r: StatementResult = await session.run(query, {
            cUnique: character.Unique,
            gsUnique: game.Unique
        });

        return false;
    }

    static async findByUnique(unique: string): Promise<GameSession> {
        let query = `MATCH (gs:GameSession) WHERE gs.Unique = {hash} RETURN gs`;
        let session = connection.session();

        let r: StatementResult = await session.run(query, {
            hash: unique
        });

        session.close();
        return r.records
            .map(rec => rec.get(0) as Node)
            .map((node: Node) => SimpleDataDeserializer.deserialize(new GameSession(), node))
            .shift();
    }

    static async getCharacters(game: GameSession): Promise<GameCharacter[]> {
        //
        let query = `MATCH (gs:GameSession)<-[a:InSession]-(c:Character) WHERE gs.Unique = {hash} RETURN c, a`;
        let session = connection.session();

        let r: StatementResult = await session.run(query, {
            hash: game.Unique
        });

        session.close();
        return r.records.map((r: Record) => GameSessionNodeHelper.remapGameCharacter(r));
    }

    static remapGameCharacter(r: Record): GameCharacter {
        let characterNode: Node = r.get(0);
        let relation: Relationship = r.get(1);

        let gc: GameCharacter = SimpleDataDeserializer.deserialize(
            new GameCharacter(),
            characterNode
        );
        let gcrel: GameCharacterRelationship = SimpleDataDeserializer.mapRelationship<
            GameCharacterRelationship
        >({ initiative: 0 }, relation);

        gc.Initiative = gcrel.initiative;
        return gc;
    }

    static async getDungeonMasters(game: GameSession): Promise<User[]> {
        let query = `MATCH (gs:GameSession)<-[:RunningSession]-(u:User) WHERE gs.Unique = {hash} RETURN u`;
        let session = connection.session();

        let r: StatementResult = await session.run(query, {
            hash: game.Unique
        });

        let masters: User[] = r.records.map((r: Record) => r.get(0)).map((n: Node) => {
            return SimpleDataDeserializer.deserialize(new User(), n);
        });

        session.close();
        return masters;
    }
}
export default GameSession;
