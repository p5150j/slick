import {Message} from "../../../shared/api-models";

/** @ngInject */
export function Messages(): angular.IDirective {

  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'app/chat/room/messages/messages.html',
    controller: SlMessagesController,
    controllerAs: 'vm',
    bindToController: {
      slMessages: '='
    }
  };

}

/** @ngInject */
export class SlMessagesController {

  private slMessages: Message[];

  constructor() {
  }


}
