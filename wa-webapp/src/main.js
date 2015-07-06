import React from 'react';
import router from 'react-router';
import routes from './routes.rt';

export function run(routesRender, hash, target) {
    router.run(routesRender(), hash, (Root) => {
        React.render(React.createElement(Root, {}), target);
    });
}

// Fire off the application for web browsers
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () =>
            run(routes, router.HashLocation, document.body)
    );
}
