import express from 'express';
import { createServer } from 'http';
import { PubSub } from 'apollo-server';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();

const pubsub = new PubSub();
const MESSAGE_CREATED = 'MESSAGE_CREATED';

const typeDefs = gql`
  type Query {
    messages: [Message!]!
    author(id: String): Author!
  }

  type Mutation {
    addMessage(id: Int, content: String, authorId: Int): Boolean
  }

  type Subscription {
    messageCreated: Message
  }

  type Message {
    id: String
    content: String
    author: Author
  }

  type Author {
    id: String
    name: String
  }
`;

const authors = [
  { id: 88, name: 'Anne' },
  { id: 99, name: 'Joe' },
];

const messages = [
  { id: 0, content: 'Hello!', authorId: 99 },
  { id: 1, content: 'Bye!', authorId: 88 },
];

const resolvers = {
  Query: {
    messages: () => messages.map(({id, content}) => ({ id, content })),
  },
  Mutation: {
    addMessage: (_, { id, content, authorId}) => {
      messages.push({id, content, authorId });
      pubsub.publish(MESSAGE_CREATED, {
        messageCreated: { id, content, authorId },
      });
      return true;
    }
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(MESSAGE_CREATED),
    },
  },
  Message: {
    id: (parent, _, __) => parent.id,
    content: (parent, _, __) => parent.content,
    author: ({ id }) => {
      const {authorId} = messages.filter(message => message.id === id)[0];
      return authors.filter(author => author.id === authorId)[0];
    }
  },
  Author: {
    id: (parent, _, __) => parent.id,
    name: (parent, _, __) => parent.name,
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});

let id = 2;