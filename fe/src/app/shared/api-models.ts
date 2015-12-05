//copy paste to FE/BE

export class Message {
  _id: string;
  text: string;
  user: string;
  room: string;
  ts: Date
}

export class Room {
  _id: string;
  name: string;
  type: string;
  dsc: string;
  messages: Message[]
}
