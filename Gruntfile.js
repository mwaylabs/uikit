'use strict';


module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var uikitConfig = {
    src: 'src',
    srcRelution: 'src-relution',
    dist: 'dist',
    fileName: 'mw-uikit',
    fileNameRelution: 'mw-uikit.relution',
    getVersion: function () {
      return grunt.file.readJSON('package.json').version;
    },
    getGruntParam: function (paramName, defaultValue) {
      var gruntParam = grunt.option(paramName);
      // For any reasons the useminPrepare task calls all subtasks of copy and then it will crash because some copy tasks need a param name
      if (!gruntParam && !defaultValue) {
        throw new Error('The param "' + paramName + '" is required for the task ' + grunt.task.current.name + ' and was not passed as argument. Please pass the argument --' + paramName);
      } else {
        return gruntParam || defaultValue;
      }
    }
  };

  grunt.initConfig({
    uikit: uikitConfig,
    regarde: {
      all: {
        files: [
          'src/**/*.js',
          'src/**/*.json',
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
      js: {
        src: 'src/mw_ui.js',
        dest: '<%= uikit.dist %>/<%= uikit.fileName %>.js'
      }
    },
    concat: {
      dist: {
        src: [
          'src-relution/mwUI.js',
          'src-relution/**/*.js',
          '!src-relution/test/**/*.js',
          '.tmp/templates-relution.js',
          '.tmp/templates-relution-i18n.js',
          'libs/showdown/dist/showdown.js',
          'libs/jquery-ui/ui/widget.js',
          'libs/blueimp-file-upload/js/jquery.fileupload.js',
          'libs/blueimp-file-upload/js/jquery.iframe-transport.js'
        ],
        dest: '<%= uikit.dist %>/<%= uikit.fileNameRelution %>.js'
      }
    },
    copy: {
      distToSamplePortal: {
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
      },
      relutionScssToDistfolder: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= uikit.srcRelution %>/styles',
            dest: '<%= uikit.dist %>/styles/relution',
            src: [
              '**/*.scss'
            ]
          }
        ]
      },
      scssToDistfolder: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= uikit.src %>',
            dest: '<%= uikit.dist %>/styles',
            src: [
              '_mw_uis.scss',
              '**/*.scss',
              '**/styles/*.scss'
            ]
          }
        ]
      }
    },
    uglify: {
      js: {
        files: {
          '<%= uikit.dist %>/<%= uikit.fileName %>.min.js': ['<%= uikit.dist %>/<%= uikit.fileName %>.js'],
          '<%= uikit.dist %>/<%= uikit.fileNameRelution %>.min.js': ['<%= uikit.dist %>/<%= uikit.fileNameRelution %>.js']
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
            '<%= uikit.dist %>/<%= uikit.fileName %>.js': ['<%= uikit.dist %>/<%= uikit.fileName %>.js'],
            '<%= uikit.dist %>/<%= uikit.fileNameRelution %>.js': ['<%= uikit.dist %>/<%= uikit.fileNameRelution %>.js']
          }
        ]
      }
    },
    ngtemplates: {
      old: {
        src: [
          'src-relution/templates/**/*.html',
        ],
        dest: '.tmp/templates-relution.js',
        options: {
          url: function (url) {
            return 'uikit/' + url.replace('src-relution/', '');
          },
          bootstrap: function (module, script) {
            return 'angular.module("mwUI.Relution").run(["$templateCache", function($templateCache) {' + script + '}]);';
          },
          htmlmin: {collapseWhitespace: true, collapseBooleanAttributes: true}
        }
      },
      oldI18n: {
        src: [
          'src-relution/mw-ui-rln-i18n/**/*.json'
        ],
        dest: '.tmp/templates-relution-i18n.js',
        options: {
          url: function (url) {
            return 'uikit-relution/' + url.replace('src-relution/', '');
          },
          bootstrap: function (module, script) {
            return 'angular.module("mwUI.Relution").run(["$templateCache", function($templateCache) {' + script + '}]);';
          },
          htmlmin: {collapseWhitespace: true, collapseBooleanAttributes: true}
        }
      },
      new: {
        src: [
          'src/**/templates/**/*.html',
          'src/**/i18n/**/*.json',
          'src/mw_ui_icons.json'
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
    replace: {
      setBuildNumber: {
        src: ['<%= uikit.dist %>/<%= uikit.fileName %>.js'],
        overwrite: true,
        replacements: [
          {
            from: /UIKITVERSIONNUMBER/,
            to: function () {
              return uikitConfig.getVersion();
            }
          }
        ]
      }
    },
    shell: {
      zipUiKit: {
        options: {
          stdout: true,
          failOnError: true
        },
        command: function () {
          return [
            'mkdir -p zip',
            'cp -r dist zip/' + uikitConfig.getVersion(),
            'cd zip',
            'zip -r ' + uikitConfig.getVersion() + '.zip ' + uikitConfig.getVersion(),
            'rm -rf ' + uikitConfig.getVersion()
          ].join('&&');
        }
      }
    },
    clean: ['dist', 'zip']
  });

  grunt.registerTask('test', ['jshint', 'process', 'process-old', 'karma']);

  grunt.registerTask('process', ['ngtemplates:new', 'preprocess:js', 'ngAnnotate:dist', 'copy:distToSamplePortal']);
  grunt.registerTask('process-old', ['ngtemplates:old', 'ngtemplates:oldI18n', 'concat', 'ngAnnotate:dist', 'copy:distToSamplePortal']);

  grunt.registerTask('build', ['clean', 'process', 'process-old', 'replace:setBuildNumber', 'copy:scssToDistfolder', 'copy:relutionScssToDistfolder']);
  grunt.registerTask('release', ['build', 'uglify', 'shell:zipUiKit']);

  grunt.registerTask('watch', ['process', 'regarde']);
};
