const { createEventAdapter } = require('@slack/events-api')
const { WebClient } = require('@slack/client')
const express = require('express')
const bodyParser = require('body-parser')

const { addCommandRegex, addRepo } = require('./commands/add-repo')
const { listCommandRegex, listPRs } = require('./commands/list-prs')
const { unwatchCommandRegex, unwatchRepo } = require('./commands/unwatch-repo')
const { help } = require('./commands/help')
const { setScheduleForPRs } = require('./batch/ping-prs')
const { db } = require('./database/mongo')
const { englishBreakfast } = require('./batch/tea-time')

const app = express()
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET)
const web = new WebClient(process.env.SLACK_ACCESS_TOKEN)
const port = process.env.PORT || 3000

const resetRegex = () => {
  addCommandRegex.lastIndex = 0
  listCommandRegex.lastIndex = 0
}

app.use('/slack/events', slackEvents.expressMiddleware())

setScheduleForPRs({web, db})
englishBreakfast()

//When mention display help documentation
slackEvents.on('app_mention', (event) => {
  help(web, event.channel)
})

slackEvents.on('error', console.error)

app.use('/commands/*', bodyParser.urlencoded({ extended: false }))
app.post('/commands/*', (req, res) => {
  const command = req.body.command
  let answer = {}

  if (unwatchCommandRegex.test(command)) { 
    answer = unwatchRepo({db, req, res})
  } else if (addCommandRegex.test(command)) {
    answer = addRepo({db, req, res})
  } else if (listCommandRegex.test(command)) { 
    answer = listPRs({db, res, web, channel: req.body.channel_id})
  }

  resetRegex()
  
  return answer
})

// For answering the pings
app.get('*', (req, res) => {
  return res.json({})
})


app.listen(port, () => console.log(`Server listening on port ${port}`))
