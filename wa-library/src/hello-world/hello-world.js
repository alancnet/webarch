import React from 'react';
import rt from './hello-world.rt';

export default class HelloWorld extends React.Component {
    constructor() {
        super();
        console.log('Hello World');
        this.render = rt;
    }
}