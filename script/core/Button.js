import { Node } from "./Node.js";
export class Button extends Node {
    constructor() {
        super();
        this._path = "";
    }

    get path(){
        return this._path;
    }
    set path(value){
        this._path = value;
        this.elm.src = this._path;
    }
    _createElement(){
        let elm = document.createElement("button");
        elm.style.position = "absolute";
        return elm;
    }
}