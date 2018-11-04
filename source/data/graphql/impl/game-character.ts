import { readFile } from "fs-extra";
import { join } from "path";
import { GameCharacter } from "@roll4init/objects";
import { CharacterNodeHelper } from "../../helpers/character";

// load character.graphql
let GameCharacterSchema: string;
readFile(join(__dirname, "..", "schemas", "game-character.graphql"), "utf-8").then(
    data => (GameCharacterSchema = data)
);

let GameCharacterResolvers = {
    GameCharacter: {
        StrengthMod: (character: GameCharacter) => character.getModifier(character.Scores.Strength),
        DexterityMod: (character: GameCharacter) =>
            character.getModifier(character.Scores.Dexterity),

        Owner: (character: GameCharacter) => CharacterNodeHelper.getOwner(character),
        Created: (character: GameCharacter) =>
            character.Created ? character.Created.toISO() : null
    }
};

export { GameCharacterSchema, GameCharacterResolvers };
