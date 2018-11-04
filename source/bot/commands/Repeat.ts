import { ICommandHandler, CommandData } from "../ICommandHandler";
import { Message, GuildChannel, TextChannel } from "discord.js";
import { CommandError } from "../Errors";
import { DiscordBot } from "../Bot";

export class RepeatCommandHandler implements ICommandHandler {
	command: string;

	constructor() {
		this.command = "last";
	}

	async process(bot: DiscordBot, command: CommandData): Promise<void> {
        let lastCommand = bot.getLastCommand();
        if(lastCommand)
            return;

        if(lastCommand.handler instanceof RepeatCommandHandler)
            throw new CommandError("Cannot repeat that command.");
            
        lastCommand.handler.process(bot, lastCommand);
	}
}
