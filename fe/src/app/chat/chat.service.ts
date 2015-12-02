export class ChatService {

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
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Coulndt get data.\n', error.data);
      });
  }
}
