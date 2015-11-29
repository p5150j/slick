import {PrincipalService} from "./chat.service";
'use strict';

import { LoginController } from './login.controller';
//import { ChatService } from './login.service';

angular.module('slick.login', [
])
  //.service('ChatService', ChatService)
  .controller('LoginController', LoginController)
  .service('PrincipalService', PrincipalService)
;
