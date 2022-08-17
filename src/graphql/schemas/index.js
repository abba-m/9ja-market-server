const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type article {
  id: Int!
  title: String!
  desc: String!
}

type RootQuery {
  articles: [article!]!
}

type RootMutation {
  createArticle(title: String, desc: String): article
  deleteArticle(id: Int): [article!]!
}

schema {
  query: RootQuery
  mutation: RootMutation
}
`);
