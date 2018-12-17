const { addCommandRegex, addPR } = require('./actions/addPR');
const { listCommandRegex, listPRs } = require('./actions/listPRs');
const { help } = require('./actions/help');
const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/client');

const token = process.env.SLACK_ACCESS_TOKEN;
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const port = process.env.PORT || 3000;
const web = new WebClient(token);
let prsList = {};

// Main engine of PResto
slackEvents.on('app_mention', (event) => {

  console.log(event);

  if (addCommandRegex.test(event.text)) {
    addPR(web, prsList, event);
  } else if (listCommandRegex.test(event.text)) { 
    listPRs(web, prsList, event);
  } else {
    help(web, event.channel);
  }
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

// Start a basic HTTP server
slackEvents.start(port).then(() => {
  console.log(`server listening on port ${port}`);
});
