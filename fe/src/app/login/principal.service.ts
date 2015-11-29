export class PrincipalService {

  private identity:any;
  public static IDENTITY_KEY = 'identity';

  /** @ngInject */
  constructor(private $log:angular.ILogService, private $q:angular.IQService) {

    this.identity = /*localStorageService.get(IDENTITY_KEY) || */ {};
    this.identity.expirationDate = Date.parse(this.identity.expirationDate);

  }

  isAuthenticated() {
    var expirationDate = this.identity.expirationDate;
    var now = new Date();
    return expirationDate && (now < expirationDate);
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

    //localStorageService.set(IDENTITY_KEY, this.identity);
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
