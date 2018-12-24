const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/client');
const { createMessageAdapter } = require('@slack/interactive-messages');
const express = require('express');

const { addCommandRegex, addPR: addRepo } = require('./commands/add-repo');
const { listCommandRegex, listPRs } = require('./commands/list-prs');
const { help } = require('./commands/help');
const { updateStatus } = require('./actions/update-status');
const { setScheduleForPRs } = require('./batch/ping-prs');

const app = express();
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);
const web = new WebClient(process.env.SLACK_ACCESS_TOKEN);
const port = process.env.PORT || 3000;
let watchedRepos = {};

const resetRegex = () => {
  addCommandRegex.lastIndex = 0;
  listCommandRegex.lastIndex = 0;
}

app.use('/slack/events', slackEvents.expressMiddleware());
app.use('/slack/actions', slackInteractions.expressMiddleware());

setScheduleForPRs({web, prsList: watchedRepos});

// Main engine of PResto
slackEvents.on('app_mention', (event) => {
  help(web, event.channel);
});

slackEvents.on('error', console.error);

// Message interactions for PResto
slackInteractions.action('update_status', (actionEvent, respond) => updateStatus({actionEvent, prsList: watchedRepos, respond, web}));

app.post('/commands', (req, res) => {
  const command = req.body.command;
  let answer = {};
  if (addCommandRegex.test(command)) {
    answer = addRepo({prsList: watchedRepos, req, res});
  } else if (listCommandRegex.test(command)) { 
    answer = listPRs({prsList: watchedRepos, payload: req.body, res});
  }

  resetRegex();
  
  return answer;
})


app.listen(port, () => console.log(`Server listening on port ${port}`));
