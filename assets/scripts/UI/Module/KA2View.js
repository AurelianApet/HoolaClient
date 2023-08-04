// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var HoolaCard = require("HoolaCard");

cc.Class({
    extends: cc.Component,

    properties: {
        cards:{
            default:[],
            type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    clearData() {
        for(var i = 0; i < 12; i ++)
            this.cards[i].opacity = 30;
    },

    checkCards(_cards) {
        for(var i = 0; i < _cards.length; i ++) {
            var card = new HoolaCard();
            card.setValue(_cards[i]);
            var num = card.num;
            var type = card.kind;
            if(num == 13)num = 0;
            if(num > 2)continue;
            console.log("num:" + num + " type:" + type);
            var val = num * 4 + type - 1;
            this.cards[val].opacity = 255;
        }
    }
});
