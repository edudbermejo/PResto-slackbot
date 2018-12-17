import { addCommandRegex, addPR } from 'addPR';
import { listCommandRegex, listPRs } from 'addPR';

const { RTMClient, WebClient } = require('@slack/client');
const token = process.env.SLACK_ACCESS_TOKEN
const web = new WebClient(token);
const rtm = new RTMClient(token);

rtm.start();

rtm.on('message', (message) => {
  // For structure of `message`, see https://api.slack.com/events/message

  if (message.text.regex(addCommandRegex)) {
    addPR(message);
  } else if (message.text.regex(listCommandRegex)) { 
    listPRs(message);
  } else {
    // TODO print correct way of invoking PResto
  }
});
