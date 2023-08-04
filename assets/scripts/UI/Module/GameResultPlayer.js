// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var Utils = require("Utils");
var Logger = require("Logger");
cc.Class({
    extends: cc.Component,

    properties: {
        medals: [cc.SpriteFrame],
        medal: cc.Node,
        avatar: cc.Sprite,
        playerName: cc.Label,
        gamemoney: cc.Label,
        winmoney: cc.Label,
        card_anchors: [cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
    clearData() {
        this.playerName.string = "";
        this.gamemoney.string = "";
        this.winmoney.string = "";
        for(var i = 0; i < this.card_anchors.length; i ++)
            this.card_anchors[i].removeAllChildren();
        this.avatar.getComponent("Avatar").clearAvatar();
        this.medal.getComponent(cc.Sprite).spriteFrame = null;
    },

    setData(data, rank) {
        Logger.log("rank:" + rank);
        this.playerName.string = data.name;
        this.gamemoney.string = Utils.numberWithCommas(data.money);
        this.winmoney.string = Utils.numberWithCommas(Math.abs(data.winmoney));
        if(data.isWinner == 0){
            this.winmoney.string = '-' + this.winmoney.string;
            this.winmoney.node.color = new cc.Color(225, 121, 43);
        }
        else {
            this.winmoney.string = '+' + this.winmoney.string;
            this.winmoney.node.color = new cc.Color(36, 158, 200);
        } 
        this.avatar.getComponent("Avatar").setAvatar(data.avatar);
        this.medal.getComponent(cc.Sprite).spriteFrame = this.medals[rank];
    }
});
