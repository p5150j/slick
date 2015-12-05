import Dictionary = _.Dictionary;
import {Room} from "../../../../be/src/shared/api-models";
import {Message} from "../../../../be/src/shared/api-models";

export class ChatService {

  private UserMap: Dictionary<any>;

  /** @ngInject */
  constructor(private $log: angular.ILogService, private $http: angular.IHttpService, private $q: angular.IQService,
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

  getArticles(limit: number = 30): angular.IPromise<any[]> {
    return this.$http.get(this.apiUrl + 'articles?per_page=' + limit)
      .then((response: any): any => {
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Coulndt get data.\n', error.data);
      });
  }

  getInitialData(): angular.IPromise<any[]> {
    return this.$http.get(this.apiUrl + 'init')
      .then((response: any): any => {
        var data = response.data;


        data.users = _.indexBy(data.users, '_id');
        data.rooms = _.indexBy(data.rooms, '_id');

      //this will be stored in localstorage someday - need to design to that
        this.UserMap = data.users;
        return data;
      })
      .catch((error: any): any => {
        this.$log.error('Couldnt get data.\n', error.data);
      });
  }

  prepareRoom(room: Room): void {
    //@TODO: make it check if it's already prepared
    room.messages.forEach((message) => {
      this.prepareMessage(message);
    });
    room.usersObj = {};
    room.users.forEach((user) => {
      room.usersObj[user] = this.UserMap[user];
    });
  }

  prepareMessage(message: Message): void {
    message.userObj = this.UserMap[message.user];
    message.date = new Date(message.ts).toLocaleString(); //@TODO use other format
  }
}
