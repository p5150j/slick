import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { GithubContributor } from '../app/components/githubContributor/githubContributor.service';
import { WebDevTecService } from '../app/components/webDevTec/webDevTec.service';
import { acmeNavbar } from '../app/components/navbar/navbar.directive';


console.log(API_URL);
let apiUrl = API_URL + '';
let authUrl = AUTH_URL + '';
//let socketUrl = SOCKET_URL ;


require('./shared/api-models.ts');
// load all other modules @TODO: refactor
require('./chat/chat.module');
require('./login/login.module');
require('./components/util/kcd-recompile.directive');

console.log('loading main');
angular.module('slick', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router',
    'ngMaterial', 'ngMdIcons', 'toastr',
    'slick.login',
    'slick.chat',
    'kcd.directives'
  ])
  //.constant('moment', moment)
  .constant('apiUrl', apiUrl)
  .constant('authUrl', authUrl)
  //.constant('socketUrl', socketUrl)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('githubContributor', GithubContributor)
  .service('webDevTec', WebDevTecService)
  .controller('MainController', MainController)
  .directive('acmeNavbar', acmeNavbar)
;
