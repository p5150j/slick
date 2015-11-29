import {ChatService} from "../chat.service";
/** @ngInject */
export function Sidebar(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
      //creationDate: '='
    },
    templateUrl: 'app/chat/sidebar/sidebar.html',
    controller: SlSidebarController,
    controllerAs: 'vm',
    bindToController: true
  };

}

/** @ngInject */
export class SlSidebarController {
  public channels: any[];

  constructor(private ChatService: ChatService) {
    this.ChatService.getChannels().then((response : any[]) => {
      this.channels = response;
    })
  }
}
