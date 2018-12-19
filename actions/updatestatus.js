exports.updateStatus = ({actionEvent, prsList, respond, web}) => {
  const PRurl = actionEvent.actions[0].name;
  let replyText = '';
  let PRobject = {};
  if (actionEvent.actions[0].value === 'review') {
    PRobject = prsList[actionEvent.channel.id].find(element => element.url === PRurl);
    PRobject.status = 'reviewing';
    replyText = `PR ${PRurl} marked as *Reviewing*. Please don't forget to update the status once you approved it. If any comments, please reach <@${PRobject.openedBy}>.`
  } else if (actionEvent.actions[0].value === 'markAsApproved') {
    PRobject = prsList[actionEvent.channel.id].find(element => element.url === PRurl);
    prsList[actionEvent.channel.id] = prsList[actionEvent.channel.id].filter(element => element.url !== PRurl);
    replyText = `PR ${PRurl} marked as *Approved*!.`
  }

  respond({text:replyText});
  
  if (actionEvent.actions[0].value === 'markAsApproved') {
    sendUserPRApprovedMessage({actionEvent, PRobject, web}) 
  }
  console.log(prsList);
}

const sendUserPRApprovedMessage = async ({actionEvent, PRobject, web}) => {
  const { presence: userPresence } = await web.users.getPresence({user: PRobject.openedBy});
  const isActive = userPresence === 'active';
  let textToChannel = '';
  let dndInfo = {};
  if (!isActive) {
    dndInfo = await web.dnd.info(PRobject.openedBy);
  }
  if(isActive || dndInfo.dnd_enabled) {
    textToChannel = `PR ${PRobject.url} by <@${PRobject.openedBy}> was approved by <@${actionEvent.user.id}> `;
  } else {
    const { user: {realname: userName }} = await web.user.info(PRobject.openedBy);
    textToChannel = `PR ${PRobject.url} by <@${userName}> was approved by <@${actionEvent.user.id}> `;
  }

  web.chat.postMessage({ text: textToChannel, channel: actionEvent.channel.id }).catch(console.error);
}