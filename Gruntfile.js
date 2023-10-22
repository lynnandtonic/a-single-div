var path = require('path');
var NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-pug');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        stylus: {
            compile: {
                // options: {
                //     use: [
                //         require('autoprefixer-stylus')
                //     ]
                // },

                files: {
                    'public/css/main.css':      ['_styl/main.styl'],
                    'public/css/2014-2019.css': ['_styl/pages/2014-2019.styl'],
                    'public/css/divtober.css':  ['_styl/pages/divtober.styl']
                }
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
            pug: {
                files: ['_pug/**'],
                tasks: ['pug:basic'],
                options: {
                  spawn: false,
                  livereload: true
              }
            },
            css: {
                files: ['_styl/**'],
                tasks: ['css'],
                options: {
                  livereload: true
                }
            },
            images: {
                files: ['_images/**'],
                tasks: ['copy'],
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
        },

        clean: ['public']
    });

    grunt.event.on('watch', (action, filepath, target) => {
        if (target === 'pug') {
        const files = grunt.config('pug.basic.files');
        files[0].cwd = '_pug';
        files[0].src = ['**/*.pug'];
        grunt.config.set('pug.basic.files', files);
        }
    });

    grunt.registerTask('css', ['stylus']);
    grunt.registerTask('build', ['clean', 'css', 'pug', 'copy']);
    grunt.registerTask('serve', ['build', 'connect:server', 'watch'])
    grunt.registerTask('default', ['build'])
};
