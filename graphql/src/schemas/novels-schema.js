import { neo4jgraphql } from 'neo4j-graphql-js'

// directive @hasScope(scopes: [String]) on FIELD_DEFINITION
// CreateNovel(title: String!, description: String!, uid: String!): Novel
//       @cypher(statement:"MATCH (u:User {uid: $uid}) MERGE (u)-[:WRITE]->(n:Novel {title: $title, description: $description}) return n")
//       @hasScope(scopes: ["novel:create"])

export const typeDefs = `
  directive @isAuthenticated on FIELD_DEFINITION

  type Novel {
    _id: ID
    uuid: ID!
    title: String!
    description: String!
    created_at: DateTime!
    updated_at: DateTime!
    write_user: User @relation(name: "WRITE", direction: "IN")
    like_users: [User] @relation(name: "LIKE", direction: "IN")
  }

  type User {
    _id: ID
    uid: ID! 
    name: String
    created_at: Date!
    updated_at: Date!
    write_novels: [Novel] @relation(name: "WRITE", direction: "OUT")
    like_novels: [Novel] @relation(name: "LIKE", direction: "OUT")
    follow_users: [User] @relation(name: "FOLLOW", direction: "OUT")
    followers: [User] @relation(name: "FOLLOW", direction: "IN")
  }

  type Like @relation(name:"LIKE") {
    _id: ID
    from: User!
    to: Novel!
    created_at: Int
  }

  type Follow @relation(name:"FOLLOW") {
    _id: ID
    from: User!
    to: User!
    created_at: Int
  }

  type Write @relation(name:"WRITE") {
    _id: ID
    from: User!
    to: Novel!
    created_at: Int
  }

  type Query {
    Novel(_id: ID, title: String, description: String, created_at: Int, updated_at: Int): [Novel]
    User(_id: ID, uid: ID, name: String, created_at: Int): [User]
    Write(_id: ID, created_at: Int): [Write]
    Like(_id: ID, created_at: Int): [Like]
  }

  type Mutation {
    CreateNovel(title: String!, description: String!, uid: String!): Novel
      @cypher(statement:"MATCH (u:User {uid: $uid}) MERGE (u)-[r:WRITE]->(n:Novel {uuid: apoc.create.uuid(), title: $title, description: $description, created_at: apoc.date.format(apoc.date.add(timestamp(), 'ms', 9, 'h'), 'ms'), updated_at: apoc.date.format(apoc.date.add(timestamp(), 'ms', 9, 'h'), 'ms')}) return n")
      @isAuthenticated

    UpdateNovel(update_uuid: String!, title: String, description: String, uid: String!): Novel
      @cypher(statement:"MATCH (u:User {uid: $uid})-[r:WRITE]->(n:Novel {uuid: $update_uuid}) SET n.title = $title, n.description = $description, n.updated_at = apoc.date.format(apoc.date.add(timestamp(), 'ms', 9, 'h'), 'ms') return n")
      @isAuthenticated

    DeleteNovel(delete_uuid: String!, uid: String!): Novel
      @cypher(statement:"MATCH (u:User {uid: $uid})-[r:WRITE]->(n:Novel {uuid: $delete_uuid}) SET n.is_deleted = true, n.updated_at = apoc.date.format(apoc.date.add(timestamp(), 'ms', 9, 'h'), 'ms') return n")
      @isAuthenticated

    UpdateUser(name: String, uid: String!): User
      @cypher(statement:"MATCH (n:User {uid: $uid}) SET n.name = $name, n.updated_at = apoc.date.format(apoc.date.add(timestamp(), 'ms', 9, 'h'), 'ms') return n")
      @isAuthenticated

    Like(like_uuid: String!, uid: String!): Novel
      @cypher(statement:"MATCH (u:User {uid: $uid}), (n:Novel {uuid: $like_uuid}) MERGE (u)-[r:LIKE]->(n) return n")
      @isAuthenticated

    Follow(follow_uid: String!, uid: String!): User
      @cypher(statement:"MATCH (u:User {uid: $uid}), (n:User {uid: $follow_uid}) MERGE (u)-[r:FOLLOW]->(n) return u")
      @isAuthenticated
  }
`

export const resolvers = {
  Query: {
    Novel(obj, args, ctx, info) {
      return neo4jgraphql(obj, args, ctx, info)
    },
    User(obj, args, ctx, info) {
      return neo4jgraphql(obj, args, ctx, info)
    },
  },
  Mutation: {
    CreateNovel(obj, args, ctx, info) {
      return neo4jgraphql(obj, args, ctx, info)
    },
    UpdateNovel(obj, args, ctx, info) {
      return neo4jgraphql(obj, args, ctx, info)
    },
    DeleteNovel(obj, args, ctx, info) {
      return neo4jgraphql(obj, args, ctx, info)
    },
    UpdateUser(obj, args, ctx, info) {
      return neo4jgraphql(obj, args, ctx, info)
    },
    Like(obj, args, ctx, info) {
      return neo4jgraphql(obj, args, ctx, info)
    },
    Follow(obj, args, ctx, info) {
      return neo4jgraphql(obj, args, ctx, info)
    },
  }
}
