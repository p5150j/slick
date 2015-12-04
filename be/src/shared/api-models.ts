//copy paste to FE/BE

export class Message {
  text: string;
  user: string;
  room: string;
  ts: Date
}

export class Room {
  name: string;
  type: string;
  dsc: string;
  messages: Message[]
}
