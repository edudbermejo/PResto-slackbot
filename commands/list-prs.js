exports.listCommandRegex = /list/g;

const colors = {
  open: "#17ed62",
  reviewing: "#8427d1"
}

const basicSlackPRsMessage = {
  "text": "This is the list of opened PRs for your team",
  "attachments": []
};

const basicPR = {
  "text": "_url_",
  "author_name": "_openedBy_",
  "callback_id": "update_status",
  "color": "_This depends on the status_",
  "attachment_type": "default",
  "actions": []
};

const possibleActions = {
  open: {
    "name": "_PRurl_",
    "text": "Review",
    "type": "button",
    "value": "review"
  },
  reviewing: {
    "name": "_PRurl_",
    "text": "Mark As Approved",
    "type": "button",
    "value": "markAsApproved"
  }
};

const postHiddenMessage = ({ web, skelleton, channel, user }) => {
  const response = skelleton;
  response.channel = channel;
  response.user = user;
  web.chat.postEphemeral(response);
}

const buildPRMessage = ({prsList, web}) => {
  let finalMessage = Object.assign({}, basicSlackPRsMessage);
  let attachmentsPR = [];

  prsList.forEach(prObject => {
    let pullRequest = Object.assign({}, basicPR);
    pullRequest.text = `${prObject.url}`;
    pullRequest.author_name = `<@${prObject.openedBy}>`;
    pullRequest.author_icon = `${prObject.openedByAvatar}`;
    pullRequest.color = colors[prObject.status];
    let action = Object.assign({}, possibleActions[prObject.status]);
    action.name = prObject.url;
    pullRequest.actions = [action];
    attachmentsPR.push(pullRequest);
  });

  finalMessage.attachments = attachmentsPR;
  return finalMessage;
}

exports.listPRs = (web, prsList, message) => {
  
  if (!prsList[message.channel] || prsList[message.channel].length === 0) {
    postHiddenMessage({ web, skelleton: { text: `There is no opened pull requests in your channel. Seems like you are up to date! Congrats! :party: :hbcheart:` }, channel: message.channel, user: message.user });
  } else {
    const answer = buildPRMessage({prsList: prsList[message.channel], web})
    postHiddenMessage({ web, skelleton: answer, channel: message.channel, user: message.user });
  }
};