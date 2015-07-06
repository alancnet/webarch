import React from 'react';
import HelloWorld from './hello-world';
describe('hello-world', () => {
    it('constructs', () => {
        React.createElement(HelloWorld, {});
    });
});