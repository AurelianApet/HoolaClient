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
        money:cc.Label,
        account: cc.EditBox,
        account_name: cc.EditBox,
        tel: cc.EditBox,

        popup_box: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.money.string = "0";

        
    },

    openChargeBox() {
        this.node.active = true;
        this.clearData();
        cc.globals.engine.addEventListener(this.onGameEngineEventHandler, this);
        cc.globals.engine.requireChargeBankInfo();
    },

    addValue(val) {
        var ret = parseInt(this.money.string) + val; 
        this.money.string = ret;
    },

    clearData() {
        this.account.string = "";
        this.account_name.string = "";
        this.tel.string = "";
        this.money.string = "0";
    },

    // update (dt) {},
    onClickConfirmButton() {
        if(this.account.string == "") {
            this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.charge_empty_banknum'));
            return;
        }
        if(this.account_name.string == "") {
            this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.charge_empty_name'));
            return;
        }
        if(this.tel.string == "") {
            this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.empty_tel'));
            return;
        }
        if(this.money.string == "0") {
            this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.charge_empty_money'));
            return;
        }
        //this.node.active = false;
        var data = {};
        data.account = this.account.string;
        data.name = this.account_name.string;
        data.money = parseInt(this.money.string);
        data.tel = this.tel.string;
        cc.globals.engine.chargeMoney(data);

        this.node.active= false;
        this.clearData();
    },

    onClickCancelButton() {
        this.node.active = false;
    },

    onClickExitButton() {
        this.node.active = false;
    },

    onClickClearButton() {
        this.money.string = "0";
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

    onChargeMoney(data) {
        var result = data.get("result");
        var popup = this.popup_box.getComponent("Popup");
        if(result == 0)
            popup.showMessage(cc.globals.engine.stringTable('msg.charge_request_failed'));
        else if(result == 1){
            popup.showMessage(cc.globals.engine.stringTable('msg.charge_request_successed'));
            
        }
    },
    onChargeBankInfo(data) {
        Logger.log("account" + data.get("account"));
        Logger.log("account_name" + data.get("account_name"));
        Logger.log("tel" + data.get("tel"));
        this.account.string = data.get("account");
        this.account_name.string = data.get("account_name");
        this.tel.string = data.get("tel");

        
    },

    // 게임엔진 이벤트 처리부
    onGameEngineEventHandler (evt) {
        switch(evt.type) {
            case GameEngine.Events.CHARGE_MONEY:{
                this.onChargeMoney(evt.data);
                break;
            }
            case GameEngine.Events.CHARGE_BANKINFO:{
                this.onChargeBankInfo(evt.data);
                break;
            }
        }
    }
});
