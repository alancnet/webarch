module.exports = function(grunt) {
    grunt.initConfig({
        // Initial Tasks:
        "closure-compiler-build": {
            build: {
                url: 'http://dl.google.com/closure-compiler/compiler-latest.zip',
                dir: 'obj/closure/build/',
                filename: 'compiler.zip'
            }
        },
        mkdir: {
            'obj/es5': {
                options: {
                    create: ["obj/es5"]
                }
            },
            'closure-compiler-build': {
                // Due to a bug: https://github.com/ionscript/grunt-closure-compiler-build/issues/2
                // We need to create this directory before grunt-closure-compiler-build does.
                options: {
                    create: ["obj/closure/build"]
                }
            }
        },
        lodash: {
            'build': {
                // output location
                'dest': 'obj/lodash/lodash.build.js',
                'options': {
                    // modifiers for prepared builds
                    // modern, strict, compat
                    'modifier': 'modern'
                }
            }
        },


        // Build Tasks:
        clean: {
            build: ["obj/rt", "obj/src", "obj/es5"]
        },
        eslint: {
            target: ['src/**/*.js'],
            options: {}
        },
        babel: {
            options: {
                sourceMap: "inline",
                optional: "runtime"
            },
            dist: {
                files: [{
                    "expand": true,
                    "cwd": "src/",
                    "src": ["**/*.js"],
                    "dest": "obj/src",
                    "ext": ".js"
                }]
            }
        },
        reactTemplates: {
            modules: 'commonjs',
            format: 'stylish',
            src: ['obj/rt/**/*.rt']
        },
        jasmine_node: {
            projectRoot: 'obj/src/tests/',
            specNameMatcher: 'test',
            matchall: true,
            all: []
        },
        browserify: {
            options: {
                browserifyOptions: {
                    debug: true
                }
            },
            development: {
                debug: true,
                files: {
                    "obj/es5/compiled.js": "obj/src/main.js"
                }
            }
        },
        "closure-compiler": {
            optimize: {
                closurePath:'obj/closure',
                js: 'obj/es5/compiled.js',
                jsOutputFile: 'obj/es5/compiled.min.js',
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS'
                }
            }
        },
        copy: {
            // Copy react templates to obj to be processed
            "rt-in": {
                expand: true,
                cwd: 'src/',
                src: ['**/*.rt'],
                dest: 'obj/rt/'
            },
            // Copy finished rt files to es6
            "rt-out": {
                expand: true,
                cwd: 'obj/rt/',
                src: ['**/*.js'],
                dest: 'obj/src/'
            }
        },


        // Development Tasks (start with 'grunt dev'):
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: './',
                    livereload: true
                }
            }
        },
        watch: {
            'eslint-babel': {
                files: ['src/**/*.js'],
                tasks: ['eslint', 'babel'],
                options: {
                    interrupt: true
                }
            },
            'react-templates': {
                files: ['src/**/*.rt'],
                tasks: ['copy:rt-in', 'react-templates', 'copy:rt-out' ]
            },
            'browserify': {
                files: ['obj/src/**/*.js'],
                tasks: ['jasmine_node:all', 'mkdir:obj/es5', 'browserify'],
                options: {
                    livereload: true
                }
            },
            'closure-compiler:optimize': {
                files: ['obj/es5/compiled.js'],
                tasks: ['closure-compiler:optimize'],
                options: {
                    interrupt: true
                }
            },
            'content-files': {
                files: ['*.html'],
                options: {
                    livereload: true
                }
            }
        }

    });
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-lodash');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-closure-compiler');
    grunt.loadNpmTasks('grunt-closure-compiler-build');
    grunt.loadNpmTasks('grunt-react-templates');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.registerTask('default', [
        'clean',
        'eslint',
        'babel',
        'copy:rt-in',
        'react-templates',
        'copy:rt-out',
        'jasmine_node:all',
        'mkdir:obj/es5',
        'browserify',
        'closure-compiler:optimize'
    ]);
    grunt.registerTask('init', [
        'lodash:build',
        'mkdir:closure-compiler-build',
        'closure-compiler-build'
    ]);
    grunt.registerTask('dev', [
        'connect',
        'watch'
    ]);
};