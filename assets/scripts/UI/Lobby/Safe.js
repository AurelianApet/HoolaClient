// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var GameEngine = require("GameEngine");
var Logger = require("Logger");
var Utils = require("Utils");
cc.Class({
    extends: cc.Component,

    properties: {
        gamemoney: cc.Label,
        safemoney: cc.Label,
        money: cc.Label,

        popup_box : cc.Node,
        setpwd_box: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.globals.engine.addEventListener(this.onGameEngineEventHandler, this);
    },
    openSafe() {
        this.money.string = "0";
        this.node.active = true;
        //cc.globals.engine.myUserData.gamemoney = cc.globals.engine.gatewaySFS.mySelf.getVariable("gamemoney").value;
        //cc.globals.engine.myUserData.safemoney = cc.globals.engine.gatewaySFS.mySelf.getVariable("savemoney").value;
        this.gamemoney.string = Utils.numberWithCommas(cc.globals.engine.myUserData.gamemoney);
        this.safemoney.string = Utils.numberWithCommas(cc.globals.engine.myUserData.safemoney);
    },

    // update (dt) {},
    onClickExitButton() {
        this.node.active = false;
        this.money.string = "0";
    },
    
    onClickSaveButton() {
        cc.globals.engine.exchangeSafeMoney(parseInt(this.money.string), 1);
    },

    onClickExchangeButton() {
        cc.globals.engine.exchangeSafeMoney(parseInt(this.money.string), 2);
    },

    onClickChangePwdButton() {
        this.setpwd_box.active = true;
    },

    onClickClearButton() {
        this.money.string = "0";
    },


    addValue(val) {
        var ret = parseInt(this.money.string) + val; 
        this.money.string = ret;
    },

    onClickMoney1Button() {
        this.addValue(10000);
    },

    onClickMoney5Button() {
        this.addValue(50000);
    },

    onClickMoney10Button() {
        this.addValue(100000);
    },

    onClickMoney50Button() {
        this.addValue(500000);
    },

    onClickMoney100Button() {
        this.addValue(1000000);
    },

    onExchangeSafeMoney(data) {
        var result = data.get("result");
        if(result == 1){
            this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.safe_gamelack'));
        }
        if(result == 2) {
            this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.safe_safelack'));
        }
        if(result == 3){   // 성공이면
            //this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.safe_safelack'));
            cc.globals.engine.myUserData.gamemoney = data.get("gamemoney");
            cc.globals.engine.myUserData.safemoney = data.get("savemoney");
            this.gamemoney.string = Utils.numberWithCommas(cc.globals.engine.myUserData.gamemoney);
            this.safemoney.string = Utils.numberWithCommas(cc.globals.engine.myUserData.safemoney);
            cc.globals.engine.node.emit(GameEngineEvents.ENTER_SAFE, {type:GameEngineEvents.ENTER_SAFE, data:params});
        } 
    },

    // 게임엔진 이벤트 처리부
    onGameEngineEventHandler (evt) {
        switch(evt.type) {
            case GameEngine.Events.EXCHANGE_SAFEMONEY:{
                this.onExchangeSafeMoney(evt.data);
                break;
            }
        }
    }
});
