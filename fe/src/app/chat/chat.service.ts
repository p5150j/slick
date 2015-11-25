export class ChatService {

  /** @ngInject */
  constructor(private $log: angular.ILogService, private $http: angular.IHttpService, private apiUrl: string) {

  }

  getArticles(limit: number = 30): angular.IPromise<any[]> {
    return this.$http.get(this.apiUrl + '/articles?per_page=' + limit)
      .then((response: any): any => {
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('XHR Failed for getContributors.\n', error.data);
      });
  }
}
