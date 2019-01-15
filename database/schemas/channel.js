const { Schema } = require('mongoose')

exports.channelSchema = new Schema({
  name:  String,
  repositories: [String]
})