import {AuthInterceptor} from "./auth.interceptor";
import {PrincipalService} from "./principal.service";

/** @ngInject */
export function initialLoginCheck($state: angular.ui.IStateService, PrincipalService: PrincipalService) {

  if (!PrincipalService.isAuthenticated() && $state.current.name != 'auth') {
    console.log('DENY : Redirecting to Login');
    event.preventDefault();
    $state.go('auth');
  }
}
