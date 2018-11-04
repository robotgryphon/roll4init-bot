import { Message } from "discord.js";
import { DiscordBot } from "./Bot";

export class CommandData {
	public handler: ICommandHandler;
	public message: Message;
	public arguments: string[];

	constructor() { }
}

export interface ICommandHandler {
	command: string;

	process(bot: DiscordBot, command: CommandData): Promise<void>;
}
