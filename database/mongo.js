const mongoose = require('mongoose')
const { MONGODB_USER, MONGODB_PASSWORD }  = process.env
const { channelSchema } = require('./schemas/channel')

mongoose.connect(`mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@ds149894.mlab.com:49894/presto-slackbot`, { useNewUrlParser: true }) 
const Channel = mongoose.model('Channel', channelSchema)

const retrieve = async (channelId) => {
  let value = {}
  if (channelId) {
    value = await Channel.findOne({name: channelId}).exec()
  } else {
    value = await Channel.finds().exec()
  }
  return value
}

const persist = (channel) => {
  let channelToPersist = channel
  if (!channel._id) {
    channelToPersist = new Channel({name: channel.name, repositories: channel.repositories})
    Channel.create(channelToPersist)
  } else {
    Channel.findOneAndUpdate({name: channelToPersist.name}, channelToPersist).exec()
  }
}

exports.db = {
  retrieve,
  persist
}