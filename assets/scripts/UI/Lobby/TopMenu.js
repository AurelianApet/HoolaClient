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
var GameEngine = require("GameEngine");
import * as SFS2X from "sfs2x-api";
cc.Class({
    extends: cc.Component,

    properties: {
        spr_avatar : cc.Node,
        lbl_username : cc.Label,
        lbl_gamemoney : cc.Label,
        lbl_safemoney : cc.Label,

        play_record: cc.Label,

    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.updateData();
     },

    start () {
        this.updateData();

        // 엔진 이벤트 처리부를 등록한다.
        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("getUserData", null));
        //cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("getUserData", null));
        cc.globals.engine.addEventListener(this.onGameEngineEventHandler, this);
    },

    // update (dt) {},
    
    updateData() {
        // 유저 이름을 갱신한다.
        this.lbl_username.string = cc.globals.engine.myUserData.name;
        // 아바타를 갱신한다.
        this.spr_avatar.getComponent("Avatar").setAvatar(cc.globals.engine.myUserData.avatar);

        this.lbl_gamemoney.string = Utils.numberWithCommas(cc.globals.engine.myUserData.gamemoney);
        this.lbl_safemoney.string = Utils.numberWithCommas(cc.globals.engine.myUserData.safemoney);

        var winCnt = cc.globals.engine.myUserData.winCnt;
        var loseCnt = cc.globals.engine.myUserData.loseCnt;
        // var playCnt = 10;
        // var winCnt = 8;
        this.play_record.string = winCnt + ' ' + cc.globals.engine.stringTable('unit.win') + ':' + loseCnt + ' ' + cc.globals.engine.stringTable('unit.lose');
    },

    // 게임엔진 이벤트 처리부
    onGameEngineEventHandler : function(evt) {
        switch(evt.type) {
            case GameEngine.Events.UPDATE_USERDATA:{
                
                this.updateData();
                break;
            }

            case GameEngine.Events.UPDATE_USERMONEY:{
                Logger.log2(this, "updateMoney");
                this.updateData();
                break;
            }
        }
    },
});
