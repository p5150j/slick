'use strict';

import {PrincipalService} from "./principal.service";

import { LoginController } from './login.controller';
import { authConfig } from './login.config';
import { initialLoginCheck } from './login.run';

//import { ChatService } from './login.service';

angular.module('slick.login', [
])
  //.service('ChatService', ChatService)
  .controller('LoginController', LoginController)
  .service('PrincipalService', PrincipalService)
  .config(authConfig)
  .run(initialLoginCheck)
;
