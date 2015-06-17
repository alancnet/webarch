module.exports = function(grunt) {
    grunt.initConfig({
        'closure-compiler-build': {
            build: {
                url: 'http://dl.google.com/closure-compiler/compiler-latest.zip',
                dir: 'node_modules/grunt-closure-compiler-build/build/',
                filename: 'compiler.zip'
            }
        },
        flow: {
            app: {
                src: './',            // `.flowconfig` folder
                options: {
                    background: false,    // Watch/Server mode
                    all: false,           // Check all files regardless
                    lib: '',              // Library directory
                    stripRoot: false,     // Relative vs Absolute paths
                    weak: false,          // Force weak check
                    showAllErrors: false  // Show more than 50 errors
                }
            }
        },
        traceur: {
            options: {
                experimental: true
            },
            compile: {
                files: {
                    'obj/src/main.es5.js': ['src/main.js']
                }
            }
        },
        "babel": {
            options: {
                sourceMap: true,
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
        'closure-compiler': {
            es6toes5: {
                closurePath:'../node_modules/grunt-closure-compiler-build',
                cwd: 'src/',
                js: '*.js',
                jsOutputFile: 'obj/src/main.es5.js',
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT6',
                    language_out: 'ES5',
                    formatting: 'pretty_print'
                }
            },
            optimize: {
                closurePath:'node_modules/grunt-closure-compiler-build',
                js: 'obj/es5/compiled.js',
                jsOutputFile: 'obj/es5/compiled.min.js',
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS'
                }
            }

        },
        eslint: {
            target: ['src/**/*.js'],
            options: {}
        },
        "reactTemplates": {
            modules: 'commonjs',
            format: 'stylish',
            src: ['obj/rt/**/*.rt']
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
        clean: {
            build: ["obj"],
            release: ["lib"]
        },
        mkdir: {
            'obj/es5': {
                options: {
                    create: ["obj/es5"]
                }
            },
            'closure-compiler-build': {
                options: {
                    create: ["node_modules/grunt-closure-compiler-build/build"]
                }
            }
        },
        browserify: {
            options: {
                external: "main",
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
        webpack: {
            someName: {
                // webpack options
                entry: "./obj/src/main.js",
                output: {
                    path: "obj/packed/",
                    filename: "packed.js"
                },

                stats: {
                    // Configure the console output
                    colors: false,
                    modules: true,
                    reasons: true
                }
//                // stats: false disables the stats output
//
//                storeStatsTo: "xyz", // writes the status to a variable named xyz
//                // you may use it later in grunt i.e. <%= xyz.hash %>
//
//                progress: false, // Don't show progress
//                // Defaults to true
//
//                failOnError: false, // don't report error to grunt if webpack find errors
//                // Use this if webpack errors are tolerable and grunt should continue
//
//                watch: true, // use webpacks watcher
//                // You need to keep the grunt process alive
//
//                keepalive: true, // don't finish the grunt task
//                // Use this in combination with the watch option
            }
        },
        jasmine_node: {
            projectRoot: 'obj/src/tests/',
            specNameMatcher: 'test',
            matchall: true,
            all: []
        },
        watch: {
            'closure-compiler:es6toes5': {
                files: ['src/**/*.js'],
                tasks: ['eslint', 'babel']
            },
            'react-templates': {
                files: ['src/**/*.rt'],
                tasks: ['copy:rt-in', 'react-templates', 'copy:rt-out' ]
            },
            'browserify': {
                files: ['obj/src/**/*.js'],
                tasks: ['jasmine_node:all', 'mkdir:obj/es5', 'browserify']
            },
            'closure-compiler:optimize': {
                files: ['obj/es5/compiled.js'],
                tasks: ['closure-compiler:optimize']
            }
        }

    });
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-flow-type-check');
    grunt.loadNpmTasks('grunt-traceur-compiler');
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
        'mkdir:closure-compiler-build',
        'closure-compiler-build'
    ]);
};