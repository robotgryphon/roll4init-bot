import { readFile } from "fs-extra";
import { join } from "path";
import { User } from "@roll4init/objects";
import { UserNodeHelper } from "../../helpers/User";

// load user.graphql
let UserSchema: string;
readFile(join(__dirname, "..", "schemas", "user.graphql"), "utf-8").then(
    data => (UserSchema = data)
);

let UserResolvers = {
    User: {
        Characters: async (user: User) => UserNodeHelper.getCharacters(user)
    }
};
export { UserSchema, UserResolvers };
