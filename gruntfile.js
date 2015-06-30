module.exports = function(grunt) {
    grunt.initConfig({
        // External resources:
        package: grunt.file.readJSON('package.json'),

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
            build: ["obj/rt", "obj/src", "obj/es5", "obj/es6", "dist"]
        },
        eslint: {
            target: ['src/**/*.js'],
            options: {}
        },
        babel: {
            options: {
                sourceMap: "inline",
                optional: "runtime",
                nonStandard: "jsx"
            },
            dist: {
                files: [{
                    "expand": true,
                    "cwd": "obj/es6/",
                    "src": ["**/*.js"],
                    "dest": "obj/es5"
                }]
            },
            rt: {
                files: [{
                    "expand": true,
                    "cwd": "obj/rt/",
                    "src": ["**/*.js"],
                    "dest": "obj/src",
                    "ext": ".rt.js"
                }]
            }
        },
        reactTemplates: {
            modules: 'es6',
            format: 'stylish',
            src: ['obj/rt/**/*.rt'],
            defines: {
                'react/addons': 'React',
                'lodash': '_',
                'react-router': '{ Router, Route, Link, RouteHandler }'
            }
        },
        jasmine_node: {
            projectRoot: 'obj/es5/tests/',
            specNameMatcher: 'test',
            matchall: true,
            all: []
        },
        watchify: {
            options: {
                debug: true,
                browserifyOptions: {
                    debug: true
                }
            },
            development: {
                src: ["./obj/es5/**/*.js", '!./obj/es5/**/*-test.js'],
                dest: "dist/<%- package.name%>.js"
            }
        },
        "closure-compiler": {
            optimize: {
                closurePath:'obj/closure',
                js: 'dist/<%- package.name%>.js',
                jsOutputFile: 'dist/<%- package.name%>.min.js',
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
                dest: 'obj/es6/'
            },
            "es6-out": {
                expand: true,
                cwd: 'src',
                src: ['**/*.js'],
                dest: 'obj/es6'
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
                files: ['obj/es6/**/*.js'],
                tasks: ['eslint', 'babel:dist']
            },
            'rt-babel': {
                files: ['obj/rt/**/*.js'],
                tasks: ['babel:rt']
            },
            'react-templates': {
                files: ['src/**/*.rt'],
                tasks: ['copy:rt-in', 'react-templates', 'babel:rt' ]
            },
            'test': {
                files: ['obj/es5/**/*.js'],
                tasks: ['jasmine_node:all', 'mkdir:obj/es5', 'watchify']
            },
            'copy-src': {
                files: ['src/**/*.js'],
                tasks: ['copy:es6-out']
            },
            'closure': {
                files: ['dist/<%- package.name %>.js'],
                tasks: ['closure-compiler:optimize']
            },
            'content-files': {
                files: ['*.html', 'dist/**/*.js'],
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
    grunt.loadNpmTasks('grunt-watchify');
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
        'copy:es6-out',
        'copy:rt-in',
        'react-templates',
        'copy:rt-out',
        'eslint',
        'babel:dist',
        'jasmine_node:all',
        'mkdir:obj/es5',
        'watchify',
        'closure-compiler:optimize'
    ]);
    grunt.registerTask('init', [
        'lodash:build',
        'mkdir:closure-compiler-build',
        'closure-compiler-build'
    ]);
    grunt.registerTask('dev', [
        'watchify',
        'connect',
        'watch'
    ]);
};