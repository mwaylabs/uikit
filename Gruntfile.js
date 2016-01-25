'use strict';


module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var uikitConfig = {
    dist: 'dist',
    fileName: 'uikit'
  };

  grunt.initConfig({
    uikit: uikitConfig,
    regarde: {
      all: {
        files: [
          'src/**/*.js',
          'src/**/*.html'
        ],
        tasks: ['process']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'src/**/*.js'
      ]
    },
    preprocess: {
      js : {
        src : 'src/mw_ui.js',
        dest : '<%= uikit.dist %>/<%= uikit.fileName %>.js'
      }
    },
    concat: {
      dist: {
        src: [
          'src-old/mwUI.js',
          'src-old/**/*.js',
          '.tmp/templates.js',
          'libs/angular-sanitize/angular-sanitize.js',
          'libs/showdown/dist/showdown.js',
          'libs/jquery-ui/ui/jquery.ui.widget.js',
          'libs/blueimp-file-upload/js/jquery.fileupload.js',
          'libs/blueimp-file-upload/js/jquery.iframe-transport.js',
          'libs/bootstrap-sass-datepicker/js/bootstrap-sass-datepicker.js',
          'libs/bootstrap-sass-datepicker/js/locales/bootstrap-datepicker.de.js'
        ],
        dest: '<%= uikit.dist %>/<%= uikit.fileName %>-old.js'
      }
    },
    copy: {
      distToSamplePortal:{
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= uikit.dist %>',
            dest: 'sample_portal/app/components/mw-ui',
            src: [
              '<%= uikit.fileName %>.js'
            ]
          }
        ]
      }
    },
    uglify: {
      js: {
        files: {
          '<%= uikit.dist %>/<%= uikit.fileName %>.min.js': ['<%= uikit.dist %>/<%= uikit.fileName %>.js']
        }
      }
    },
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dist: {
        files: [
          {
            '<%= uikit.dist %>/<%= uikit.fileName %>.js': ['<%= uikit.dist %>/<%= uikit.fileName %>.js']
          }
        ]
      }
    },
    ngtemplates: {
      old: {
        src: [
          'src-old/templates/**/*.html'
        ],
        dest: '.tmp/templates.js',
        options: {
          url: function (url) {
            return 'uikit/' + url.replace('src-old/', '');
          },
          bootstrap: function (module, script) {
            return 'angular.module("mwUI").run(["$templateCache", function($templateCache) {' + script + '}]);';
          },
          htmlmin: {collapseWhitespace: true, collapseBooleanAttributes: true}
        }
      },
      new: {
        src: [
          'src/**/templates/**/*.html'
        ],
        dest: '.tmp/templates.js',
        options: {
          url: function (url) {
            return 'uikit/' + url.replace('src/', '');
          },
          bootstrap: function (module, script) {
            return 'angular.module("mwUI").run(["$templateCache", function($templateCache) {' + script + '}]);';
          },
          htmlmin: {collapseWhitespace: true, collapseBooleanAttributes: true}
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    clean: ['.tmp']
  });

  grunt.registerTask('watch', ['process', 'regarde']);
  grunt.registerTask('process', ['ngtemplates:new', 'preprocess:js', 'ngAnnotate:dist','copy:distToSamplePortal']);
  grunt.registerTask('process-old', ['ngtemplates:old', 'concat', 'ngAnnotate:dist','copy:distToSamplePortal']);
  grunt.registerTask('build', ['jshint', 'process', 'process-old', 'test', 'uglify', 'clean']);
  grunt.registerTask('test', ['karma']);
};
