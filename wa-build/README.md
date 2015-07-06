# Prerequisites
1. node-js is installed
2. npm is installed
3. Grunt CLI is installed `npm install -g grunt-cli`

# Using wa-build
1. `mkdir foo` - Create a directory for your component. 
2. `cd foo` - CD to your component directory. 
3. `npm init` - Initialize your component. 
4. `npm install --save-dev wa-build` - Install wa-build. 
5. `npm install --save-dev grunt` - Install local grunt. 
6. `cp node_modules/wa-build/templates/gruntfile.js .` - Copy the gruntfile template to your component. 
7. `grunt init` - Run one-time build prerequisites. 
8. `mkdir src` - Create a src directory for your source code. 
9. `touch src/index.js` - Create src/index.js that will export your component. 
10. `grunt` - Test the build. 

The resulting compiled files are available at

- `dist/index.js` - ES6 to ES5 transpiled. Used for imports from other packages.
- `lib/foo.js` - Browserified, human readable. Use for debugging in web browsers.
- `lib/foo.min.js` - Optimized, obfuscated. Not human readable. Use for production in web browsers.

## grunt dev
To continue building upon changing source code, run `grunt dev` after a successful `grunt` build. 
Files will be served up at http://localhost:9001.

**You must run `grunt` before running `grunt watch`!**