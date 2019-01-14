import { SchemaDirectiveVisitor } from "graphql-tools"
import { DirectiveLocation, GraphQLDirective, GraphQLList, GraphQLString } from "graphql"
import { AuthorizationError } from '../errors'
import admin from '../modules/firebase'

export class IsAuthenticatedDirective extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration(directiveName, schema) {
    return new GraphQLDirective({
      name: "isAuthenticated",
      locations: [DirectiveLocation.FIELD_DEFINITION]
    });
  }
  
  // visitObject(obj) {
  //   const fields = obj.getFields();

  //   Object.keys(fields).forEach(fieldName => {
  //     const field = fields[fieldName];
  //     field.resolve = async function(result, args, context, info) {
  //       if (!context || !context.req || !context.req.headers || !context.req.headers.authorization) {
  //         throw new AuthorizationError({ message: "No authorization token." });
  //       }
  //       const token = context.req.headers.authorization;
  //       try {
  //         const id_token = token.replace("Bearer ", "");

  //         console.log(`visit object => ${id_token}`)
      
  //         const decoded = jwt.verify(id_token, process.env.JWT_SECRET, {
  //           algorithms: ["RS256"]
  //         });
  //         console.log(result)

  //         return result[fieldName];
  //       } catch (err) {
  //         throw new AuthorizationError({ message: "You are not authorized." });
  //       }
  //     }
  //   })
  // }

  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async (...args) => {

      const ctx = args[2]
      if (!ctx || !ctx.req || !ctx.req.headers || !ctx.req.headers.authorization) {
        throw new AuthorizationError({ message: "No authorization token." })
      }
      const token = ctx.req.headers.authorization

      try {
        const id_token = token.replace("Bearer ", "")

        // authorization process
        const { uid, error } = await admin.auth().verifyIdToken(id_token)
          .then((decodedToken) => {
            const uid = decodedToken.uid
            return { uid }
          })
          .catch((error) => {
            return { error }  
          })

        const params = args[1]
        if(!params || !params.uid || uid !== params.uid) {
          throw "You supply a wrong token for Authorization."
        }

        return resolve.apply(this, args)
      }
      catch (e) {
        throw new AuthorizationError({ message: "You are not authorized." })
      }
    }
  }
}

export class hasScopeDirective extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration(directiveName, schema) {
    return new GraphQLDirective({
      name: "hasScope",
      locations: [DirectiveLocation.FIELD_DEFINITION],
      args: {
        scopes: {
          type: new GraphQLList(GraphQLString)
        }
      }
    })
  }

  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    field.resolve = (...args) => {

      const ctx = args[2]
      if (!ctx || !ctx.req || !ctx.req.headers || !ctx.req.headers.authorization) {
        throw new AuthorizationError({ message: "No authorization token." })
      }
      const token = ctx.req.headers.authorization
      
      const expectedScopes = this.args.scopes

      try {
        const id_token = token.replace("Bearer ", "")
          
        const uid = "sample_user"
        const params = args[1]

        const { result, error } = paramsValidater(expectedScopes, params, uid)
        if( error ) {
          throw error
        }

        return resolve.apply(this, args)
      }
      catch (e) {
        throw new AuthorizationError({ message: "You are not authorized." })
      }
    }
  }
}

const paramsValidater = (scopes, params, uid) => {
  const scope = scopes[0]
  
  switch (scope) {
    case 'novel:create':
      if(!params || !params.writer || uid !== params.writer) {
        const error =  "You supply a wrong token for Authorization."
        return { error }
      }
      else {
        const result = true
        return { result }
      }
      break
  }
}