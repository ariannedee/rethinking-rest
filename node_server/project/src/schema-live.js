const graphql = require('graphql');
const knex = require('../db');

const UserType = new graphql.GraphQLObjectType({
  name: "User",
  description: "A user in our system",
  fields: {
    id: {
      type: graphql.GraphQLID,
      resolve(user) {
        return user.id;
      }
    },
    username: {
      type: graphql.GraphQLString,
      resolve(user) {
        return user.username;
      }
    },
    isAdmin: {
      type: graphql.GraphQLBoolean,
      resolve(user) {
        return user.role === "admin";
      }
    },
  }
});

const BookType = new graphql.GraphQLObjectType({
  name: "Book",
  fields: {
    id: {
      type: graphql.GraphQLID,
      resolve(book) {
        return book.id;
      }
    }
  }
});

const queryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    users: {
      type: graphql.GraphQLList(UserType),
      resolve() {
        return knex('user');
      }
    },
    books: {
      type: graphql.GraphQLList(BookType),
      resolve() {
        return knex('book');
      }
    }
  }
});

const schema = new graphql.GraphQLSchema({query: queryType});

module.exports = schema;