var build = require('wa-build');
module.exports = build.gruntfile({
    reactTemplates: {
        defines: {
            'react-router': '{ Router, Route, Link, RouteHandler }'
        }
    }
});