const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/client');
const { createMessageAdapter } = require('@slack/interactive-messages');
const express = require('express');

const { addCommandRegex, addPR } = require('./commands/addPR');
const { listCommandRegex, listPRs } = require('./commands/listPRs');
const { help } = require('./commands/help');
const { updateStatus } = require('./actions/updateStatus');

const app = express();
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);
const web = new WebClient(process.env.SLACK_ACCESS_TOKEN);
const port = process.env.PORT || 3000;
let prsList = {};

const resetRegex = () => {
  addCommandRegex.lastIndex = 0;
  listCommandRegex.lastIndex = 0;
}

app.use('/slack/events', slackEvents.expressMiddleware());
app.use('/slack/actions', slackInteractions.expressMiddleware());


// Main engine of PResto
slackEvents.on('app_mention', (event) => {

  // If it's and edited post PResto shouldn't do anything
  if(event.edited) {
    return;
  }

  if (addCommandRegex.test(event.text)) {
    addPR(web, prsList, event);
  } else if (listCommandRegex.test(event.text)) { 
    listPRs(web, prsList, event);
  } else {
    help(web, event.channel);
  }

  resetRegex();
});

slackEvents.on('error', console.error);

// Message interactions for PResto
slackInteractions.action('update_status', (actionEvent, respond) => updateStatus({actionEvent, prsList, respond, web}));


app.listen(port, () => console.log(`Server listening on port ${port}`));
