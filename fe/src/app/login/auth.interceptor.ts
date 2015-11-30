import {PrincipalService} from "./principal.service";
import IQService = angular.IQService;
'use strict';
/** @ngInject */
export function AuthInterceptor(PrincipalService: PrincipalService, $q: angular.IQService, $injector: any, apiUrl: string) {

  return {
    request (req: angular.IRequestConfig): any {
      req.headers = req.headers || {};
      if (req.url.indexOf(apiUrl) === 0) {
        if (PrincipalService.isAuthenticated()) {
          var token = PrincipalService.getToken();
          req.headers.Authorization = 'bearer ' + token;
        } else {
          var stateService = $injector.get('$state'); //angular bug, need to use injector
          stateService.go('auth');
          return $q.reject(req);
        }
      }

      return req;
    },

    responseError (res): any {
      var status = res.status;
      if (status == 401) {
        PrincipalService.logout();
        var stateService = $injector.get('$state'); //angular bug, need to use injector
        stateService.go('auth');
      }
      return $q.reject(res);
    }
  };
}
