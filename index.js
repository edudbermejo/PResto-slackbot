const { addCommandRegex, addPR } = require('./actions/addPR');
const { listCommandRegex, listPRs } = require('./actions/listPRs');
const { help } = require('./actions/help');
const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/client');
const express = require('express');

const app = express();
const token = process.env.SLACK_ACCESS_TOKEN;
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const port = process.env.PORT || 3000;
const web = new WebClient(token);
let prsList = {};

const resetRegex = () => {
  addCommandRegex.lastIndex = 0;
  listCommandRegex.lastIndex = 0;
}

app.use('/slack/events', slackEvents.expressMiddleware());

// Main engine of PResto
slackEvents.on('app_mention', (event) => {

  console.log(event);

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

app.listen(port, () => console.log(`Server listening on port ${port}`));
