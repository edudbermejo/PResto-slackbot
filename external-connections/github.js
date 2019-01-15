const { GraphQLClient } = require('graphql-request')

const githubAPIEndpoint = 'https://api.github.com/graphql'

exports.graphClient = new GraphQLClient(githubAPIEndpoint, {
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  },
})