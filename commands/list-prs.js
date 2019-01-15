exports.listCommandRegex = /listprs/

const { graphClient } = require('../external-connections/github')

const prColors = {
  clean: "#99ffcc",
  dirty: "#ff9900",
  shiny: "#2eb82e"
}

const buildPRMessage = (repos) => {
  let repositoriesPromises = []
  let answer = {
    text: "This is the list of opened PRs for your team",
    attachments: []
  }
  repos.map(repo => {
    const repoPromise = graphClient.request(`{
      repository(owner: "saksdirect", name: "${repo}") {
        pullRequests (first: 10, states: OPEN){
          nodes {
            repository {
              name
            },
            title,
            labels (first: 5) {
              nodes {
                name
              }
            },
            author {
              avatarUrl,
              login
            },
            reviews (first: 4, states: [CHANGES_REQUESTED, APPROVED, COMMENTED]){
              nodes {
                id,
                state
              }
            }
            url,
            mergeable
          }
        }
      }
    }`)

    repositoriesPromises.push(repoPromise)
  })

  return Promise.all(repositoriesPromises).then(repositories => {
    repositories.map(repositoryContainer => {
      const repository = repositoryContainer.repository
      if (repository.pullRequests.nodes.length !== 0) {
        repository.pullRequests.nodes.map((pullRequest) => {
          if ((!pullRequest.labels.nodes.some(label=> label.name === 'donotmerge' || label.name === 'WIP'))
            && pullRequest.mergeable !== 'CONFLICTING') {
            let prStatus = 'clean'
            const hasChangesRequested = pullRequest.reviews.nodes.some(review => review.state === 'CHANGES_REQUESTED' || review.state === 'COMMENTED')
            const isApproved = pullRequest.reviews.nodes.some(review => review.state === 'APPROVED') 
            if (hasChangesRequested) {
              prStatus = 'dirty'
            } else if (isApproved) {
              prStatus = 'shiny'
            }

            const prObject = {
              title: pullRequest.title,
              title_link: pullRequest.url,
              text: pullRequest.repository.name,
              author_name: pullRequest.author.login,
              author_icon: pullRequest.author.avatarUrl,
              color: prColors[prStatus]
            }
            answer.attachments.push(prObject)
          }
        })
      }
    })

    if (answer.attachments.length == 0) {
      answer.text = "Yey! There is no unattended PRs for your channel! :party: :partyparrot:"
    }

    return answer
  })
}

exports.listPRs = async ({web, db, channel, res}) => {
  const channelObject = await db.retrieve(channel)

  if (channel) {
    if (!channelObject || channelObject.repositories.length === 0) {
      res.json({ text: `Your channel is currently not watching any repositories. Please use */watchrepo* command to start watching some. :eye:` })
    } else {
      res.json()
      const message = await buildPRMessage(channelObject.repositories)
      message.channel = channel
      web.chat.postMessage(message)
    }
  } else {
    res.json()
    if(channelObject.length !== 0) {
      channelObject.forEach(async ({repositories: channelRepos}) => {
        if (channelRepos.length !== 0) {
          const message = await buildPRMessage(channelRepos)
          message.channel = channel
          web.chat.postMessage(message)
        }
      })
    }
  }
  return res
}