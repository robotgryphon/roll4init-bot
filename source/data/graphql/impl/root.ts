import { GameSessionNodeHelper } from "../../helpers/game-session";
import { UserNodeHelper } from "../../helpers/User";

let RootResolvers = {
    RootQuery: {
        session: (root: any, args: any) => {
            if (!args.hash) return null;

            let hash = args.hash;
            return GameSessionNodeHelper.findByUnique(hash);
        },

        userByUsername: (root: any, args: any) => {
            if (!args.username) return null;

            return UserNodeHelper.findByUsername(args.username);
        },

        userByDiscord: (root: any, args: any) => {
            if (!args.discord) return null;

            return UserNodeHelper.findByDiscord(args.discord);
        }
    }
};

export { RootResolvers };
