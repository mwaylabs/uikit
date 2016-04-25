/**
 * Created by zarges on 22/01/16.
 */
(function () {
  'use strict';

  var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

  module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
      app: 'app',
      dist: 'dist',
      tmp: '.tmp',
      getGruntParam: function (paramName, defaultValue) {
        var gruntParam = grunt.option(paramName);
        // For any reasons the useminPrepare task calls all subtasks of copy and then it will crash because some copy tasks need a param name
        if (!gruntParam && defaultValue && grunt.task.current.name !== 'useminPrepare') {
          throw new Error('The param "' + paramName + '" is required for the task '+grunt.task.current.name+' and was not passed as argument. Please pass the argument --' + paramName);
        } else {
          return gruntParam || defaultValue;
        }
      }
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
          options: {
            livereload: true
          },
          compass: {
            files: ['<%= yeoman.app %>/main.scss', '<%= yeoman.app %>/modules/**/styles/{,*/}*.scss'],
            tasks: ['compass:server']
          },
          livereload: {
            files: [
              '<%= yeoman.app %>/**/*.html',
              '<%= yeoman.app %>/modules/**/*.js',
              '<%= yeoman.app %>/components/mw-ui/*.js'
            ]
          }
        },
        githubpublish: {
          zeroDay: {
            src: '<%= yeoman.dist %>'
          }
        },
        connect: {
          options: {
            // Change this to '0.0.0.0' to access the server from outside.
            hostname: '0.0.0.0',
            base: ['app', '.tmp'],
            middleware: function (connect, options, defaultMiddleware) {
              return [
                proxySnippet
              ].concat(defaultMiddleware);
            }
          },
          //proxies: [
          //  {
          //    context: ['/'],
          //    host: '0.0.0.0',
          //    port: 80
          //  }
          //],
          server: {
            options: {
              port: 9000,
              livereload: true
            }
          },
          dist: {
            options: {
              port: 9009,
              base: 'dist'
            }
          }
        },
        clean: {
          dist: {
            files: [
              {
                dot: true,
                src: [
                  '<%= yeoman.dist %>/*'
                ]
              }
            ]
          },
          tmp: {
            files: [
              {
                dot: true,
                src: [
                  '<%= yeoman.tmp %>/*'
                ]
              }
            ]
          },
          server: '.tmp'
        },
        jshint: {
          options: {
            jshintrc: '.jshintrc'
          },
          all: [
            '<%= yeoman.app %>/modules/**/{,*/}*.js',
            '!<%= yeoman.app %>/modules/**/node_modules/**/{,*/}*.js',
            '!<%= yeoman.app %>/modules/**/src/**/{,*/}*.js',
            '!<%= yeoman.app %>/vendor/**/{,*/}*.js'
          ]
        },
        compass: {
          options: {
            cssDir: '<%= yeoman.tmp %>',
            relativeAssets: true
          },
          build: {
            options: {
              sassDir: ['<%= yeoman.tmp %>'],
              imagesDir: '<%= yeoman.tmp %>/images',
              fontsDir: '<%= yeoman.tmp %>/fonts',
              importPath: ['<%= yeoman.tmp %>/components']
            }
          },
          server: {
            options: {
              sassDir: ['<%= yeoman.app %>'],
              imagesDir: '<%= yeoman.app %>/modules',
              fontsDir: '<%= yeoman.app %>/modules',
              importPath: ['<%= yeoman.app %>/components', '<%= yeoman.app %>/modules']
            }
          }
        },
        useminPrepare: {
          portfolio: {
            src: ['<%= yeoman.app %>/index.html'],
            options: {
              dest: '<%= yeoman.dist %>'
            }
          }
        },
        usemin: {
          html: ['<%= yeoman.dist %>/**/{,*/}*.html'],
          css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
          options: {
            dirs: ['<%= yeoman.dist %>']
          }
        },
        imagemin: {
          dist: {
            files: [
              {
                expand: true,
                cwd: '<%= yeoman.app %>/images',
                src: '**/{,*/}*.{png,jpg,jpeg}',
                dest: '<%= yeoman.dist %>/images'
              }
            ]
          }
        },
        cssmin: {
          dist: {
            files: {
              '<%= yeoman.dist %>/styles/main.css': [
                '.tmp/styles/{,*/}*.css'
              ]
            }
          }
        },
        cdnify: {
          dist: {
            html: ['<%= yeoman.dist %>/*.html']
          }
        },
        ngAnnotate: {
          options: {
            singleQuotes: true
          },
          dist: {
            files: [
              {
                expand: true,
                cwd: '<%= yeoman.tmp %>/concat/modules/',
                src: 'zero-day.min.js',
                dest: '<%= yeoman.tmp %>/concat/modules'
              }
            ]
          }
        },
        ngmin: {
          dist: {
            files: [
              {
                expand: true,
                cwd: '.tmp/concat/modules/',
                src: '*.js',
                dest: '.tmp/concat/modules/'
              }
            ]
          }
        },
        uglify: {
          options: {
            mangle: true //obfuscation
          }
        },
        rev: {
          dist: {
            files: {
              src: [
                '<%= yeoman.dist %>/modules/{,*/}*.js',
                '<%= yeoman.dist %>/styles/{,*/}*.css'
              ]
            }
          }
        },
        copy: {
          portalToTmpFolder: {
            files: [
              {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>',
                dest: '<%= yeoman.tmp %>',
                src: [
                  '*.{ico,txt,png,svg,html}',
                  '.htaccess',
                  'enrollment/**/{,*/}*',
                  'i18n/**/{,*/}*',
                  'images/**/{,*/}*',
                  'styles/**/{,*/}*',
                  'fonts/*',
                  'components/**/{,*/}*',
                  'modules/**/{,*/}*',
                  '!modules/**/node_modules/**/*',
                  '!components/openlayers/**/*'
                ]
              }
            ]
          },
          portalStylesToTmpFolder: {
            files: [
              {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>',
                dest: '<%= yeoman.tmp %>',
                src: [
                  'components/**/{,*/}*.scss',
                  'modules/**/{,*/}*.scss',
                  'styles/**/{,*/}*.scss'
                ]
              }
            ]
          },
          buildToDist: {
            files: [
              {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.tmp %>',
                dest: '<%= yeoman.dist %>',
                src: [
                  '*.*',
                  'fonts/**/{,*/}*',
                  'modules/**/images/**/{,*/}*',
                  'modules/**/assets/**/{,*/}*',
                  'styles/*.css',
                  'enrollment/**/{,*/}*',
                  '!styles/main.css'
                ]
              }
            ]
          },
          buildStyleToDist: {
            src: '<%= yeoman.tmp %>/styles/*.css',
            dest: '<%= yeoman.dist %>/style.css',
            flatten: true,
            filter: 'isFile'
          },
          css: {
            files: [
              {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>',
                dest: '<%= yeoman.tmp %>',
                src: [
                  'components/openlayers/css/ol.css'
                ]
              }
            ]
          },
          fonts: {
            files: [
              {
                expand: true,
                cwd: '<%= yeoman.app %>/components/font-awesome',
                src: 'fonts/**/*',
                dest: '<%= yeoman.app %>'
              },
              {
                expand: true,
                cwd: '<%= yeoman.app %>/fonts',
                src: '**/*',
                dest: '<%= yeoman.dist %>/fonts'
              }
            ]
          },
          staticContent: {
            files: [
              {
                expand: true,
                cwd: '<%= yeoman.app %>/static-content',
                src: '**/*',
                dest: '<%= yeoman.dist %>/static-content'
              }
            ]
          }
        },
        replace: {
          setConfigVars: {
            src: ['<%= yeoman.tmp %>/concat/modules/zero-day.min.js'],
            overwrite: true,                 // overwrite matched source files
            replacements: [
              {
                from: /__buildNumber__ = .*/,
                to: function () {
                  return '__buildNumber__ = ' + yeomanConfig.getGruntParam('buildNumber', 0);
                }
              },
              {
                from: /__lastBuildTime__ = .*/,
                to: function () {
                  return '__lastBuildTime__ = ' + (+new Date());
                }
              }
            ]
          },
          addCacheManifest: {
            src: ['<%= yeoman.dist %>/index.html'],
            overwrite: true,
            replacements: [{
              from: /<html([^>]+)>/g,
              to: function (orgStr) {
                var cacheManifestPath = grunt.file.expand(yeomanConfig.dist + '/*.appcache')[0].split('/')[1];
                return orgStr.replace('>', ' manifest="' + cacheManifestPath + '">');
              }
            }]
          }
        },
        ngtemplates: {
          app: {
            src: [
              '<%= yeoman.app %>/modules/**/*.html',
              '!<%= yeoman.app %>/modules/**/node_modules/**/{,*/}*.html'
            ],
            dest: '<%= yeoman.tmp %>/concat/modules/zero-day.ui.min.js',
            options: {
              url: function (url) {
                return url.replace('app/', '');
              },
              bootstrap: function (module, script) {
                return 'angular.module("ZeroDay").run(["$templateCache", function($templateCache) {' + script + '}]);';
              }
            }
          }
        },
        manifest: {
          generate: {
            options: {
              basePath: '<%= yeoman.dist %>',
              preferOnline: false,
              verbose: true,
              timestamp: true,
              hash: false,
              master: ['index.html'],
              process: function (path) {
                return path.replace('dist/', '');
              }
            },
            src: [
              'index.html',
              '**/*.js',
              '**/*.css',
              '**/*.png',
              'fonts/*.*'
            ],
            dest: '<%= yeoman.dist %>/manifest.appcache'
          }
        }
      }
    );

    grunt.registerTask('serve', [
      'copy:fonts',
      'clean:server',
      'compass:server',
      'configureProxies:server',
      'connect:server',
      'watch'
    ]);

    grunt.registerTask('serve:dist', [
      'configureProxies:server',
      'connect:dist',
      'watch'
    ]);

    grunt.registerTask('test:codequality', [
      'jshint'
    ]);

    grunt.registerTask('prepareBuild', [
      'clean:tmp',
      'clean:dist',
      'copy:fonts',
      'copy:staticContent',
      'copy:css',
      'copy:portalToTmpFolder'
    ]);

    grunt.registerTask('buildTmpFolder', [
      'compass:build',
      'useminPrepare',
      'imagemin',
      'concat',
      'replace:setConfigVars',
      'ngtemplates',
      'cdnify',
      'cssmin',
      'ngAnnotate:dist',
      'uglify',
      'copy:buildToDist',
      'rev:dist',
      //'manifest',
      //'replace:addCacheManifest',
      'usemin',
      'clean:tmp'
    ]);

    grunt.registerTask('build', [
      'prepareBuild',
      'test:codequality',
      'buildTmpFolder'
    ]);

    grunt.registerTask('default', ['server']);
  };

}());