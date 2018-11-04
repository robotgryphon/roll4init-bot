import { ICommandHandler, CommandData } from "../ICommandHandler";
import { Message, GuildChannel, TextChannel } from "discord.js";
import { CommandError } from "../Errors";
import { DiscordBot } from "../Bot";

export default class ServerInfo implements ICommandHandler {
	command: string;

	constructor() {
		this.command = "sinfo";
	}

	async process(bot: DiscordBot, command: CommandData): Promise<void> {
		if (command.message.channel instanceof GuildChannel) {
			command.message.channel.send("Server ID: " + command.message.guild.id);
			return;
		}

		throw new CommandError("This is not a server.");
	}
}
