module.exports = function (grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: require('./package'),
    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */'
    },

    jshint: {
      all: [
        'Gruntfile.js',
        'js/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Build modernizr
    modernizr: {
      devFile: 'bower_components/modernirz/modernizr.js',
      outputFile : 'dist/js/vendor/modernizr-for-<%= pkg.version %>.min.js',

      extra: {
        shiv: true,
        mq: true
      },

      // Minify
      uglify: true,

      // Files
      files: ['src/js/**/*.js', 'src/scss/**/*.scss']
    },

    sass: {
      dev: {
        options: {
          unixNewlines: true,
          style: 'expanded'
        },
        files: {
          'css/main.css': 'src/scss/main.scss'
        }
      },
      deploy: {
        options: {
          style: 'compressed'
        },
        files: {
          'dist/css/main-<%= pkg.version %>.min.css': 'src/scss/main.scss'
        }

      }
    },

    clean: {
      deploy: ['dist']
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: 'src/js/',
          mainConfigFile: 'src/js/config.js',
          include: ['main'],
          out: 'dist/js/main-<%= pkg.version %>.min.js'
        }
      }
    },

    copy: {
      deploy: {
        files: [{
          src: ['src/js/**'],
          dest: 'dist/'
        }]
      }
    },

    "imagemagick-resize": {
      dev: {
        from: 'src/img/hosts/',
        to: 'build/img/hosts/',
        files: '*',
        props: {
          width: 100
        }
      }
    },

    imageoptim: {
      build: {
        options: {
          jpegMini: false,
          imageAlpha: false,
          quitAfter: true
        },
        src: ['build/img'],
      }
    },

    jasmine: {
      src: 'src/js/*.js',
      options: {
        specs: 'test/*.js',
        vendor: ['bower_components/jquery/dist/jquery.js'],
        outfile: 'test/_SpecRunner.html'
      }
    },

    watch: {
      scss: {
        files: ['src/scss/**/*.scss'],
        tasks: 'sass:dev'
      },

      js: {
        files: [
          'Gruntfile.js',
          'src/js/*.js'
        ],
        tasks: 'jshint'
      }
    },

    // Server config
    connect: {
      server: {
        options: {
          port: 9001,
          keepalive: true
        }
      }
    }
  });

  // Load some stuff
  grunt.loadNpmTasks('grunt-modernizr');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-imagemagick');
  grunt.loadNpmTasks('grunt-imageoptim');

  // A task for development
  grunt.registerTask('dev', ['jshint', 'sass:dev']);

  // A task for deployment
  grunt.registerTask('build', [
    'jshint',
    // 'jasmine',
    'clean',
    // 'modernizr',
    'sass:deploy',
    'requirejs',
    'copy',
    'imagemagick-resize',
    'imageoptim'
  ]);

  // Default task
  grunt.registerTask('default', ['jshint', 'sass:dev', 'requirejs', 'copy']);

  // Travis CI task
  grunt.registerTask('travis', ['jshint', 'jasmine']);

};
