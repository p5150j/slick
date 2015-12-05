//copy paste to FE/BE

export class Room {
  _id: string;
  name: string;
  type: string;
  dsc: string;
  messages: Message[];
  users: string[];
  usersObj: {[user: string]:User}; //populated FE
}

export class Message {
  _id: string;
  text: string;
  user: string;
  room: string;
  ts: string; //utc date
  userObj: User; //populated FE
  date: string; //populated FE - date to show
}

export class User {
  _id: string;
  role: String;
  email: String;
  username: String;
}
