import { neo4jgraphql } from 'neo4j-graphql-js'

export const typeDefs = `
  type Movie {
    title: ID!
    tagline: String
    released: Int
  }

  type Query {
    Movie(title: String, tagline: String, released: Int): [Movie]
  }
`
export const resolvers = {
  Query: {
    Movie(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo)
    },
  }
}