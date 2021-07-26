/*
const {GraphQLServer, PubSub} = require('graphql-yoga')

const messages = []
//Schema and Queries
/!* Created an key for and that's return an array of messages in typeDefs. So resolver is an function and it's returning an array*!/
/!*Mutations are post methods in the rest world*!/
const typeDefs = `
    type Message { 
        id: ID!
        user: String!
        content : String!
   }
   
    type Query {
        messages : [Message!]  
    } 
    
    type Mutation {
   postMessage(user: String!, content: String!): ID!
    }
    
    type Subscriptions {
    messages : [Message!]  
    }
`;

const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);

/!*You defined you types, So you get the data from resolvers, Resolvers kind of match the keys in the type Definitions *!/
const resolvers = {
    Query: {
        messages: () => messages,
    },
    Mutation: {
        postMessage: (parent, {user, content}) => {
            //postMessage has a bunch if arguments, parent is empty
            const id = messages.length;
            //length of the array and push that content user and Id into the array
            messages.push({
                id,
                user,
                content
            });
            subscribers.forEach((fn) => fn());
            return id
        },
    },

    Subscriptions: {
        messages: {
            subscribe: (parent, args, {pubsub}) => {
                const channel = Math.random().toString(36).slice(2, 15);
                onMessagesUpdates(() => pubsub.publish(channel, {messages}));
                setTimeout(() => pubsub.publish(channel, {messages}), 0);
                return pubsub.asyncIterator(channel);
            },
        },
    },
};

const pubsub = new PubSub();
const server = new GraphQLServer({typeDefs, resolvers, context: {pubsub}});
server.start(({port}) => {
    console.log(`Server on http://localhost:${port}/`);
});*/

const { GraphQLServer, PubSub } = require("graphql-yoga");

const messages = [];

const typeDefs = `
  type Message {
    id: ID!
    user: String!
    content: String!
  }
  type Query {
    messages: [Message!]
  }
  type Mutation {
    postMessage(user: String!, content: String!): ID!
  }
  type Subscription {
    messages: [Message!]
  }
`;

const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);

const resolvers = {
    Query: {
        messages: () => messages,
    },
    Mutation: {
        postMessage: (parent, { user, content }) => {
            const id = messages.length;
            messages.push({
                id,
                user,
                content,
            });
            subscribers.forEach((fn) => fn());
            return id;
        },
    },
    Subscription: {
        messages: {
            subscribe: (parent, args, { pubsub }) => {
                const channel = Math.random().toString(36).slice(2, 15);
                onMessagesUpdates(() => pubsub.publish(channel, { messages }));
                setTimeout(() => pubsub.publish(channel, { messages }), 0);
                return pubsub.asyncIterator(channel);
            },
        },
    },
};

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });
server.start(({ port }) => {
    console.log(`Server on http://localhost:${port}/`);
});
