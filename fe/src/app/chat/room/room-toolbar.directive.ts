
import {Room} from "../../shared/api-models";

var tpl = require('./room-toolbar.html');

/** @ngInject */
export function RoomToolbar(): angular.IDirective {

  return {
    restrict: 'AE',
    templateUrl: tpl,
    controller: RoomToolbarController,
    controllerAs: 'vm',
    scope: true,
    bindToController: {
      slRoom: '=',
      slOnCreateNoteMode: '&',

    },
    //link: linkFunction
  };

}
/** @ngInject */
/*export*/ class RoomToolbarController {

  public slRoom: Room; //room
  public createNoteActive = false;
  public slOnCreateNoteMode: Function;

  constructor(private $mdSidenav: any) {
    console.log('someone is creating me');
  }

  onCreateNoteMode = (state) => {
    this.createNoteActive = state;
    this.slOnCreateNoteMode({state: state});
  };

  toggleToolbar = () => {
    this.$mdSidenav('left')
      .toggle()
  };
}
