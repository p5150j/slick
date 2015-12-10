//copy paste to FE/BE


export enum ROOM_TYPES {
  IM = 'IM', //immediate message
  GIM = 'GIM', //group IM
}

export class Room {
  _id: string;
  name: string;
  type: ROOM_TYPES;
  dsc: string;
  messages: Message[];
  users: string[];
  //populated FE---------------
  usersObj: {[user: string]:User};
  displayName: string;
}

export class Message {
  _id: string;
  text: string;
  user: string;
  room: string;
  ts: string; //utc date
  //populated FE--------------
  userObj: User;
  date: string; //date to show
}

export class User {
  _id: string;
  role: String;
  email: String;
  username: String;
}
