const graphql = require('graphql');
const knex = require('../db');

const UserType = new graphql.GraphQLObjectType({
    name: 'User',
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
        }
    }
});

const BookType = new graphql.GraphQLObjectType({
    name: 'Book',
    fields: {
        id: {
            type: graphql.GraphQLID,
            resolve (book) {
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
        }
    }
})

const queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    description: "I'm a description",
    fields: {
        users: {
            description: "A list of users",
            type: graphql.GraphQLList(UserType),
            resolve (root, args, context) {
                return knex('user');
            }
        },
        books: {
            type: graphql.GraphQLList(BookType),
            resolve (root, args, context) {
                return knex('book');
            }
        }
    }
});

const schema = new graphql.GraphQLSchema({query: queryType});

module.exports = schema;