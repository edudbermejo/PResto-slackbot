const repoRegex = /[\w|-]+/

exports.unwatchCommandRegex = /unwatchrepo/

exports.unwatchRepo = async ({db, req, res}) => {
  let info = req.body
  
  if (!repoRegex.test(info.text)) {
    res.json({ text: `Hey you! If you want to unwatch a repository the message has to contain its name. Try again, I will wait for you. :slowparrot:`})
  } else {
    let channel = await db.retrieve(info.channel_id)
    if (!channel || channel.repositories.length === 0) {
      res.json({ text: `It seems your channel is not watching any repositories :slowparrot:`})
    } else {
      const repoToDelete = repoRegex.exec(info.text)[0]
      if (!channel.repositories.includes(repoToDelete)) {
        res.json({ text: `The repository you are trying to unwatch is not currently on your list of watched repos. :slowparrot:`})
      } else {
        channel.repositories = channel.repositories.filter(repo => repo !== repoToDelete)
        db.persist(channel)
        res.json({ text: `Presto! Repository *${repoToDelete}* deleted the list of watched repository for this channel. Your channel has ${channel.repositories.length} watched repositories. :eye: `})
        console.log(channel)
      }
    }
  }
  repoRegex.lastIndex = 0

  return res
}