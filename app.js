const express = require("express")
const app = express()
const { buildSchema } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const axios = require("axios")
const PORT = 3000

const schema = buildSchema(
  `
    type company {
      name: String
      catchPhrase: String
      bs: String
    }

    type user {
      id: ID
      name: String
      email: String
      username: String
      company: company
    }

    input userInput{
      name: String!
      email: String!
    }

    type Query {
      hello: String
      getAllUsers: [user]
      getUserById(id: Int): user
    }

    type Mutation {
      addUser(data: userInput): String
    }
  `
)

const root = {
  hello: () => {
    return "Hello from graphql"
  },

  getAllUsers: async () => {
    try {
      const { data } = await axios.get("https://jsonplaceholder.typicode.com/users")

      return data
    } catch (error) {
      return error
    }
  },

  getUserById: async (args) => {
    try {
      const { id } = args

      const { data } = await axios.get("https://jsonplaceholder.typicode.com/users/" + id)

      return data
    } catch (error) {
      return error
    }
  },

  addUser: async (args) => {
    try {
      // anggap aja ada query insert into database
      const { data } = args
      console.log(data, "<< data");

      return "Success add user"
    } catch (error) {
      return error
    }
  }
}

app.use("/", graphqlHTTP({
  schema: schema, // schema base
  rootValue: root, // resolver
  graphiql: true
}))

app.listen(PORT, () => {
  console.log("App running on port: ", PORT);
})