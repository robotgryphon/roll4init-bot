import dotenv from "dotenv";

import { connection } from "../source/data/connection";

import { expect } from "chai";
import { GuildNodeHelper } from "../source/data/helpers/guild";
import { UserNodeHelper } from "../source/data/helpers/User";
import { Guild } from "@roll4init/objects";

before(async () => {
    let newGuild = new Guild();
    newGuild.GuildId = "test";
    newGuild.GuildName = "Test Guild";
    newGuild.DiscordId = "test";

    await GuildNodeHelper.createGuild(newGuild);
});

describe("Guild", async () => {
    it("can be retrieved by a unique", async () => {
        let guild = await GuildNodeHelper.findByID("test");

        expect(guild.GuildName)
            .to.be.a("string")
            .and.eq("Test Guild");

        expect(guild.GuildId).to.eq("test");
    });

    it("can find its players", async () => {
        let guild = await GuildNodeHelper.findByID("test");
        let player = await UserNodeHelper.findByUsername("test");

        let inGuild = await GuildNodeHelper.hasPlayer(guild, player);

        expect(inGuild).to.be.false;
    });
});
