const express = require('express')
const expressGraphQL = require('express-graphql')
const fetch = require('node-fetch')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLUnionType,
  GraphQLBoolean
} = require('graphql')
const { json, text } = require('express')
const app = express()

const BASE_URL = 'https://sites.lib.uh.edu/kmneuma2/api/items?collection=3';

function fetchCoinsByUrl(url) {
  return fetch(url).then(res => res.json())
}

const ElementTextsType = new GraphQLObjectType({
  name: 'FindByElementTexts',
  description: 'Represents elements texts',
  fields: () => ({
    html: { type: GraphQLNonNull(GraphQLBoolean) },
    text: { type: GraphQLNonNull(GraphQLString)},
    element_set: { type: ElementSetType },
    element: { type: ElementType }
  })
})

const ElementSetType = new GraphQLObjectType({
  name: 'FindByElementSetType',
  description: 'Represents the element set of the coin',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    url: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    resource: { type: GraphQLNonNull(GraphQLString) }
  })
})

const ElementType = new GraphQLObjectType({
  name: 'FindByElementType',
  description: 'Represents the element of the coin',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    url: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    resource: { type: GraphQLNonNull(GraphQLString) }
  })
})

const CoinType = new GraphQLObjectType({
  name: 'FindbyId',
  description: 'Represents finding coins by ID',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    url: { type: GraphQLNonNull(GraphQLString) },
    public: { type: GraphQLNonNull(GraphQLBoolean) },
    featured: { type: GraphQLNonNull(GraphQLBoolean)},
    added: { type: GraphQLNonNull(GraphQLString) },
    modified: { type: GraphQLNonNull(GraphQLString) },
    item_type: {
      type: ItemType
    },
    collection: {
      type: CollectionType
    },
    owner: {
      type: OwnerType
    },
    files: {
      type: FilesType
    },
  })
})

const ItemType = new GraphQLObjectType({
  name: 'FindByItemType',
  description: 'Represents the item type of the coin',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    url: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    resource: { type: GraphQLNonNull(GraphQLString) }
  })
})

const CollectionType = new GraphQLObjectType({
  name: 'FindByCollectionType',
  description: 'Represents the collection type of the coin',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    url: { type: GraphQLNonNull(GraphQLString) },
    resource: { type: GraphQLNonNull(GraphQLString) }
  })
})

const OwnerType = new GraphQLObjectType({
  name: 'FindByOwnerType',
  description: 'Represents the owner type of the coin',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    url: { type: GraphQLNonNull(GraphQLString) },
    resource: { type: GraphQLNonNull(GraphQLString) }
  })
})

const FilesType = new GraphQLObjectType({
  name: 'FindByFilesType',
  description: 'Represents the owner type of the coin',
  fields: () => ({
    count: { type: GraphQLNonNull(GraphQLInt) },
    url: { type: GraphQLNonNull(GraphQLString) },
    resource: { type: GraphQLNonNull(GraphQLString) }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query',
  fields: () => ({
    coins: {
      type: new GraphQLList(CoinType),
      description: 'Respresents a list of all IDs',
      args: {
        id: { type: GraphQLString }
      },
      resolve: () => fetchCoinsByUrl(BASE_URL)
    },
    element_texts: {
      type: new GraphQLList(ElementTextsType),
      description: 'Represents a list of elements texts',
      args: {
        text: { type: GraphQLString }
      },
      resolve: () => fetchCoinsByUrl(BASE_URL)
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType
})

app.use('/', expressGraphQL({
  schema: schema,
  graphiql: true
}))
app.listen(3000, () => console.log('Server Running'))