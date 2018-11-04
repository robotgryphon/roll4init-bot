import * as dotenv from "dotenv";

import { DiscordBot } from "./bot";

import WebSocketServer from "./websocket";

dotenv.config();

let bot = new DiscordBot();
bot.start();

let wss = new WebSocketServer();
wss.start();

process.on("beforeExit", () => {
    wss.stop();
    bot.stop();
});
