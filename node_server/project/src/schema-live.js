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
})

const queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        users: {
            type: graphql.GraphQLList(UserType),
            resolve (root) {
                return knex('user');
            }
        }
    }
});

const schema = new graphql.GraphQLSchema({query: queryType});

module.exports = schema;