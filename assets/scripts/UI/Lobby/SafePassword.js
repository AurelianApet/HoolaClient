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

cc.Class({
    extends: cc.Component,

    properties: {
        pwd: cc.EditBox,
        repwd: cc.EditBox,
        popup_box: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.globals.engine.addEventListener(this.onGameEngineEventHandler, this);
    },

    // update (dt) {},

    onClickExitButton() {
        this.node.active = false;
        this.clearData();
    },
    
    clearData() {
        this.pwd.string = "";
        this.repwd.string = "";
    },

    onClickConfirmButton() {
        if(this.pwd == "") {
            this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.empty_pwd'));
            return;
        }
        if(this.pwd.string != this.repwd.string) {
            this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.dismatch_pwd_repwd'));
            return;
        }

        cc.globals.engine.changeSafePwd(this.pwd.string);
    },

    // 게임엔진 이벤트 처리부
    onGameEngineEventHandler (evt) {
        switch(evt.type) {
            case GameEngine.Events.CHANGE_SAFEPWD:{
                if(evt.data.get("result") == 1){ //  성공이면
                    this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.changesafepwd_success'));
                    this.node.active = false;
                    return;
                }
                else {  //  실패이면
                    this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.changesafepwd_failed'));
                    return;
                }
                break;
            }
        }
    }
});
