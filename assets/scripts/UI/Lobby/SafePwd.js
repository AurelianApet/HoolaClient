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

cc.Class({
    extends: cc.Component,

    properties: {
        safe_box: cc.Node,
        password: cc.EditBox,
        popup_box: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // 엔진 이벤트 처리부를 등록한다.
        cc.globals.engine.addEventListener(this.onGameEngineEventHandler, this);
    },

    // update (dt) {},
    onClickExitButton() {
        this.node.active = false;
    },

    onClickConfirmButton() {
        cc.globals.engine.enterSafe(this.password.string);
    },

    onEnterSafe(data) {   //  result: 0-유저없음, 1-비번틀림, 2-성공
        var result = data.get("result");
        if(result == 0){
            this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.safe_dismatch_pwd'));
        }
        if(result == 1)     //  금고열기 성공이면
        {
            this.node.active = false;
            this.safe_box.getComponent("Safe").openSafe();
        }
    },

     // 게임엔진 이벤트 처리부
     onGameEngineEventHandler (evt) {
        switch(evt.type) {
            case GameEngine.Events.ENTER_SAFE:{
                this.onEnterSafe(evt.data);
                break;
            }
        }
    }
});
