import React from 'react';
import rt from './app.rt';
export default class App extends React.Component {
    constructor() {
        super();
        this.render = rt;
    }
}