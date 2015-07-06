var _ = require('lodash');
module.exports = function(grunt, options) {
    module.exports.initConfig(grunt, options);
    module.exports.registerTasks(grunt);

    // Add modules from this module's directory
    var cwd = process.cwd();
    process.chdir(modulePath());
    try {
        module.exports.loadNpmTasks(grunt);
    } finally {
        process.chdir(cwd);
    }
};

function modulePath() {
    return module.filename.replace(/[^\/]*$/, '');
}

module.exports.gruntfile = function(options) {
    return function(grunt) {
        module.exports(grunt, options);
    };
};

module.exports.initConfig = function(grunt, options) {
    grunt.initConfig(_.merge({}, {
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
            'dist': {
                options: {
                    create: ["dist"]
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
            build: ["obj/rt", "obj/src", "obj/es6", "dist", "lib"]
        },
        eslint: {
            target: ['src/**/*.js'],
            options: {
                configFile: modulePath() + '/.eslintrc'
            }
        },
        babel: {
            options: {
                sourceMap: "inline",
                optional: "runtime",
                retainLines: true
            },
            dist: {
                files: [{
                    "expand": true,
                    "cwd": "obj/es6/",
                    "src": ["**/*.js"],
                    "dest": "dist"
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
                'react/addons': 'React'
            }
        },
        jasmine_node: {
            projectRoot: 'dist/',
            specNameMatcher: '.test',
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
                src: ["./dist/**/*.js", '!./dist/**/*.test.js'],
                dest: "lib/<%- package.name%>.js"
            }
        },
        "closure-compiler": {
            optimize: {
                closurePath: 'obj/closure',
                js: 'lib/<%- package.name%>.js',
                jsOutputFile: 'lib/<%- package.name%>.min.js',
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
                tasks: ['copy:rt-in', 'react-templates', 'babel:rt']
            },
            'test': {
                files: ['dist/**/*.js'],
                tasks: ['jasmine_node:all', 'mkdir:dist', 'watchify']
            },
            'copy-src': {
                files: ['src/**/*.js'],
                tasks: ['copy:es6-out']
            },
            'closure': {
                files: ['lib/<%- package.name %>.js'],
                tasks: ['closure-compiler:optimize']
            },
            'content-files': {
                files: ['*.html', 'dist/**/*.js'],
                options: {
                    livereload: true
                }
            }
        }
    }, options||{}));
};

module.exports.loadNpmTasks = function(grunt) {
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
        'mkdir:dist',
        'watchify',
        'closure-compiler:optimize'
    ]);
};
module.exports.registerTasks = function(grunt) {
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