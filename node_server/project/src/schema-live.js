const graphql = require('graphql');
const knex = require('../db');

const userType = new graphql.GraphQLObjectType( {
  name: 'User',
  description: 'A user in the system',
  fields: () => {
    return {
      id: {
        type: graphql.GraphQLInt,
        resolve (user) {
          return user.id;
        }
      },
      username: {
        type: graphql.GraphQLString,
        resolve (user) {
          return user.username;
        }
      },
      isAdmin: {
        type: graphql.GraphQLBoolean,
        resolve (user) {
          return user.role == 'admin';
        }
      },
      booksRead: {
        type: graphql.GraphQLList(hasReadType),
        resolve (user) {
          return knex('hasRead').where('userId', user.id);
        }
      },
    }
  }
});

const bookType = new graphql.GraphQLObjectType( {
  name: 'Book',
  fields: () => {
    return {
      id: {
        type: graphql.GraphQLInt,
        resolve (book) {
          return book.id;
        }
      },
      title: {
        type: graphql.GraphQLString,
        resolve (book) {
          return book.title;
        }
      },
      author: {
        type: graphql.GraphQLString,
        resolve (book) {
          return book.author;
        }
      },
      fiction: {
        type: graphql.GraphQLBoolean,
        resolve (book) {
          return book.fiction;
        }
      },
      publishedYear: {
        type: graphql.GraphQLInt,
        resolve (book) {
          return book.publishedYear;
        }
      },
    }
  }
});

const hasReadType = new graphql.GraphQLObjectType( {
  name: 'HasRead',
  fields: () => {
    return {
      rating: {
        type: graphql.GraphQLInt,
        resolve (hasRead) {
          return hasRead.rating;
        }
      },
      book: {
        type: graphql.GraphQLNonNull(bookType),
        resolve (hasRead) {
          return knex('book').where('id', hasRead.bookId).first();
        }
      },
    }
  }
});

const queryType = new graphql.GraphQLObjectType({ 
  name: 'Query',
  fields: {
    users: {
      type: graphql.GraphQLList(userType),
      resolve () {
        return knex('user');
      }
    },
    books: {
      type: graphql.GraphQLList(bookType),
      resolve () {
        return knex('book');
      }
    },
  }
});

const schema = new graphql.GraphQLSchema({query: queryType});

module.exports = schema;