import Dictionary = _.Dictionary;
import {Room, Message, User, ROOM_TYPES} from "../shared/api-models";
import {PrincipalService} from "../login/principal.service";

export class ChatService {

  //this could be local storage + api layer in the future
  private UserMap: Dictionary<User>;
  private RoomsMap: Dictionary<Room>;
  private eventListener; //@TODO: make it more generic

  /** @ngInject */
  constructor(private $log: angular.ILogService, private $http: angular.IHttpService, private $q: angular.IQService,
              private PrincipalService: PrincipalService,
              private apiUrl: string,
              private authUrl: string) {

  }

  login(username: string, password: string): angular.IPromise<any> {
    return this.$http.post(this.authUrl + 'login',
      {email: username, password: password})
      .then((response) => {
        return response.data;
      });
  }

  getUsers() {
    return this.UserMap;
  }

  getRooms() {
    return this.RoomsMap;
  }

  getArticles(limit: number = 30): angular.IPromise<any[]> {
    return this.$http.get(this.apiUrl + 'articles?per_page=' + limit)
      .then((response: any): any => {
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Coulndt get data.\n', error.data);
        return this.$q.reject(error);
      });
  }

  getInitialData(): angular.IPromise<any[]> {
    return this.$http.get(this.apiUrl + 'init')
      .then((response: {data: {users:User[], onlineUsers:string[], rooms:Room[]}}) => {
        var data = response.data;

        //data.users = _.indexBy(data.users, '_id');
        //this will be stored in localstorage someday - need to design to that
        this.UserMap = _.indexBy(data.users, '_id');

        _.forEach(data.onlineUsers, (u) => {
          this.UserMap[u].online = true;
        });

        data.rooms.forEach((r) => {
          this.prepareRoom(r);
        });
        //data.rooms = _.indexBy(data.rooms, '_id');
        this.RoomsMap = _.indexBy(data.rooms, '_id');


        return data;
      })
      .catch((error: any): any => {
        this.$log.error('Couldnt get data.\n', error.data);
        return this.$q.reject(error);
      });
  }

  getRoomById(roomId: string): angular.IPromise<Room> {
    if (this.RoomsMap[roomId]) {
      return this.$q.when(this.RoomsMap[roomId]);
    } else {
      return this.$http.get(this.apiUrl + 'rooms/' + roomId).then((resp: {data: Room})=> {
        var room: Room = resp.data;
        this.prepareRoom(room);
        this.RoomsMap[roomId] = room;
        return room;
      })
    }
  }

  getRoomIM(user: User): angular.IPromise<Room> {
    //@TODO: we can check locally first quite easily
    return this.$http.put(this.apiUrl + 'rooms/im/' + user._id, {name: 'for ' + user._id})
      .then((response: any): any => {
        var data: Room = response.data;
        if (this.RoomsMap[data._id]) { //exists
          return this.RoomsMap[data._id]; //
        } else {
          this.prepareRoom(data);
          this.RoomsMap[data._id] = data;
        }

        return this.RoomsMap[data._id];
      })
      .catch((error: any): any => {
        this.$log.error('Couldnt get a room.\n', error.data);
        return this.$q.reject(error);
      });
  }

  prepareRoom(room: Room): void {
    //@TODO: make it check if it's already prepared

    let me = this.PrincipalService.getUserId();

    room.messages = room.messages || [];
    room.messages.sort((m1, m2) => {
      return (m1.ts < m2.ts) ? -1 : 1;
    });
    room.messages.forEach((message) => {
      this.prepareMessage(message);
    });
    room.usersObj = {};
    room.users.forEach((user) => {
      room.usersObj[user] = this.UserMap[user];
    });

    room.users.forEach((user) => {
      room.usersObj[user] = this.UserMap[user];
    });

    room.pending = 0;
    if (room.type == ROOM_TYPES.IM) { //IM rooms are named after the other user
      let otherUser = room.users[0] == me ? room.users[1] : room.users[0];
      room.displayName = this.UserMap[otherUser].username;
      room.userObj = this.UserMap[otherUser];
    } else {
      room.displayName = room.name;
    }
  }

  prepareMessage(message: Message): void {
    message.userObj = this.UserMap[message.user];
    message.date = new Date(message.ts).toLocaleString(); //@TODO use other format
  }

  addChatMessage(data: Message) {
    this.prepareMessage(data);
    let room;
    if (room = this.RoomsMap[data.room]) {
      //if (room == this.currentRoom) {
      //} else {
      room.pending++;
      //}

      room.messages.push(data); //@TODO: sort
    } else {
      this.getRoomById(data.room).then((room) => {
        this.eventListener.onNewRoom(room);
        room.pending++;
      });
    }
  }
  userStatusChanged(userId, status) {
    this.UserMap[userId].online = status;
  }

  addListener(listener: any): void {
    this.eventListener = listener;
  }
}
