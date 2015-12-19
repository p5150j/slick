import {ChatService} from "../chat.service";
import {Room, ROOM_TYPES, User} from "../../shared/api-models";

var tpl = require('./sidebar.html');
var userModaltpl = require('./user-selection.dialog.html');

/** @ngInject */
export function Sidebar(): angular.IDirective {

  return {
    restrict: 'E',
    templateUrl: tpl,
    controller: SlSidebarController,
    controllerAs: 'vm',
    scope: true,
    bindToController: {
      //slRooms: '=',
      //slUsers: '=',
      slSelectedRoom: '=',
      slOnRoomSelected: '&',
    },
    link: linkFunction
  };

}

function linkFunction(scope, element, attrs, controller) {
  let selectedRoomClass = 'selected-room';
  scope.$watch('vm.slSelectedRoom', (room) => {
    controller.$timeout(() => {
      element.find('.' + selectedRoomClass).removeClass(selectedRoomClass);
      room && angular.element('#room' + room._id).addClass(selectedRoomClass);
    });
  });
}

/** @ngInject */
export class SlSidebarController {

  public slOnRoomSelected: Function;
  public slRooms: Room[];
  public slSelectedRoom: Room;
  public userRooms;
  public groupRooms;

  constructor(private ChatService: ChatService, public $timeout: angular.ITimeoutService, public $mdDialog: any, public $mdMedia: any) {

    ChatService.addListener(this);
    this.slRooms = _(ChatService.getRooms()).map(e => e).value(); //@separate into channels, users
    //this.userRooms = _(ChatService.getRooms()).filter( e => e['type'] == ROOM_TYPES.IM ).map(e => e).value(); //@separate into channels, users
    //this.groupRooms = _(ChatService.getRooms()).filter(e => e['type'] == ROOM_TYPES.GIM ).map(e => e).value(); //@separate into channels, users
  }

  onRoomSelected = (room: Room) => {
    this.slOnRoomSelected({room: room});

  };

  onNewRoom(room) {
    this.slRooms.push(room);
    //let r = room.type == ROOM_TYPES.IM ? this.userRooms: this.groupRooms;
    //r.push(room);
  }

  onUserSelected = (user) => {
    this.ChatService.getRoomIM(user)
      .then((room) => {
        let roomIx = _.findIndex(this.slRooms, {_id: room._id});
        if (roomIx >= 0) {
          this.slRooms[roomIx] = room; //overwrite just in case
        } else {
          this.slRooms.unshift(room);
        }
        this.onRoomSelected(room);
      });
  };

  pickUser = (ev) => {
    var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
    this.$mdDialog.show({
        controller: DialogController,
        controllerAs: 'vm',

        templateUrl: userModaltpl,
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        bindToController: true,
        fullscreen: useFullScreen
      })
      .then((user) => {
        this.onUserSelected(user);
        //$scope.status = 'You said the information was "' + answer + '".';
      }, () => {
        //$scope.status = 'You cancelled the dialog.';
      });

  };
}

/** @ngInject */
class DialogController {

  public users;

  /** @ngInject */
  constructor(private $mdDialog: any, ChatService: ChatService) {
    this.users = ChatService.getUsers();
  }

  hide = ()=> {
    this.$mdDialog.hide();
  };

  cancel = ()=> {
    this.$mdDialog.cancel();
  };

  onUserSelected = (user) => {
    this.$mdDialog.hide(user);
  };

}
