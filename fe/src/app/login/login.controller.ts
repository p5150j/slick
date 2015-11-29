import {PrincipalService} from "./principal.service";
import {ChatService} from "../chat/chat.service";

export class LoginController {

  private user: UserData;


  /* @ngInject */
  constructor(private $state: angular.ui.IStateService,
              private PrincipalService: PrincipalService,
              private ChatService: ChatService) {

    this.activate();
    this.user = new UserData();
  }

  activate() {

  }

  login() {
    this.ChatService.login(this.user.username, this.user.password)
      .then((params) => {
        var identity = {
          token: params.token,
          userId: params.userId,
          username: params.username,
          expirationDate: params.expirationDate
        };

        this.PrincipalService.setIdentity(identity);

        this.$state.go('chat');
      });
  }
}
class UserData {
  username: string;
  password: string;
}
