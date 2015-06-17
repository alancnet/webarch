# Getting Started
```bash
npm install
grunt init
grunt
grunt watch
```

## npm install
This will install all NPM dependencies.

## grunt init
This will initialize the repository with one-time tasks.

## grunt
This will run through the entire build process, including:
- Eslint: Enforces coding style.
- Babel: Transpiles EcmaScript6 to EcmaScript5.
- ReactTemplates: Converts .rt files into React Template modules.
- Jasmine: Executes unit tests.
- Browserify: Combines all JavaScript files into a single file.
- Closure: Optimizations including
  - Removing dead code
  - Obfuscation
  - Simplifying expressions

The resulting compiled files are available at
- `obj/es6/compiled.js` - Browserified, human readable.
- `obj/es6/compiled.min.js` - Optimized, obfuscated. Not human readable.

## grunt watch
This will continue to validate coding style, run unit tests, and build as you edit and save files.

**You must run `grunt` before running `grunt watch`!**