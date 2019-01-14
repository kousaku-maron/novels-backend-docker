import '@babel/polyfill'
import { makeAugmentedSchema } from 'neo4j-graphql-js'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import bodyParser from 'body-parser'
import { v1 as neo4j } from 'neo4j-driver'
import { typeDefs, resolvers } from './schemas/novels-schema'
import { IsAuthenticatedDirective } from "./directives"

const schema = makeAugmentedSchema({
  typeDefs,
  schemaDirectives: {
    isAuthenticated: IsAuthenticatedDirective
  },
  config: {
    query: true,
    mutation: false
  }
})

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'neo4j'
  )
)

const app = express()
app.use(bodyParser.json())

const server = new ApolloServer({
  schema,
  resolvers,
  context: ({ req }) => {
    return {
      driver,
      req,
    }
  },
  playground: {
    endpoint: '/graphql',
    settings: {
      'editor.theme': 'light'
    }
  }
})

server.applyMiddleware({ app })

app.listen(4000, () => {
  console.log(`http://localhost:4000/graphql`)
})

export default app