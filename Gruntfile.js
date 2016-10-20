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
      var packageJson = grunt.file.readJSON('package.json');
      return packageJson.version;
    },
    getGruntParam: function (paramName, defaultValue) {
      var gruntParam = grunt.option(paramName);
      // For any reasons the useminPrepare task calls all subtasks of copy and then it will crash because some copy tasks need a param name
      if (!gruntParam && !defaultValue) {
        throw new Error('The param "' + paramName + '" is required for the task ' + grunt.task.current.name + ' and was not passed as argument. Please pass the argument --' + paramName);
      } else {
        return gruntParam || defaultValue;
      }
    },
    getversionWithBuildNumber: function () {
      return uikitConfig.getVersion() + '-b' + uikitConfig.getGruntParam('buildNumber', 'LOCAL');
    },
    getReleaseNameWithBuildNum: function () {
      return uikitConfig.fileName +
        '-v' + uikitConfig.getversionWithBuildNumber() +
        '-sha.c' + uikitConfig.getGruntParam('commitHash', 'none').toString().substr(0,5);
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
          '.tmp/templates.js',
          '.tmp/templates-relution.js',
          'libs/angular-sanitize/angular-sanitize.js',
          'libs/showdown/dist/showdown.js',
          'libs/jquery-ui/ui/jquery.ui.widget.js',
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
          'src-relution/templates/**/*.html'
        ],
        dest: '.tmp/templates-relution.js',
        options: {
          url: function (url) {
            return 'uikit/' + url.replace('src-relution/', '');
          },
          bootstrap: function (module, script) {
            return 'angular.module("mwUI").run(["$templateCache", function($templateCache) {' + script + '}]);';
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
              return uikitConfig.getversionWithBuildNumber();
            }
          }
        ]
      }
    },
    shell: {
      addFontsToDistFolder: {
        options: {
          stdout: true,
          failOnError: true
        },
        command: 'cp -r src-relution/fonts dist/styles'
      },
      zipUiKit: {
        options: {
          stdout: true,
          failOnError: true
        },
        command: function () {
          return [
            'mkdir -p zip',
            'cp -r dist zip/' + uikitConfig.getReleaseNameWithBuildNum(),
            'cd zip',
            'zip -r ' + uikitConfig.getReleaseNameWithBuildNum() + '.zip ' + uikitConfig.getReleaseNameWithBuildNum(),
            'rm -rf ' + uikitConfig.getReleaseNameWithBuildNum()
          ].join('&&');
        }
      },
      gitRelease: {
        options: {
          stdout: true,
          failOnError: true
        },
        command: function(){
          return [
            'export VERSION_NUMBER='+uikitConfig.getversionWithBuildNumber(),
            './bin/git_release.sh'
          ].join('&&');
        }
      }
    },
    clean: ['dist', 'zip']
  });

  grunt.registerTask('test', ['build', 'karma']);
  grunt.registerTask('test:codequality', ['jshint', 'test']);
  grunt.registerTask('watch', ['process', 'regarde']);
  grunt.registerTask('process', ['ngtemplates:new', 'preprocess:js', 'ngAnnotate:dist', 'copy:distToSamplePortal']);
  grunt.registerTask('process-old', ['ngtemplates:old', 'concat', 'ngAnnotate:dist', 'copy:distToSamplePortal']);
  grunt.registerTask('build', ['jshint', 'process', 'process-old']);
  grunt.registerTask('release', ['clean', 'build', 'replace:setBuildNumber', 'uglify', 'copy:scssToDistfolder', 'copy:relutionScssToDistfolder', 'shell:addFontsToDistFolder', 'shell:zipUiKit', 'shell:gitRelease']);
};
