const express = require('express')
const expressGraphQL = require('express-graphql')
const fetch = require('node-fetch')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')
const { json, text } = require('express')
const app = express()

const BASE_URL = 'https://sites.lib.uh.edu/kmneuma2/api/items?page=2';

function fetchPersonByURL(url) {
  return fetch(url).then(res => res.json())
}

function fetchDetailsByURL(url) {
  return fetch(url).then(res => res.element_texts.json())
}

// function fetchCoinDetailsByURL(url) {
//   // return fetch(url).then(res => res.json())
//   const response = await fetch('https://sites.lib.uh.edu/kmneuma2/api/items?page=2');
//   resp = response.json();
//   return resp.element_texts;
// }

// function fetchElementTextsByUrl(url) {
//   return fetch(url).then(res => json())
// }

const CoinType = new GraphQLObjectType({
  name: 'Coin',
  description: 'These are details about the coin',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    url: { type: GraphQLNonNull(GraphQLString) },
  })
})

const ElementTextsType = new GraphQLObjectType({
  name: 'Element Details',
  description: 'Represents the details of the coin',
  fields: () => ({
      text: { type: GraphQLNonNull(GraphQLString) }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    coins: {
      type: new GraphQLList(CoinType),
      description: 'List of all ids',
      args: {
        id: { type: GraphQLString }
      },
      resolve: () => fetchPersonByURL(BASE_URL)
    },
    url: {
      type: new GraphQLList(CoinType),
      description: 'List of all url',
      args: {
        url: { type: GraphQLString }
      },
      resolve: () => fetchPersonByURL(BASE_URL)
    },
    // element_texts: {
    //   type: new GraphQLList(ElementTextsType),
    //   description: 'Details of the coin',
    //   args: {
    //     text: { type: GraphQLString }
    //   },
    //   resolve: () => fetchDetailsByURL(BASE_URL)
    // }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType
})

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}))
app.listen(5000, () => console.log('Server Running'))