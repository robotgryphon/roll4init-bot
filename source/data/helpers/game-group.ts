import { Group, User, Guild } from "@roll4init/objects";
import { connection } from "../connection";
import { StatementResult, Node } from "neo4j-driver/types/v1";
import { SimpleDataDeserializer } from "../serializers/SimpleDataDeserializer";

/**
 * A group represents a group of players and dungeon masters.
 * Can have multiple per guild.
 */
export class GroupNodeHelper {
    async getPlayers(group: Group): Promise<User[]> {
        let query = `MATCH (p:Player)-[:InGroup]->(g:Group) WHERE g.Unique = {gID} RETURN p`;
        let session = connection.session();

        let r: StatementResult = await session.run(query, {
            gID: group.Unique
        });

        return r.records
            .map(rec => rec.get(0) as Node)
            .map(node =>
                SimpleDataDeserializer.deserialize<User>(new User(), node)
            );
    }

    static async findByGuild(guild: Guild): Promise<Group[]> {
        let query = `MATCH (g:Group)-[:InGuild]->(gu:Guild) WHERE gu.GuildId = {guildID} RETURN g`;
        let session = connection.session();

        let r: StatementResult = await session.run(query, {
            guildID: guild.GuildId
        });

        return r.records
            .map(rec => rec.get(0) as Node)
            .map(node =>
                SimpleDataDeserializer.deserialize<Group>(new Group(), node)
            );
    }
}
