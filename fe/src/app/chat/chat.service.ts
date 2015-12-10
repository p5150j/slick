
import Dictionary = _.Dictionary;
import {Room, Message, User, ROOM_TYPES} from "../shared/api-models";
import {PrincipalService} from "../login/principal.service";

export class ChatService {

  private UserMap: Dictionary<User>;
  private RoomsMap: Dictionary<Room>;

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
        this.$q.reject(error);
      });
  }

  getInitialData(): angular.IPromise<any[]> {
    return this.$http.get(this.apiUrl + 'init')
      .then((response: any): any => {
        var data = response.data;

        //data.users = _.indexBy(data.users, '_id');
        //this will be stored in localstorage someday - need to design to that
        this.UserMap = _.indexBy(data.users, '_id');


        data.rooms.forEach((r) => {
          this.prepareRoom(r);
        });
        //data.rooms = _.indexBy(data.rooms, '_id');
        this.RoomsMap = _.indexBy(data.rooms, '_id');


        return data;
      })
      .catch((error: any): any => {
        this.$log.error('Couldnt get data.\n', error.data);
        this.$q.reject(error);
      });
  }

  getRoomIM(user: User): angular.IPromise<Room> {
    //@TODO: we can check locally first quite easily
    return this.$http.put(this.apiUrl + 'rooms/im/' + user._id, {name: 'for ' + user._id})
      .then((response: any): any => {
        var data: Room = response.data;
        if (this.RoomsMap[data._id]) { //exists
          return this.RoomsMap[data._id]; //
        } else {
          data.messages = []; //@TODO - from server
          this.prepareRoom(data);
          this.RoomsMap[data._id] = data;
        }

        return this.RoomsMap[data._id];
      })
      .catch((error: any): any => {
        this.$log.error('Couldnt get a room.\n', error.data);
        this.$q.reject(error);
      });

  }

  prepareRoom(room: Room): void {
    let me = this.PrincipalService.getUserId();

    //@TODO: make it check if it's already prepared
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

    if (room.type == ROOM_TYPES.IM) { //IM rooms are named after the other user
      let otherUser = room.users[0] == me ? room.users[1] : room.users[0];
      room.displayName = this.UserMap[otherUser].username;
    } else {
      room.displayName = room.name;
    }
  }

  prepareMessage(message: Message): void {
    message.userObj = this.UserMap[message.user];
    message.date = new Date(message.ts).toLocaleString(); //@TODO use other format
  }
}
