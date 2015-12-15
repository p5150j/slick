
import {IUser} from "./user.model";
import mongoose = require("mongoose");
import {Schema} from "mongoose";

var SchemaName = 'Message';

export interface IMessage extends mongoose.Document {
  text: string;
  user: string;
  room: string;
  ts: Date
}

export var MessageSchema: mongoose.Schema = new mongoose.Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  room: {type: Schema.Types.ObjectId, ref: 'Room', required: true},
  text: {type: String},
  ts: {type: Date, default: Date.now, required: true}
});

MessageSchema.index({ts: 1, room: 1}); //

MessageSchema['statics'].getForRoom = (roomId) => {
  return this.find({room: roomId})
    .limit(100)
    .sort('-ts')
};

MessageSchema['statics'].getForRooms = (roomIds: string[]) => {

  return MessageRepository.aggregate([
    {$match: {room: {$in: roomIds}}},
    {$sort: {ts: -1}},
    {$limit: 500},
    {
      $group: {
        _id: '$room',
        messages: {$push: {_id: '$id', text: '$text', ts: '$ts', user: '$user'}}
      }
    }
  ])
};

export var MessageRepository = mongoose.model<IMessage>(SchemaName, MessageSchema);
