var path = require('path');
var NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-pug');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        stylus: {
            compile: {
                options: {
                    use: [
                        require('autoprefixer-stylus')
                    ]
                },

                files: {
                    'public/css/main.css': ['_styl/main.styl']
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'public/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'public/css',
                    ext: '.min.css',
                }]
            }
        },
        pug: {
            basic: {
                files: [{
                    expand: true,
                    cwd: '_pug',
                    src: ['**/*.pug'],
                    dest: 'public',
                    ext: '.html',
                    //Don't render pug files in include or with a _ in the front
                    filter: function (src) {
                        if (src.indexOf('include') > -1) {
                            return false;
                        }
                        if (path.basename(src)[0] === '_') {
                            return false;
                        }
                        return true;
                    },
                    //Move non index.html files into their own dir for clean paths
                    rename: function (dest, src) {
                        if (src !== 'index.html') {
                            return dest + '/' + src.replace('.html', '/index.html');
                        }
                        return dest + '/' + src;
                    }
                }]
            }
        },

        copy: {
            public: {
                files: [
                    {
                        cwd: '_images',
                        expand: true,
                        src: ['**'],
                        dest: 'public/images'
                    },
                    {
                        src: ['_redirects'],
                        dest: 'public/'
                    }
                ]
            },
        },
        watch: {
            build: {
                files: ['_styl/**/*.styl', '_pug/**/*.pug', '_images/**'],
                tasks: ['build'],
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: 'public',
                    livereload: true,
                    open: true
                }
            }
        }
    });

    grunt.registerTask('build', ['stylus', 'pug', 'copy'])
    grunt.registerTask('serve', ['build', 'connect:server', 'watch'])
    grunt.registerTask('default', ['build'])
};
