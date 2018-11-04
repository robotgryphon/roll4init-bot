import egraphql from "express-graphql";

import loadSchema from "./graphql-schema";

async function middleware() {
	let s = await loadSchema();
	let ExecutableSchema = egraphql({
		schema: s,
		graphiql: true
	});

	return ExecutableSchema;
}

export default middleware;
