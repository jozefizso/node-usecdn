'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['index.js', 'lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'coverage/blanket'
        },
        src: '<%= jshint.test.src %>'
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true, // suppress mocha console output
          captureFile: 'coverage/coverage.html'
        },
        src: ['<%= jshint.test.src %>', '<%= jshint.lib.src %>']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'mochaTest']
      },
      test: {
        files: ['<%= jshint.test.src %>', 'coverage/blanket.js'],
        tasks: ['jshint:test', 'mochaTest']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: '<%= mochaTest.coverage.options.captureFile %>'
      }
    },
    connect: {
      options: {
        port: 9090,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'coverage')
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>/coverage.html'
      }
    },
  });

  // Tasks
  grunt.registerTask('default', ['jshint', 'mochaTest']);

  grunt.registerTask('test', ['jshint', 'mochaTest:test']);
  grunt.registerTask('coverage', ['mochaTest:coverage']);

  grunt.registerTask('live', [
    'jshint',
    'mochaTest',
    'connect:livereload',
    'open',
    'watch'
  ]);
};
