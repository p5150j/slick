
config.$inject = ['$logProvider', 'toastrConfig', '$mdThemingProvider'];

function config($logProvider: angular.ILogProvider, toastrConfig: any, $mdThemingProvider: any) {
  // enable log
  $logProvider.debugEnabled(true);
  // set options third-party lib
  toastrConfig.allowHtml = true;
  toastrConfig.timeOut = 3000;
  toastrConfig.positionClass = 'toast-top-right';
  toastrConfig.preventDuplicates = true;
  toastrConfig.progressBar = true;


    $mdThemingProvider.theme('default')
      .primaryPalette('teal')
      .accentPalette('orange')
    //.dark();
}

export {config};
