FROM node:8.9.4-alpine
ENV NODE_ENV=product
RUN npm install apollo-server-express cors express graphql graphql-tag neo4j-driver neo4j-graphql-js firebase-admin @babel/polyfill
WORKDIR /app
EXPOSE 4000