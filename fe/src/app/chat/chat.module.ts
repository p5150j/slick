/// <reference path="../../../.tmp/typings/tsd.d.ts" />

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

export function init (){
  'use strict';

  angular.module('slick.chat', [])
    .service('ChatService', ChatService)
    .controller('ChatController', ChatController);

}
