import { readFile } from "fs-extra";
import { join } from "path";
import { GameSession } from "@roll4init/objects";
import { GameSessionNodeHelper } from "../../helpers/game-session";

// load character.graphql
let GameSessionSchema: string;
readFile(join(__dirname, "..", "schemas", "game-session.graphql"), "utf-8").then(
    data => (GameSessionSchema = data)
);

// Local imports

let GameSessionResolvers = {
    GameSession: {
        dungeonMasters: (gs: GameSession) => GameSessionNodeHelper.getDungeonMasters(gs),
        characters: (gs: GameSession) => GameSessionNodeHelper.getCharacters(gs)
    }
};

export { GameSessionSchema, GameSessionResolvers };
