import { Node } from "../core/Node.js";
import { Sprite } from "../core/Sprite.js";
import { Label } from "../core/Label.js";
// import { Button } from "../core/Button.js";

export class Card extends Node {
    constructor(index) {
        super();
        this.index = index;
        this.value = null;
        this.tl = gsap.timeline({ paused: true });
        this._createSprite();
        this._createCover();
       
        this._createLabel();
    }
    _createSprite() {
        this.sprite = new Sprite();
        this.sprite.width = 106;
        this.sprite.height = 106;
        // this.sprite.elm.style.bottom = "10px"
        this.sprite.elm.setAttribute("isClicked", "false")
        this.addChild(this.sprite);
    }
    _createCover() {
        this.cover = new Node();
        this.cover.width = 100;
        this.cover.height = 100;
        this.cover.elm.style.backgroundColor = "#FF8247";
        this.cover.elm.style.border = "solid 3px white";
        this.addChild(this.cover);
    }
    _createLabel() {
        this.label = new Label()
        this.label.text = this.index
        this.label.fontSize = 25  
        this.label.color = "White"
        this.label.elm.style.textAlign = "center"
        this.label.elm.style.position  = "absolute"   
        this.label.elm.style.padding = "35px 35px"
        this.label.elm.style.width = "36px"
        this.label.elm.style.height = "36px"
        this.addChild(this.label)
    }
    setValue(value) {
        this.value = value;
        this.sprite.path = "./images/trucxanh" + value + ".jpg";
    }
    openCard() {
        console.log("Open");
        this.cover.elm.style.display = "none"
        this.label.elm.style.display = "none"
        this.elm.style.zIndex = "1"
    }
    closeCard() {
        console.log("Close", this.index)
        this.tl.to(this.sprite.elm, { scaleX: 0, duration: 0.5 });
        this.tl.to(this.cover.elm, { scaleX: 1, duration: 0.5 });
        this.tl.to(this.label.elm, { scaleX: 1, duration: 0.5 });
        this.tl.play()
        this.cover.elm.style.display = "block"
        this.label.elm.style.display = "block"
        this.sprite.elm.setAttribute("isClicked", "false")
    }
    hideCard() {
        this.elm.style.display = "none"
    }
    flipCard() {
        console.log("Flip");
        this.tl.to(this.sprite.elm, { scaleX: 0, duration: 0 });
        this.tl.to(this.label.elm, { scaleX: 0, duration: 0 });
        this.tl.to(this.cover.elm, { scaleX: 0, duration: 0.5 });
        this.tl.call(() => {
            this.openCard()
        })
        this.tl.to(this.sprite.elm, { scaleX: 1, duration: 0.5 });
        this.tl.play()
    }

    scaleCard() {
        console.log("Scale");
        var tl1 = new TimelineMax({ paused: true });
        tl1.fromTo(this.sprite.elm,  1, { zIndex: 1,scale: 0 }, {zIndex:1, scale: 1.5 }, 0);;
        tl1.seek(0).play()
    }
    preventSelfClick() {
        return this.sprite.elm.getAttribute("isclicked")
    }
}

