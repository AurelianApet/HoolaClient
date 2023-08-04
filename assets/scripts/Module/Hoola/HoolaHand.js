// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var Logger = require("Logger");
var HoolaCard = require("HoolaCard");

cc.Class({
    properties: {
        cards : [],
        jokbo : cc.String,
        isMaidJokbo : false
    },

    ctor() {
        this.jokbo = "";
        this.isMaidJokbo = false;
    },

    addCard(card) {
        if(this.cards.length >= 13) {
            Logger.log2(this, '카드수를 초과합니다!');
            return;
        }
        var hoolaCard = new HoolaCard();
        hoolaCard.setValue(card);
        this.cards.push(hoolaCard);

        // 카드13장이 다 차면 족보를 갱신한다.
        if(this.cards.length == 13) {
            this.sortCards();
            this.updateHand();
        }
    },

    removeCard(card) {
        for(var i=0; i<this.cards.length; i++) {
            if(this.cards[i].value == card) {
                this.cards.splice(i, 1);
                return;
            }
        }
    },

    sortCards() {
        var tmp;
        for(var i=0; i<this.cards.length; i++) {
            for(var j=i+1; j<this.cards.length; j++) {
                if(this.cards[i].num > this.cards[j].num) {
                    tmp = this.cards[i];
                    this.cards[i] = this.cards[j];
                    this.cards[j] = tmp;
                }
            }
        }
    },

    // 족보를 갱신한다.
    updateHand() {
        var arrShowCards = [];
        var i;
        for(i=0; i<this.cards.length; i++) {
            if(this.cards[i].value > 0) {
                arrShowCards.push(this.cards[i]);
            }
        }

        this.jokbo = "";
        this.isMaidJokbo = false;

        if(arrShowCards.length < 13) {
            return;
        }

        return;
    },

    //  들고있는 카드를 초기화한다.
    initHand() {
        this.cards = [];
    }

    // update (dt) {},
});
