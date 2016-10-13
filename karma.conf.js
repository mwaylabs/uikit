'use strict';

module.exports = function(config){
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '.',

    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'libs/jquery/dist/jquery.min.js',

      'node_modules/phantomjs-polyfill/bind-polyfill.js',
      'node_modules/underscore/underscore.js',
      'node_modules/bootstrap/js/tooltip.js',
      'node_modules/bootstrap/js/popover.js',
      'node_modules/bootstrap/js/modal.js',
      'node_modules/backbone/backbone.js',
      'node_modules/angular/angular.min.js',
      'node_modules/angular-route/angular-route.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/sinon/pkg/sinon-server-1.17.3.js',

      'libs/angular-sanitize/angular-sanitize.min.js',
      'libs/angular-markdown-directive/markdown.js',
      'libs/showdown/dist/showdown.js',
      'libs/jquery-ui/ui/jquery.ui.widget.js',
      'libs/blueimp-file-upload/js/jquery.fileupload.js',
      'libs/blueimp-file-upload/js/jquery.iframe-transport.js',
      'libs/bootstrap-sass-datepicker/js/bootstrap-sass-datepicker.js',

      'src/test/**/*.js',
      'src/**/*.html',
      'src-relution/**/*.html',
      'dist/mw-uikit.js',
      'dist/mw-uikit.relution.js',
      'src/**/*_test.js',
      'src-relution/test/**/*.js'
    ],

    // list of files to exclude
    exclude: [],

    // use dots reporter, as travis terminal does not support escaping sequences
    // possible values: 'dots', 'progress', 'junit', 'teamcity'
    // CLI --reporters progress
    reporters: ['progress'],

    // web server port
    // CLI --port 9876
    port: 9876,

    // cli runner port
    // CLI --runner-port 9100
    runnerPort: 9100,

    // enable / disable colors in the output (reporters and logs)
    // CLI --colors --no-colors
    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    // CLI --log-level debug
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    // CLI --auto-watch --no-auto-watch
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // CLI --browsers Chrome,Firefox,Safari
    browsers: ['PhantomJS'],

    // If browser does not capture in given timeout [ms], kill it
    // CLI --capture-timeout 5000
    captureTimeout: 5000,

    // Auto run tests on start (when browsers are captured) and exit
    // CLI --single-run --no-single-run
    singleRun: true,

    // report which specs are slower than 500ms
    // CLI --report-slower-than 500
    reportSlowerThan: 500,

    // compile coffee scripts
    preprocessors: {
      'src/**/*.html': ['ng-html2js'],
      'src-relution/**/*.html': ['ng-html2js']
    },

    //karma html preprocessor for directive templates
    ngHtml2JsPreprocessor: {
      // strip this from the file path
      cacheIdFromPath: function(filepath) {
        // example strips 'public/' from anywhere in the path
        // module(app/templates/template.html) => app/public/templates/template.html
        return filepath.replace(/src(-relution)?/, 'uikit');
      },

      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('foo')
      moduleName: 'karmaDirectiveTemplates'
    }
  });
};
