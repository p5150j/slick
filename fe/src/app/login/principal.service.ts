declare var localStorage: any;// @TODO: move to a ng-service

export class PrincipalService {

  private identity: any;
  public static IDENTITY_KEY = 'identity';


  /** @ngInject */
  constructor(private $log: angular.ILogService, private $q: angular.IQService) {

    try {
      this.identity = JSON.parse(localStorage.getItem(PrincipalService.IDENTITY_KEY)) || {};
    }catch (e:SyntaxError){
      this.identity = {};
    }
    this.identity.expirationDate = Date.parse(this.identity.expirationDate);

  }

  isAuthenticated() {
    return !!this.identity.userId;
    //var expirationDate = this.identity.expirationDate;
    //var now = new Date();
    //return expirationDate && (now < expirationDate);
  }

  logout() {
    this.identity = {};
    localStorage.removeItem(PrincipalService.IDENTITY_KEY);
  }

  isExpired() {
    var expirationDate = this.identity.expirationDate;
    var now = new Date();
    return expirationDate && (now > expirationDate);
  }

  setIdentity(params) {
    this.identity.token = params.token;
    this.identity.userId = params.userId;
    this.identity.username = params.username;
    this.identity.expirationDate = params.expirationDate;

    localStorage.setItem(PrincipalService.IDENTITY_KEY, JSON.stringify(this.identity));
  }

  getUsername() {
    return this.identity ? this.identity.username : '';
  }

  getToken() {
    return this.identity ? this.identity.token : '';
  }

  getIdentity() {
    return this.identity;
  }
}
