import {Message} from "../../../shared/api-models";

var tpl = require('./messages.html');

/** @ngInject */
export function Messages(): angular.IDirective {

  return {
    restrict: 'E',
    scope: true,
    templateUrl: tpl,
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

  constructor() {}


}
