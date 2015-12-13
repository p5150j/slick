/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./require.d.ts" />


import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { GithubContributor } from '../app/components/githubContributor/githubContributor.service';
import { WebDevTecService } from '../app/components/webDevTec/webDevTec.service';
import { acmeNavbar } from '../app/components/navbar/navbar.directive';

declare var moment: moment.MomentStatic;
var apiUrl: string = 'http://localhost:3002/api/';
var authUrl: string = 'http://localhost:3002/';
var socketUrl: string = 'http://localhost:3002';

require('./index.scss');

module slick {
  'use strict';

  angular.module('slick', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router',
    'ngMaterial', 'ngMdIcons', 'toastr',
    'slick.login',
    'slick.chat',
    'kcd.directives'
  ])
    //.constant('moment', moment)
    .constant('apiUrl', apiUrl)
    .constant('authUrl', authUrl)
    .constant('socketUrl', socketUrl)
    .config(config)
    .config(routerConfig)
    .run(runBlock)
    .service('githubContributor', GithubContributor)
    .service('webDevTec', WebDevTecService)
    .controller('MainController', MainController)
    .directive('acmeNavbar', acmeNavbar)
  ;

  require('./shared/api-models.ts');
  // load all other modules @TODO: refactor
  require('./chat/chat.module');
  require('./login/login.module');
  require('./components/util/kcd-recompile.directive');

}

