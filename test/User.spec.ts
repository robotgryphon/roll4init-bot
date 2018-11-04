import { UserNodeHelper } from "../source/data/helpers/User";
import dotenv from "dotenv";

import { expect } from "chai";
import { User } from "@roll4init/objects";

dotenv.config();

describe("User", () => {
    before(async () => {
        let exists = UserNodeHelper.findByUsername("test");
        if (exists) return;

        let testUser: User = new User();
        testUser.Username = "test";
        testUser.NameFirst = "Test";
        testUser.NameLast = "User";
        testUser.DiscordId = "0";
        // testUser.save();
    });

    it("Should be able to fetch a user by Username.", async () => {
        let user = await UserNodeHelper.findByUsername("test");
        if (!user)
            expect.fail(
                null,
                "User",
                "Test User may not be defined in the database, or could not be retrieved."
            );

        expect(user.DiscordId).to.equal("0");
        expect(user.NameFirst).to.equal("Test");
        expect(user.NameLast).to.equal("User");
    });

    it("Should be able to fetch a user by Discord ID.", async () => {
        let user = await UserNodeHelper.findByDiscord("0");
        if (!user)
            expect.fail(
                null,
                "User",
                "Test User may not be defined in the database, or could not be retrieved."
            );

        expect(user.Username).to.equal("test");
        expect(user.NameFirst).to.equal("Test");
        expect(user.NameLast).to.equal("User");
    });

    it("Should be able to save data again.", async () => {
        let user = await UserNodeHelper.findByUsername("test");
        if (!user)
            expect.fail(
                null,
                "User",
                "Test User may not be defined in the database, or could not be retrieved."
            );

        expect(user.NameFirst).to.equal("Test");

        let lastSaved = user.LastModified;
        await UserNodeHelper.saveUser(user);

        let newUser = await UserNodeHelper.findByUsername("test");
        let newSaved = newUser.LastModified;

        expect(lastSaved).to.not.eq(newSaved, "Saved times are the same");
    });
});
