const repoRegex = /https:\/\/github\.com\/[\w|-]+\/[\w|-]+\/pull\/\d+/; // TODO repositorio regex
exports.addCommandRegex = /add /g;

exports.addRepo = ({watchedRepos, req, res}) => {
  let info = req.payload;
  let currentRepos = watchedRepos[info.channel_id] || [];
  PRurlRegex.lastIndex = 0;
  
  if (!repoRegex.test(info.text)) {
    res.json({ text: `Hey you! If you want to add a repository the message has to contain the entire url for it. Try again, I will wait for you. :slowparrot:`});
  } else {
    const newRepo = repoRegex.exec(info.text)[0];
    currentRepos.push(newRepo);
    watchedRepos[info.channel_id] = currentRepos;
    res.json({ text: `Presto! repository ${newRepo} added to the list of watched repository for this channel. Your channel has ${currentRepos.length} watched repositories. :eye: `});
    console.log(prsList);
  }
  repoRegex.lastIndex = 0;
}