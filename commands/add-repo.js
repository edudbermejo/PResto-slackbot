const repoRegex = /[\w|-]+/

const { graphClient } = require('../external-connections/github')

exports.addCommandRegex = /watchrepo/

exports.addRepo = async ({db, req, res}) => {
  let info = req.body
  
  if (!repoRegex.test(info.text)) {
    res.json({ text: `Hey you! If you want to add a repository the message has to contain its *name*. Try again, I will wait for you. :slowparrot:`})
  } else {
    const channel = await db.retrieve(info.channel_id) || {name: info.channel_id, repositories: []}
    const newRepo = repoRegex.exec(info.text)[0]
    if (channel.repositories.includes(newRepo)) {
      res.json({ text: `The repository you are trying to add *it's already listed*. Try again if you want, I will wait for you. :slowparrot:`})
    } else {
      let noRepo
      try {
        await graphClient.request(`
          {
            repository(owner: "saksdirect", name: "${newRepo}") {
              id
            }
          }`)
      } catch(error) {
        noRepo = error
      }
      if (noRepo) {
        res.json({ text: `The repository you are trying to add *does not exist*. Try again if you want, I will wait for you. :slowparrot:`})
      } else {
        channel.repositories.push(newRepo)
        db.persist(channel)
        res.json({ text: `Presto! Repository *${newRepo}* added to the list of watched repository for this channel. Your channel has ${channel.repositories.length} watched repositories. :eye: `})
        console.log(channel)
      }
    }
  }
  repoRegex.lastIndex = 0

  return res
}