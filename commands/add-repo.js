const repoRegex = /[\w|-]+/

exports.addCommandRegex = /watchrepo/

exports.addRepo = ({watchedRepos, req, res}) => {
  let info = req.body
  let currentRepos = watchedRepos[info.channel_id] || []
  
  if (!repoRegex.test(info.text)) {
    res.json({ text: `Hey you! If you want to add a repository the message has to contain the entire url for it. Try again, I will wait for you. :slowparrot:`})
  } else {
    const newRepo = repoRegex.exec(info.text)[0]
    if (currentRepos.includes(newRepo)) {
      res.json({ text: `The repository you are trying to add it's already listed. Try again if you want, I will wait for you. :slowparrot:`})
    } else {
      currentRepos.push(newRepo)
      watchedRepos[info.channel_id] = currentRepos
      res.json({ text: `Presto! Repository *${newRepo}* added to the list of watched repository for this channel. Your channel has ${currentRepos.length} watched repositories. :eye: `})
      console.log(watchedRepos)
    }
  }
  repoRegex.lastIndex = 0

  return res
}