const mongoose = require('mongoose')
const { MONGODB_USER, MONGODB_PASSWORD }  = process.env
const { channelSchema } = require('./schemas/channel')

mongoose.connect(`mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@ds149894.mlab.com:49894/presto-slackbot`, { useNewUrlParser: true }) 
const Channel = mongoose.model('Channel', channelSchema)

const retrieve = async (channelId) => {
  let value = {}
  if (channelId) {
    value = await Channel.findOne({_id: channelId}).exec()
  } else {
    value = await Channel.findOne().exec()
  }
  return value
}

const persist = ({_id, repositories}) => {
  const channel = new Channel({_id, repositories})
  Channel.findOneAndUpdate(_id, channel, {upsert: true})
}

exports.db = {
  retrieve,
  persist
}