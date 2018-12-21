const PRurlRegex = /https:\/\/github\.com\/[\w|-]+\/[\w|-]+\/pull\/\d+/;
exports.addCommandRegex = /add /g;

exports.addPR = async (web, prsList, message) => {
  let actualPRs = prsList[message.channel] || [];
  PRurlRegex.lastIndex = 0;
  
  if (!PRurlRegex.test(message.text)) {
    web.chat.postMessage({ text: `Hey you! If you want to add a PR the message has to contain the entire url for it. Try again, I will wait for you. :slowparrot:`, channel: message.channel });
  } else {
    PRurlRegex.lastIndex = 0;
    const newPR = PRurlRegex.exec(message.text)[0];
    const userInfo = await web.users.info({user: message.user});
    actualPRs.push({ url: newPR, status: 'open', openedBy: message.user, openedByAvatar: userInfo.user.profile.image_32 });
    prsList[message.channel] = actualPRs;
    web.chat.postMessage({ text: `Presto! PR ${newPR} added to the list. Your channel has ${actualPRs.length} pending PRs. :loading: `, channel: message.channel });
    console.log(prsList);
  }
}