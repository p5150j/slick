import {AuthInterceptor} from "./auth.interceptor";
/** @ngInject */
export function authConfig($httpProvider: angular.IHttpProvider) {

  $httpProvider.interceptors.push(AuthInterceptor);


}
