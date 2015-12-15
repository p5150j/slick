//import mongoose = require("mongoose");
//
//var SchemaName = 'UserState';
//
//export interface IUserState extends mongoose.Document {
//  role: string,
//  email: string,
//  password: string,
//  username: string,
//  token: string
//}
//var l = {
//  status = [
//  {
//    room: '1343',
//    lastSent: '12345678'
//  }]
//}
//
//var UserStateSchema: mongoose.Schema = new mongoose.Schema({
//  role: { type: String, enum: ['user', 'admin'], default: 'user' },
//  room: { type: String, required: true, index: { unique:true } },
//  password: { type: String, required: true },
//  username: { type: String, required: true },
//  token: String
//});
//
//export var UserStateRepository = mongoose.model<IUserState>(SchemaName, UserStateSchema);
