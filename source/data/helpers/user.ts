import { Node, StatementResult, Integer, Session } from "neo4j-driver/types/v1";
import { DateTime } from "luxon";

import { User, Character } from "@roll4init/objects";

import { connection } from "../connection";
import { SimpleDataDeserializer } from "../serializers/SimpleDataDeserializer";
import { SimpleDataSerializer } from "../serializers/SimpleDataSerializer";

export class UserNotFoundError extends Error {}

export class UserNodeHelper {
    static async findByUsername(username: string): Promise<User> {
        let query = `MATCH (u:User { Username: {uname}}) RETURN u`;
        let session = connection.session();

        let r: StatementResult = await session.run(query, {
            uname: username
        });

        return r.records
            .map(rec => rec.get(0) as Node)
            .map(node => SimpleDataDeserializer.deserialize(new User(), node))
            .shift();
    }

    static async createNewDiscord(discord: string): Promise<User> {
        let query = `CREATE (u:User { DiscordId: {discord}, DateJoined: {joinDate}, NeedsSetup: true  }) RETURN u`;

        let session: Session;
        try {
            session = connection.session();
            let r: StatementResult = await session.run(query, {
                discord: discord,
                joinDate: DateTime.utc()
            });

            return r.records
                .map(rec => rec.get(0) as Node)
                .map(node => SimpleDataDeserializer.deserialize(new User(), node))
                .shift();
        } catch (e) {
            throw new Error("Failed to get user: " + e);
        } finally {
            session.close();
        }
    }

    static async findByDiscord(discord: string): Promise<User> {
        let match = "MATCH (u:User) WHERE u.DiscordId = {discord} RETURN count(*)";
        let session = connection.session();

        try {
            let results = await session.run(match, { discord: discord });
            let count: number = (results.records[0].get(0) as Integer).toInt();

            let query;
            if (count > 0) {
                query = `MATCH (u:User) WHERE u.DiscordId = {discord} RETURN u`;
                let r: StatementResult = await session.run(query, {
                    discord: discord
                });

                return r.records
                    .map(rec => rec.get(0) as Node)
                    .map(node => SimpleDataDeserializer.deserialize(new User(), node))
                    .shift();
            } else {
                throw new UserNotFoundError();
            }
        } finally {
            session.close();
        }
    }

    static async getCharacters(user: User): Promise<Character[]> {
        let query =
            "MATCH (u:User)-[:OwnsCharacter]->(c:Character) WHERE u.Unique = {unique} RETURN c";
        try {
            let session = connection.session();
            let result = await session.run(query, { unique: user.Unique });

            let characters: Character[] = result.records
                .map(rec => rec.get(0))
                .map((rec: Node) => SimpleDataDeserializer.deserialize(new Character(), rec));
            session.close();

            return characters;
        } catch {
            return [];
        }
    }

    static async saveUser(user: User): Promise<boolean> {
        let props = SimpleDataSerializer.serialize(user);
        props.LastModified = DateTime.utc().toISO();

        let query = `MATCH (u:User { Unique: {unique}}) SET u += {data} RETURN u`;
        let session = connection.session();

        let trans = session.beginTransaction();
        trans.run(query, { unique: user.Unique, data: props });
        let result = await trans.commit();

        if (result.summary.counters.propertiesSet() > 0) return true;

        return false;
    }
}
