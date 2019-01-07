const { createEventAdapter } = require('@slack/events-api')
const { WebClient } = require('@slack/client')
const express = require('express')
const bodyParser = require('body-parser')

const { addCommandRegex, addRepo } = require('./commands/add-repo')
const { listCommandRegex, listPRs } = require('./commands/list-prs')
const { help } = require('./commands/help')
const { setScheduleForPRs } = require('./batch/ping-prs')

const app = express()
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET)
const web = new WebClient(process.env.SLACK_ACCESS_TOKEN)
const port = process.env.PORT || 3000
let watchedRepos = {}

const resetRegex = () => {
  addCommandRegex.lastIndex = 0
  listCommandRegex.lastIndex = 0
}

app.use('/slack/events', slackEvents.expressMiddleware())

setScheduleForPRs({web, watchedRepos})

//When mention display help documentation
slackEvents.on('app_mention', (event) => {
  help(web, event.channel)
})

slackEvents.on('error', console.error)

app.use('/commands/*', bodyParser.urlencoded({ extended: false }))
app.post('/commands/*', (req, res, payload) => {
  const command = req.body.command
  let answer = {}

  if (addCommandRegex.test(command)) {
    answer = addRepo({watchedRepos, req, res})
  } else if (listCommandRegex.test(command)) { 
    answer = listPRs({watchedRepos, res, web, channel: req.body.channel_id})
  }

  resetRegex()
  
  return answer
})


app.listen(port, () => console.log(`Server listening on port ${port}`))
