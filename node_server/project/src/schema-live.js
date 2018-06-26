var graphql = require('graphql');
var knex = require('../db');

const HasReadType = new graphql.GraphQLObjectType({
  name: 'HasRead',
  fields: () => {
    return {
      rating: {
        type: graphql.GraphQLInt,
        resolve(hasRead) {
          return hasRead.rating;
        }
      },
      book: {
        type: BookType,
        resolve(hasRead) {
          return knex('book').where('id', hasRead.bookId).first();
        }
      },
      user: {
        type: UserType,
        resolve(hasRead) {
          return knex('user').where('id', hasRead.userId).first();
        }
      },
    }
  }
})

const UserType = new graphql.GraphQLObjectType({
  name: 'User',
  description: 'This represents a User',
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
        return user.role === 'admin';
      }
    },
    booksRead: {
      type: graphql.GraphQLList(HasReadType),
      resolve(user) {
        return knex('hasRead').where('userId', user.id);
      }
    },
    averageRating: {
      type: graphql.GraphQLFloat,
      resolve(user) {
        let query = knex('hasRead')
                    .where('userId', user.id)
                    .avg('rating as avg_rating')
                    .first();
        console.log(query);
        return query['avg_rating'];
      }
    }
  }
});

const BookType = new graphql.GraphQLObjectType({
  name: 'Book',
  fields: {
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
    publishedYear: {
      type: graphql.GraphQLInt,
      resolve(book) {
        return book.publishedYear;
      }
    },
    fiction: {
      type: graphql.GraphQLBoolean,
      resolve(book) {
        return book.fiction;
      }
    },
    readBy: {
      type: graphql.GraphQLList(HasReadType),
      resolve(book) {
        return knex('hasRead').where('bookId', book.id);
      }
    }
  }
});

var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new graphql.GraphQLList(UserType),
      resolve(root, args, context) {
        return knex('user');
      }
    },
    books: {
      type: graphql.GraphQLList(BookType),
      args: {
        fiction: {
          type: graphql.GraphQLBoolean
        }
      },
      resolve(root, args) {
        let query = knex('book');
        if (args.fiction === true) {
          query.where('fiction', true);
        } else if (args.fiction === false) {
          query.where('fiction', false);
        }
        return query
      }
    }
  }
});

var schema = new graphql.GraphQLSchema({query: queryType});
module.exports = schema;