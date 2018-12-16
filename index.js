import { addCommandRegex, addPR } from 'add';
const { RTMClient, WebClient } = require('@slack/client');
const token = process.env.SLACK_ACCESS_TOKEN
const web = new WebClient(token);
const rtm = new RTMClient(token);

rtm.start();

// The current date
const currentTime = new Date().toTimeString();

rtm.on('message', (message) => {
  // For structure of `message`, see https://api.slack.com/events/message

  if (message.text.regex(addCommandRegex)) {
    addPR(message.text);
  } else if (message.text.regex()) { // TODO regex from list
    // TODO invoke list
  } else {
    // TODO print correct way of invoking PResto
  }

  // Log the message
  console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);
});
