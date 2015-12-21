import {AuthInterceptor} from "./auth.interceptor";
import {PrincipalService} from "./principal.service";

initialLoginCheck.$inject = ['$state', 'PrincipalService', '$log'];

function initialLoginCheck($state: angular.ui.IStateService, PrincipalService: PrincipalService, $log: angular.ILogService) {

  if(PrincipalService.isAuthenticated()){
    $log.debug('user is authenticated');

  }else {
    $log.debug('user is not authenticated');
    if ($state.current.name != 'auth') {
      console.log('DENY : Redirecting to Login');
      //event.preventDefault();
      $state.go('auth');
    }
  }
}

export {initialLoginCheck}
