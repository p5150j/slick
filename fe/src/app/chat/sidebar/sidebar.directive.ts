import {ChatService} from "../chat.service";
import {Room, User} from "../../shared/api-models";

var tpl = require('./sidebar.html');

/** @ngInject */
export function Sidebar(): angular.IDirective {

  return {
    restrict: 'E',
    templateUrl: tpl,
    controller: SlSidebarController,
    controllerAs: 'vm',
    scope: true,
    bindToController: {
      slRooms: '=',
      slUsers: '=',
      slSelectedRoom: '=',
      slOnRoomSelected: '&',
    },
    link: linkFunction
  };

}

function linkFunction(scope, element, attrs, controller){
  let selectedRoomClass = 'selected-room';
  scope.$watch('vm.slSelectedRoom', (room) => {
    controller.$timeout(() => {
      element.find('.' + selectedRoomClass).removeClass(selectedRoomClass);
      room && angular.element('#room'+room._id).addClass(selectedRoomClass);
    });
  });
}

/** @ngInject */
export class SlSidebarController {

  public slOnRoomSelected: Function;
  public slRooms: Room[];
  public slUsers: User[];
  public slSelectedRoom: Room;

  constructor(private ChatService: ChatService, public $timeout: angular.ITimeoutService) {
    //this.ChatService.getChannels().then((response: any[]) => {
    //  this.channels = response;
    //})

  }

  onRoomSelected = (room) => {
    this.slOnRoomSelected({room: room});
  };

  onUserSelected = (user) => {
    this.ChatService.getRoomIM(user)
      .then((room) => {
        let roomIx = _.findIndex(this.slRooms, {_id: room._id});
        if(roomIx >= 0) {
          this.slRooms[roomIx] = room; //overwrite just in case
        }else {
          this.slRooms.unshift(room);
        }
        this.onRoomSelected(room);
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
