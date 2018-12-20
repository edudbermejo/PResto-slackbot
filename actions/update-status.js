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
    sendChannelPRApprovedMessage({actionEvent, PRobject, web}) 
  }
  console.log(prsList);
}

const sendChannelPRApprovedMessage = async ({actionEvent, PRobject, web}) => {
  let prowner = `<@${PRobject.openedBy}>`;
  const userPR = PRobject.openedBy;
  const isActive = (await web.users.getPresence({ userPR })).presence === 'active';

  // If the user is Active she get's a mention in slack, otherwise we just use her real name.
  if (!isActive) {
    const { user } = await web.users.info({ user: userPR });
    prowner = user.real_name;
  }

  web.chat.postMessage({ text: `PR ${PRobject.url} by ${prowner} was approved by <@${actionEvent.user.id}> `, channel: actionEvent.channel.id }).catch(console.error);
}