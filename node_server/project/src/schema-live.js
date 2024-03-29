const graphql = require('graphql');
const knex = require('../db');

const userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: () => {
    return {
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
          return user.role === 'admin';
        }
      },
      booksRead: {
        type: graphql.GraphQLList(hasReadType),
        resolve(user) {
          return knex('hasRead').where('userId', user.id);
        }
      }
    }
  }
});

const bookType = new graphql.GraphQLObjectType({
  name: 'Book',
  fields: () => {
    return {
      id: {
        type: graphql.GraphQLID,
        resolve(book) {
          return book.id;
        }
      },
      title: {
        type: graphql.GraphQLString,
        resolve(book) {
          return book.title;
        }
      },
      author: {
        type: graphql.GraphQLString,
        resolve(book) {
          return book.author;
        }
      },
      isFiction: {
        type: graphql.GraphQLBoolean,
        resolve(book) {
          return book.fiction;
        }
      },
      publishedYear: {
        type: graphql.GraphQLInt,
        resolve(book) {
          return book.publishedYear;
        }
      },
      averageRating: {
        type: graphql.GraphQLFloat,
        async resolve(book) {
          let query = await knex('hasRead').where('bookId', book.id)
          .avg('rating as avg_rating')
          .first();
          return Math.round(query['avg_rating'] * 10) / 10;
        }
      }
    }
  }
});

const hasReadType = new graphql.GraphQLObjectType({
  name: 'HasRead',
  fields: {
    rating: {
      type: graphql.GraphQLInt,
      resolve(hasRead) {
        return hasRead.rating;
      }
    },
    book: {
      type: bookType,
      resolve(hasRead) {
        return knex('book').where('id', hasRead.bookId).first();
      }
    },
    user: {
      type: userType,
      resolve(hasRead) {
        return knex('user').where('id', hasRead.userId).first();
      }
    }
  }
});

const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  description: 'The root query object',
  fields: {
    users: {
      type: graphql.GraphQLList(userType),
      resolve() {
        return knex('user');
      }
    },
    books: {
      type: graphql.GraphQLList(bookType),
      args: {
        fiction: {
          type: graphql.GraphQLBoolean
        }
      },
      resolve(root, args) {
        let query = knex('book');

        if (args.fiction != null) {
          query = query.where('fiction', args.fiction);
        }

        return query;
      }
    }
  }
});

const schema = new graphql.GraphQLSchema({query: queryType});

module.exports = schema;