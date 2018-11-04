import { Channel, Guild, Client, Message, User as DiscordUser } from "discord.js";
import ServerInfo from "./commands/ServerInfo";
import { ICommandHandler, CommandData } from "./ICommandHandler";

import { GroupHandler } from "./commands/GroupHandler";
import { CommandError } from "./Errors";
import { RepeatCommandHandler } from "./commands/Repeat";
import { User } from "@roll4init/objects";

export class DiscordBot {
    protected client: Client;
    protected commandHandlers: {
        [command: string]: ICommandHandler;
    };

    protected lastCommand: CommandData;

    protected userWhitelist: User[];

    constructor() {
        this.client = new Client();
        this.client.token = process.env.DISCORD_BOT_TOKEN;
        this.client.on("message", m => {
            this.messageHandler(m);
        });

        this.commandHandlers = {};
        this.commandHandlers["sinfo"] = new ServerInfo();
        this.commandHandlers["group"] = new GroupHandler();
        this.commandHandlers["last"] = new RepeatCommandHandler();

        this.userWhitelist = new Array<User>();

        let admin = new User();
        admin.DiscordId = "202247953321033729";
        this.userWhitelist.push(admin);
    }

    public getLastCommand(): CommandData | null {
        return this.lastCommand;
    }

    async start() {
        await this.client.login();
        console.log("Discord bot started.");
    }

    async stop() {
        await this.client.destroy();
    }

    isUserWhitelisted(user: DiscordUser): boolean {
        if (this.userWhitelist.length == 0) return true;

        let matching = this.userWhitelist.map(x => x.DiscordId).filter(u => u == user.id);
        return matching.length > 0;
    }

    async messageHandler(message: Message): Promise<void> {
        // If we aren't mentioned, ignore
        let mentioned = message.cleanContent.startsWith(".r4i");
        if (!mentioned) return;

        // Ignore other bots
        if (message.author.bot) return;

        if (!this.isUserWhitelisted(message.author)) {
            message.channel.sendMessage(
                `<@${message.author.id}> You are not whitelisted to use this bot.`
            );
            return;
        }

        let commandArgs: string[] = message.content.split(" ").slice(1);

        let command = commandArgs.shift();

        if (!this.commandHandlers[command]) return;

        let cmd = new CommandData();
        cmd.arguments = commandArgs;
        cmd.handler = this.commandHandlers[command];
        cmd.message = message;

        try {
            await cmd.handler.process(this, cmd);
            this.lastCommand = cmd;
        } catch (error) {
            if (error instanceof CommandError)
                message.channel.send("Error running command: " + (error as CommandError).message);
        }

        return;
    }
}
