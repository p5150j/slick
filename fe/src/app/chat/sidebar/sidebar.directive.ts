import {ChatService} from "../chat.service";
import {Room} from "../../shared/api-models";
import {User} from "../../shared/api-models";

/** @ngInject */
export function Sidebar(): angular.IDirective {

  return {
    restrict: 'E',
    templateUrl: 'app/chat/sidebar/sidebar.html',
    controller: SlSidebarController,
    controllerAs: 'vm',
    scope: true,
    bindToController: {
      slRooms: '=',
      slUsers: '=',
      slOnRoomSelected: '&'
    }
  };

}

/** @ngInject */
export class SlSidebarController {

  public slOnRoomSelected: Function;
  public slRooms: Room[];
  public slUsers: User[];

  constructor(private ChatService: ChatService) {
    //this.ChatService.getChannels().then((response: any[]) => {
    //  this.channels = response;
    //})
  }

  onRoomSelected = (room) => {
    this.slOnRoomSelected({room: room});
  };

  onUserSelected = (user) => {
    this.ChatService.getRoomIM(user).then((room) => {
      this.slRooms.unshift(room);
    });
  };


  getStatusIcon(channel) {
    if (channel.status == 'online') {
      return 'message'
    } else {
      return 'accessibility'
    }
  }

  morph(channel, event) { //just a mock to test the morph on click
    var element = angular.element(event.target);
    if (channel.status == 'online') {
      element.removeClass('online');
      element.addClass('offline');
      return channel.status = 'offline'
    } else {
      element.removeClass('offline');
      element.addClass('online');
      return channel.status = 'online'
    }
  }
}
