const { Schema } = require('mongoose')

exports.channelSchema = new Schema({
  _id:  String,
  repositories: [String]
})