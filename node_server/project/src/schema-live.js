const graphql = require('graphql');
const knex = require('../db');

const UserType = new graphql.GraphQLObjectType({
    name: 'User',
    description: 'A user',
    fields: {
        id: {
            type: graphql.GraphQLID,
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
});

const queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        users: {
            type: graphql.GraphQLList(UserType),
            resolve (root) {
                return knex('user');
            }
        },
        books: {
            type: graphql.GraphQLList(BookType),
            resolve(root) {
                return knex('book');
            }
        }
    }
});

const schema = new graphql.GraphQLSchema({query: queryType});

module.exports = schema;