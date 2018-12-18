exports.updateStatus = ({actionEvent, prsList, respond}) => {
  const PRurl = actionEvent.actions[0].name;
  let replyText = '';
  if (actionEvent.actions[0].value === 'review') {
    let PRobject = prsList[actionEvent.channel.id].find(element => element.url === PRurl);
    PRobject.status = 'reviewing';
    replyText = `PR ${PRurl} marked as *Reviewing*. Please don't forget to update the status once you approved it. If any comments, please reach <@${PRobject.openedBy}>.`
  } else if (actionEvent.actions[0].value === 'markAsApproved') {
    prsList[actionEvent.channel.id] = prsList[actionEvent.channel.id].filter(element => element.url !== PRurl);
    replyText = `PR ${PRurl} marked as *Approved*!.`
  }

  respond({text:replyText});
}