import React from "react";
import rt from "./about.rt";

export default class About extends React.Component {
    constructor() {
        super();
        this.render = rt;
    }
}
