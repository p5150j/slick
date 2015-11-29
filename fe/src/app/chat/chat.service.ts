export class ChatService {

  /** @ngInject */
  constructor(private $log: angular.ILogService, private $http: angular.IHttpService, private $q: angular.IQService, private apiUrl: string) {

  }

  login(username: string, password: string): angular.IPromise<any> {
    return this.$http.post(this.apiUrl + 'login',
      {username: username, password: password})
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
        this.$log.error('XHR Failed for getContributors.\n', error.data);
      });
  }

  getChannels(): angular.IPromise<any[]> {
    return this.$q.when([
      {
        _id: 'abc',
        name: 'John'
      },
      {
        _id: 'abc1',
        name: 'Alejandro'
      },
      {
        _id: 'abc2',
        name: 'Peter'
      },
      {
        _id: 'abc3',
        name: 'Pan'
      }
    ]);
  }


}
