//http://kentcdodds.com/kcd-angular/#/kcd-recompile
angular.module('kcd.directives', [])
  .directive('kcdRecompile', ['$parse', function($parse) {
  'use strict';
  return {
    transclude: true,
    scope: true,
    link: function link(scope, $el, attrs, ctrls, transclude) {
      var previousElements;
      var previousScope;

      compile();

      function compile() {
        if(previousScope) previousScope.$destroy();
        previousScope = scope.$new();
        transclude(previousScope, function(clone) {
          // transclude creates a clone containing all children elements;
          // as we assign the current scope as first parameter, the clonedScope is the same
          previousElements = clone;

          $el.append(clone);
        });
      }

      function recompile() {
        if (previousElements) {
          previousElements.remove();
          previousElements = null;
          $el.empty();
        }

        compile();
      }

      scope.$watch(attrs.kcdRecompile, function(_new, _old) {
        var useBoolean = attrs.hasOwnProperty('useBoolean');
        if ((useBoolean && (!_new || _new === 'false')) || (!useBoolean && (!_new || _new === _old))) {
          return;
        }
        // reset kcdRecompile to false if we're using a boolean
        if (useBoolean) {
          $parse(attrs.kcdRecompile).assign(scope, false);
        }

        recompile();
      });
    }
  };
}]);
