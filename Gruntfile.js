module.exports = function(grunt) {
  // Load all grunt tasks matching the "grunt-*" pattern.
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    packageJson: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port      : 8000,
          protocol  : 'http',
          hostname  : '0.0.0.0',
          base      : 'app',
          keepalive : true,
          debug     : true,
          open      : false,
        }
      }
    }
  });

  grunt.registerTask('server', [
    'connect:server'
  ]);
}
