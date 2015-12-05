import {Message} from "../shared/api-models";
import {PrincipalService} from "../login/principal.service";

/** @ngInject */
export function runBlock($log: angular.ILogService, PrincipalService: PrincipalService, MySocket: any) {

  var login = () => {
    $log.log('trying to login');
    MySocket.emit('login', PrincipalService.getToken());
  };

  MySocket.on('connect', () => {
    login();
  });

}

