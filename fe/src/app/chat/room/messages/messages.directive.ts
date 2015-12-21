import {Message} from "../../../shared/api-models";

var tpl = require('./messages.html');

/** @ngInject */
export function Messages(): angular.IDirective {

  return {
    restrict: 'A',
    scope: true,
    templateUrl: tpl,
    controller: SlMessagesController,
    controllerAs: 'vm',
    bindToController: {
      slMessages: '=',
      slTop: '='
    },
    link: ($scope, $element, $attrs, $controller) => {


      //virtual repeat stuff
      //let messagesContainer = $element.find('md-virtual-repeat-container');
      //let sizeToCopy = $element;
      //$window.addEventListener('resize', () => {
      //  adjustViewport();
      //
      //});
      //function adjustViewport(){
      //  messagesContainer.height(sizeToCopy.height());
      //  console.log('adjusted to ', sizeToCopy.height());
      //  $scope.$broadcast('$md-resize');
      //}
      //$timeout(()=>{adjustViewport()}, 100);

    }
  };

}

/** @ngInject */
export class SlMessagesController {

  private slMessages: Message[];
  /** @ngInject */
  constructor() {


  }


}
