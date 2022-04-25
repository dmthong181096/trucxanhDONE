import { Node } from "./core/Node.js";
import { Sprite } from "./core/Sprite.js";
import { Card } from "./components/Card.js";
import { Label } from "./core/Label.js";
import { Button } from "./core/Button.js";
class Game extends Node {
    constructor() {
        super();
        this._createPlayGame()
        this._createNewGame();
        this.isAppearResult = false
        this._load();
        this.cards = [];
    }
/* VARIABLE 
---------------------------------------
*/
    _load() {
        this.stars = []
        this.indexValue = (this.createValueCards());
        this.isClickedReset = false
        this.canSelfClick = true;
        this.firstCard = null;
        this.secondCard = null;
        this.score = 10;
        this.countRight = 0;
        this.valueCards = [];
        this.tl = gsap.timeline();
        this.musics = {
            click: "click",
            countScore: "countScore",
            match: "match",
            nomatch: "nomatch",
            victoria: "victoria",
            lose: "lose",
            playGame: "playGame"
        };
    }
/*--------------------------------------- */


    play() {
        this.createdCard = this._createCards();
        this.elementScore = this._createScore(this.score);
    }
/*
BUTTON FUNCTION
---------------------------------------
    */
    resetGame() {
        if (this.isClickedReset == true) { return }
        if (this.isAppearResult == true) {
            this.removeResult()
            this.removeAnimWin()
            this.removeAnimLose()
            this.elementScore.elm.style.display = "block"
        } else { this.removeCards()}
        this.playMusic(this.musics.playGame)
        this._load()
        this._createCards()
        this.elementScore.text = `SCORE: ${this.score}`
        this.isClickedReset = true
    }
    playGame() {
        this.isClickedReset = true
        this.playMusic(this.musics.playGame)
        this._load();
        this.play();
        this.btnPlayGame.elm.style.display = "none"
        this.tl.to(this.btnNewGame.elm, { x: 0, y: 350, duration: 2, onComplete: () => this.btnNewGame.elm.disabled = false })
        TweenMax.fromTo(this.elementScore.elm, { x: -100, y: 150 }, { x: 470, y: 150, duration: 4, ease: Back.easeOut.config(6) })
        this.btnNewGame.elm.style.opacity = 1
    }
/*--------------------------------------- */
/*
CREATE ELEMENT GAME
---------------------------------------
*/
    _createResultBoard(text, typeMusic) {
        this.resultBoard = new Label();
        this.resultBoard.width = 1500;
        this.resultBoard.height = 100;
        this.resultBoard.x = 100;
        this.resultBoard.y = 300;
        this.resultBoard.text = `${text}`;
        this.playMusic(`${typeMusic}`);
        this.resultBoard.fontSize = 70;
        this.addChild(this.resultBoard);
        return this.resultBoard;
    }
    _createScore(value) {
        let score = new Label();
        score.elm.style.backgroundColor = "#C0C0C0"
        score.text = `SCORE: ${value}`;
        score.width = 550;
        score.height = 40
        score.fontSize = 25;
        score.elm.style.textAlign = "center"
        this.addChild(score);
        return score;
    }
    _createPlayGame() {
        this.btnPlayGame = new Button();
        this.btnPlayGame.x = 580;
        this.btnPlayGame.y = 200;
        this.btnPlayGame.width = 330;
        this.btnPlayGame.height = 50;
        this.btnPlayGame.elm.addEventListener("click", this.playGame.bind(this, this.btnPlayGame));
        this.btnPlayGame.elm.style.border = "0"
        this.btnPlayGame.elm.style.background = "transparent"
        this.btnPlayGame.elm.style.backgroundImage = "url(./images/StartGame.png)";
        this.btnPlayGame.elm.style.backgroundSize = "100% 100%";
        this.addChild(this.btnPlayGame);
    }
    _createNewGame() {
        this.btnNewGame = new Button();
        this.btnNewGame.x = 580;
        this.btnNewGame.y = 300;
        this.btnNewGame.width = 330;
        this.btnNewGame.elm.disabled = true
        this.btnNewGame.height = 50;
        this.btnNewGame.elm.style.opacity = 0.5
        this.btnNewGame.elm.addEventListener("click", this.resetGame.bind(this, this.btnNewGame));
        this.btnNewGame.elm.style.background = "transparent"
        this.btnNewGame.elm.style.backgroundImage = "url(./images/NewGame.png)";
        this.btnNewGame.elm.style.backgroundSize = "100% 100%";
        this.btnNewGame.elm.style.border = "0"
        this.addChild(this.btnNewGame);
    }
    _createCards() {
        this.isClickedReset = true
        for (let index = 0; index < 20; index++) {
            this.card = new Card(index);
            this.card.elm.style.display = "block"
            this.card.cover.elm.style.display = "block"
            this.card.cover.elm.style.display = "block"
            this.card.label.elm.style.display = "block"
            this.card.elm.addEventListener("click", this.onClickedCard.bind(this, this.card));
            this.card.elm.setAttribute("class", `${index}`);
            this.card.setValue(this.indexValue[index]);
            this.cards.push(this.card);
        }
        this.collectCards()
        return this.card;
    }
/* --------------------------------------- */
/* LOGIC GAME
---------------------------------------
*/
    createValueCards() {
        this.valueCards = [];
        for (let i = 0; i < 20; i++) {
            this.valueCards.push(i % 10);
        }
        return this.valueCards;
    }
    shuffleValueCards() {
        return this.valueCards.sort(() => Math.random() - 0.5);
    }
    onClickedCard(card) {
        if (this.isClickedReset == true) {
            return;
        } else {
            if (card.preventSelfClick() == "false") {
                card.sprite.elm.setAttribute("isClicked", "true");
                card.flipCard();
            } else {
                return;
            }
        }
        if (card === this.firstCard) return;
        if (this.firstCard === null) {
            this.firstCard = card;
            console.log("First: ", this.firstCard.value);
        } else {
            this.secondCard = card;
            if (this.secondCard.index == this.firstCard.index) {
                this.secondCard = null;
                return;
            }
            console.log("Second: ", this.secondCard.value);
            this.compareCard(this.firstCard, this.secondCard);
            this.firstCard = null;
        }
        this.playMusic(this.musics.click);
    }
    compareCard(firstCard, secondCard) {
        let point = 0;
        this.isClickedReset = true
        if (this.firstCard.value == this.secondCard.value) {
            console.log("MATCH");
            setTimeout(() => {
                firstCard.scaleCard();
                secondCard.scaleCard();
                this.playMusic(this.musics.match);
                point = 10;
                this.counterScore(point);
                this.isClickedReset = false
            }, 1000);
            setTimeout(() => {
                firstCard.hideCard();
                secondCard.hideCard();
                this.countRight++;
                if (this.countRight == 2) {
                    this.isClickedReset = false
                    this.isAppearResult = true
                    this.endGame(true, this.musics.victoria);
                }
            }, 2000);
        } else {
            console.log("NOT MATCH");
            setTimeout(() => {
                this.playMusic(this.musics.nomatch)
                firstCard.closeCard();
                secondCard.closeCard();
                point = -5;
                console.log(point);
                this.counterScore(point);
                this.isClickedReset = false
                if (this.score <= 0) {
                    this.isAppearResult = true
                    return this.endGame(false, this.musics.lose);
                }
            }, 1000);
        }
    }
    removeResult() {
        this.resultBoard.elm.style.display = "none"
        this.isAppearResult = false
    }
    removeCards() {
        for (let index = 0; index < this.cards.length; index++) {
            this.cards[index].elm.remove()
        }
        this.isClickedReset = true
        this.cards = []
    }
    endGame(result, typeMusic) {
        this.isAppearResult = true
        this.removeCards();
        this.elementScore.elm.style.display = "none"
        if (result == true) {
            this._createResultBoard(`YOU WIN WITH SCORE ${this.score}`, typeMusic);
            this._load();
            this.animWin()
        } else {
            this._createResultBoard(`YOU LOSE!!!`, typeMusic);
            this._load();
            this.animLose()
        }
    }
    /* --------------------------------------- */
    /* 
    ANIMATION 
    ---------------------------------------
    */
    collectCards() {
        for (let index = 19; index >= 0; index--) {
            this.tl.to(this.cards[index].elm, { scale: 1, duration: 0 });
            this.cards[index].x = 470;
            this.cards[index].y = 200;
            this.cards[index].sprite.elm.style.zIndex = "1"
            this.cards[index].sprite.elm.style.opacity = "0.5"
            this.addChild(this.cards[index]);
            this.tl.fromTo(this.cards[index].elm, { x: 220, y: 160, opacity: 0 }, { x: 220, y: 160, opacity: 1, ease: Back.easeOut, duration: 0.03 })
            this.tl.fromTo(this.cards[index].elm, { x: 220, y: 160, opacity: 0 }, { x: 220, y: 160, opacity: 0, ease: Back.easeOut, duration: 0.05 })
            if (index == 0) {
                this.tl.fromTo(this.cards[index].elm,{ alpha: 0 },{ alpha: 1, duration: 0.1, onComplete: this.distributeCards.bind(this) });
            }
        }
    }
    distributeCards() {
        for (let index = 19; index >= 0; index--) {
            this.cards[index].sprite.elm.style.zIndex = "0"
            this.cards[index].sprite.elm.style.opacity = "1"
            let col = index % 5;
            let row = Math.floor(index / 5);
            this.addChild(this.cards[index]);
            TweenMax.fromTo(this.cards[index].elm, { x: 220, y: 160, opacity: 1}, { y: row * 110, x: col * 110, opacity: 1, delay: (index) * 0.1, ease: Back.easeOut.config(7) })
            if (index == 0) {
                this.tl.to(this.cards[index].elm,{ alpha: 1, duration: 0.1, onComplete: this.openClickWhenLoaded.bind(this) });
            }
        }
    }
    openClickWhenLoaded() {
        setTimeout(() => {
            this.isClickedReset = false
            console.log("complete load");
        }, 2500);
    }
    counterScore(point) {
        let startCount = this.score;
        this.score = startCount + point;
        let num = { start: startCount };
        let time = 0.4;
        gsap.timeline().set(num, { start: startCount }).to(num, {start: this.score,duration: time, onUpdate: this.changeScore.bind(this, num)});
    }
    changeScore(num) {
        this.elementScore.text = `SCORE: ${num.start.toFixed()}`;
    }
    animLose() {
        this.resultBoard.color = "#EEA9B8"
        this.tl.fromTo(this.resultBoard.elm, { x: 100, y: 50 }, { x: 500, y: 50, alpha: 1, duration: 15, delay: 1, ease: Back.easeOut.config(6) });
        this.tl.fromTo(this.resultBoard.elm, { x: 500, y: 50 }, { x: 350, y: 50, alpha: 1, duration: 15, delay: 1, ease: Back.easeOut.config(6) });
    }
    removeAnimLose() {
        this.resultBoard.elm.style.display = "none"
    }
    animWin() {
        this.resultBoard.color = "#DDC488"
        for (let index = 0; index < 100; index++) {
            this.star = new Sprite()
            this.star.elm.style.background = "transparent"
            this.star.elm.style.content = "url('./images/Gold.jpg')"
            this.star.elm.style.backgroundSize = "100% 100%"
            this.star.elm.style.border = "0"
            this.star.elm.style.width = "30px"
            this.star.elm.style.height = "30px"
            this.stars.push(this.star)
            this.addChild(this.star)
            TweenMax.fromTo(this.star.elm, { x: Math.floor(Math.random() * 1500), y: Math.floor(Math.random() * 1500) }, { x: Math.floor(Math.random() * 1500), y: Math.floor(Math.random() * 1500), alpha: 1, duration: 30, ease: Elastic.easeOut.config(5, 0.3) })
            TweenMax.fromTo(this.star.elm, { x: Math.floor(Math.random() * 1500), y: Math.floor(Math.random() * 1500) }, { x: Math.floor(Math.random() * 1500), y: Math.floor(Math.random() * 1500), alpha: 1, duration: 30, ease: Elastic.easeOut.config(5, 0.3) })
            this.tl.to(this.star.elm, { scaleX: 0, duration: 0 });
            this.tl.to(this.star.elm, { scaleX: 1, duration: 0.5 });
            this.tl.play()
        }
    }
    removeAnimWin() {
        for (let index = 0; index < this.stars.length; index++) {
            this.stars[index].elm.remove()
        }
    }
    playMusic(typeMusic) {
        this.audio = new Audio("./music/" + typeMusic + ".wav");
        this.audio.play();
        return this.audio;
    }
/* --------------------------------------- */
}
let game = new Game();
document.body.appendChild(game.elm);
game.x = 0
game.y = 0
game.width = 1500
game.height = 760
document.body.style.backgroundImage = "url(https://demoda.vn/wp-content/uploads/2022/01/anh-nen-toi-gian-minimalist-hoat-hinh.jpg)"
document.body.style.backgroundSize = "100%"
