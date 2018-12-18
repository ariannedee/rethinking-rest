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
        }
    }
});

const schema = new graphql.GraphQLSchema({query: queryType});

module.exports = schema;