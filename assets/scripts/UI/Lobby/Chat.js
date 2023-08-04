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
import * as SFS2X from "sfs2x-api";
cc.Class({
    extends: cc.Component,

    properties: {
        log: cc.Label,
        msg: cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        //this.log.enabled = false;
        
    },

    // update (dt) {},

    openChatBox(){
        this.node.active = true;
        this.log.string = "";
        this.msg.string = "";
        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("getMessage", null));
        cc.globals.engine.addEventListener(this.onGameEngineEventHandler, this);

    },

    onClickExitButton() {
        this.node.active = false;

        //cc.globals.engine.closeChatConnection();
        this.log.string = "";
        this.msg.string = "";
    },

    onEditReturn() {
        var text = this.msg.string;
        if(text == "") return;
        cc.globals.engine.sendChat(text);
        var time = new Date();
        var timeString = time.getFullYear() + "/" +  (time.getMonth() + 1) + "/" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + " ";

        this.log.string += timeString + ' [' + cc.globals.engine.myUserData.name + ']' + cc.globals.engine.stringTable('unit.vip') + ': ' + text + '\n';
        this.msg.string = "";
        this.msg.focus();
    },

    // 게임엔진 이벤트 처리부
    onGameEngineEventHandler (evt) {
        switch(evt.type) {
            case GameEngine.Events.CHAT:{
                var time = new Date();
                var timeString = time.getFullYear() + "/" +  (time.getMonth() + 1) + "/" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + " ";
                this.log.string += timeString +  '[' + cc.globals.engine.myUserData.name + ']' + cc.globals.engine.stringTable('unit.vip') + ': ' + evt.data.get("msg") + '\n';
                
                if(evt.data.get("reply")!=null)
                    this.log.string += timeString +  cc.globals.engine.stringTable('chat.name_admin') + ' : ' + evt.data.get("reply") + '\n';
                //this.log.string += '[' + evt.data.get("name") + ']' + cc.globals.engine.stringTable('unit.vip') + ' : ' + evt.data.get("msg") + '\n';
                break;
            }
            case GameEngine.Events.CHAT_UPDATED:{
                var time = new Date();
                Logger.log(evt.data.get("msg"));
                var timeString = time.getFullYear() + "/" +  (time.getMonth() + 1) + "/" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + " ";
                this.log.string += timeString +  cc.globals.engine.stringTable('chat.name_admin') + ' : ' + evt.data.get("msg") + '\n';
                break;
            }
        }
    }
});
