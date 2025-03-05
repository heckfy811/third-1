const { ApolloServer, gql } = require('apollo-server');
const products = require('./backend/products.json');
console.log(products);

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Int!
    description: String!
    categories: [String!]!
  }

  type Query {
    products: [Product!]!
  }
`;

const resolvers = {
  Query: {
    products: () => products,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`GraphQL сервер запущен на ${url}`);
});