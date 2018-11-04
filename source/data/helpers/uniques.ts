import Hashids from "hashids";

const UniqueGenerator = new Hashids(process.env.UNIQUES_SALT, 8, "abcdefghijklmnopqrstuvwxyz");

export { UniqueGenerator };
