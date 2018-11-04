import { readFile } from "fs-extra";
import { join } from "path";
import { Character } from "@roll4init/objects";
import { CharacterNodeHelper } from "../../helpers/character";

// load character.graphql
let CharacterSchema: string;
readFile(join(__dirname, "..", "schemas", "character.graphql"), "utf-8").then(
    data => (CharacterSchema = data)
);

let CharacterResolvers = {
    Character: {
        Strength: (c: Character) => c.Scores.Strength,
        Dexterity: (c: Character) => c.Scores.Dexterity,
        Constitution: (c: Character) => c.Scores.Constitution,
        Wisdom: (c: Character) => c.Scores.Wisdom,
        Intelligence: (c: Character) => c.Scores.Intelligence,
        Charisma: (c: Character) => c.Scores.Charisma,

        StrengthMod: (character: Character) => character.getModifier(character.Scores.Strength),
        DexterityMod: (character: Character) => character.getModifier(character.Scores.Dexterity),
        ConstitutionMod: (character: Character) =>
            character.getModifier(character.Scores.Constitution),
        WisdomMod: (character: Character) => character.getModifier(character.Scores.Wisdom),
        IntelligenceMod: (character: Character) =>
            character.getModifier(character.Scores.Intelligence),
        CharismaMod: (character: Character) => character.getModifier(character.Scores.Charisma),

        Owner: (character: Character) => CharacterNodeHelper.getOwner(character),
        Created: (character: Character) => (character.Created ? character.Created.toISO() : null)
    }
};

export { CharacterSchema, CharacterResolvers };
