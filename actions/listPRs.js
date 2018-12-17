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
    "text": "url + opened by + openedBy",
    "callback_id": "url",
    "color": "This depends on the status",
    "attachment_type": "default",
    "actions": []
};

const possibleActions = {
    open: {
        "name": "review",
        "text": "Review",
        "type": "button",
        "value": "review"
    },
    reviewing: {
        "name": "markAsApproved",
        "text": "Mark As Approved",
        "type": "button",
        "value": "markAsApproved"
    }
};

const postHiddenMessage = ({web, skelleton, channel, user}) => {
    const response = skelleton;
    response.channel = channel;
    response.user = user;
    web.chat.postEphemeral(response);
}

const buildPRMessage = prsList => {
    let finalMessage = Object.assign({}, basicSlackPRsMessage);
    let attachmentsPR = [];
    prsList.forEach(prObject => {
        let pullRequest = Object.assign({}, basicPR);
        pullRequest.text = `${prObject.url} opened by <@${prObject.openedBy}>`;
        pullRequest.callback_id = prObject.url;
        pullRequest.color = colors[prObject.status];
        pullRequest.actions = [possibleActions[prObject.status]];
        attachmentsPR.push(pullRequest);
    });
    finalMessage.attachments = attachmentsPR;
    return finalMessage;
}

exports.listPRs = (web, prsList, message) => {
    if(!prsList[message.channel] || prsList[message.channel].length === 0) {
        postHiddenMessage({web, skelleton: {text: `There is no opened pull requests in your channel. Seems like you are up to date! Congrats!`}, channel: message.channel, user: message.user});
    } else {
        const answer = buildPRMessage(prsList[message.channel])
        console.log(answer);
        postHiddenMessage({web, skelleton: answer, channel: message.channel, user: message.user});
    }
};