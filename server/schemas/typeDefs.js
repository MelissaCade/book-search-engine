const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
    bookCount: Int
  }

  type Book {
    _id: ID
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  input InputBook {
    bookId: String
    title: String
    authors: [String]
    description: String
    image: String
    forSale: String
    link: String
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(newBook: InputBook): User
    deleteBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
