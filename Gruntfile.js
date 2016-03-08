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
        src : 'src/mwUI.js',
        dest : '<%= uikit.dist %>/<%= uikit.fileName %>.js'
      }
    },
    concat: {
      dist: {
        src: [
          'dist/<%= uikit.fileName %>.js',
          '.tmp/templates.js'
        ],
        dest: '<%= uikit.dist %>/<%= uikit.fileName %>.js'
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
      all: {
        src: [
          'src/templates/**/*.html'
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
  grunt.registerTask('process', ['ngtemplates:all', 'preprocess:js','concat', 'ngAnnotate:dist']);
  grunt.registerTask('build', ['jshint', 'test', 'process', 'uglify', 'clean']);
  grunt.registerTask('test', ['process','karma']);
};
