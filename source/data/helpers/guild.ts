import { connection } from "../connection";
import { StatementResult, Node, Integer } from "neo4j-driver/types/v1";
import { SimpleDataDeserializer } from "../serializers/SimpleDataDeserializer";
import { Guild, User } from "@roll4init/objects";
import { UserAlreadyExistsError } from "../../errors/UserErrors";
import { SimpleDataSerializer } from "../serializers/SimpleDataSerializer";

/*
 * A guild represents a collection of groups of people, that together form a large collection
 * of players and dungeon masters.
 */
export class GuildNodeHelper {
    static async createGuild(newGuild: Guild): Promise<boolean> {
        let session = connection.session();
        let exists = await GuildNodeHelper.exists(newGuild.GuildId);
        if (exists) return false;

        let data = SimpleDataSerializer.serialize(newGuild);
        let response = await session.run(`CREATE (g:Guild) SET g += {props}`, { props: data });
        let created = response.summary.counters.nodesCreated();
        return created > 0;
    }

    static async exists(guildID: string): Promise<boolean> {
        let session = connection.session();
        let count = await session.run(`MATCH (gu:Guild { GuildId: {id} }) RETURN count(gu) > 0`, {
            id: guildID
        });

        return count.records.shift().get(0) as boolean;
    }

    static async findByID(guildID: string): Promise<Guild> {
        let query = `MATCH (gu:Guild { GuildId: {guildID}}) RETURN gu`;
        let session = connection.session();

        let r: StatementResult = await session.run(query, {
            guildID: guildID
        });

        session.close();
        return r.records
            .map(rec => rec.get(0) as Node)
            .map(node => SimpleDataDeserializer.deserialize<Guild>(new Guild(), node))
            .shift();
    }

    static async hasPlayer(guild: Guild, player: User): Promise<boolean> {
        let query = `MATCH (p:Player { Unique: {player} })-->(gr:Group)-->(gu:Guild { GuildId: {guild}})
			RETURN DISTINCT COUNT(p);`;

        let session = connection.session();
        let r: StatementResult = await session.run(query, {
            player: player.Unique,
            guild: guild.GuildId
        });

        let count: Integer = r.records.shift().get(0);
        return count.toNumber() == 1;
    }

    static async addPlayer(guild: Guild, player: User): Promise<boolean> {
        let has = await this.hasPlayer(guild, player);
        if (has) throw new UserAlreadyExistsError();

        return false;
    }
}
