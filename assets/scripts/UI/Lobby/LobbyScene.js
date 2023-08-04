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
import * as SFS2X from "sfs2x-api";

cc.Class({
    extends: cc.Component,

    properties: {
        avatar_box: cc.Node,
        chat_box: cc.Node,
        safepwd_box: cc.Node,
        charge_box: cc.Node,
        exchange_box: cc.Node,
        notice_box: cc.Node,
        setting_box: cc.Node,
        chip_box: cc.Node,
        chips:[cc.SpriteFrame],
        chip_current:2,  //  현재 중심chip
        popup_box: cc.Node,
        loading_box: cc.Node,
        chip_count: 0,
        chip_data:[],

        top_box: cc.Node,
        num_players:cc.Label,
        flow_board:cc.Label,

        prev_audio:cc.AudioSource,
        next_audio:cc.AudioSource,

        back_audio:cc.AudioSource,
    },
    ctor () {
        this.timer = 0;
         this.buf_x = 0;
         this.bChangeSetting = false;
    },
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         //this.chip_current = cc.globals.engine.prevChannel;
     },

     update (dt) {
        //배경음 설정을 변화시킨다.
        if(cc.globals.engine.bChangeSetting){
            cc.globals.engine.bChangeSetting = false;
            if(cc.globals.engine.bBackSound == 1){
                this.back_audio.play();
            }
            else{
                this.back_audio.stop();
            }
        }
        this.timer += dt;
        
        if ( this.timer >= 25.0 ) {
          this.timer = 0;
          cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("blank", null));
        }
        if(this.flow_board.string != ""){
            this.buf_x++;
            var width = this.flow_board.node.width+1000;
            var endpos = new cc.Vec2(this.flow_board.node.getPosition().x - 1, this.flow_board.node.getPosition().y);
        
            if(this.buf_x >= width){
                var endpos = new cc.Vec2(this.flow_board.node.getPosition().x +  width, this.flow_board.node.y);
                this.buf_x = 0;
            }
            this.flow_board.node.runAction(cc.moveTo(0.1, endpos).easing(cc.easeElasticOut()));
        }
        
        
        
     },

    start () {
        this.chip_count = 0;
        
        this.chip_current = cc.globals.engine.prevChannel;

        cc.globals.engine.bEnter = false;
        // 엔진 이벤트 처리부를 등록한다.
        cc.globals.engine.addEventListener(this.onGameEngineEventHandler, this);
        cc.globals.engine.gatewaySFS.addEventListener(SFS2X.SFSEvent.USER_ENTER_ROOM, this.onUserEnterRoom, this);
        cc.globals.engine.gatewaySFS.addEventListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this.onUserExitRoom, this);

        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("getChipData", null));

        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("getFlowBoard", null));
        // 게이트웨이서버와의 연결이 차단되어 있는경우 메시지출력

        this.popup_box.active = false;
        // var cnt  = parseInt(this.num_players.string) + this.getPlayerCount(cc.globals.engine.gatewaySFS.lastJoinedRoom);
        // this.num_players.string = cnt + " " +  cc.globals.engine.stringTable('unit.person');
        // cc.globals.engine.selectGame(GameEngine.Engine.GAMEID_HOOLA);
        this.chip_box.on('touchstart', this.onTouchStart, this);
        this.chip_box.on('touchend', this.onTouchEnd, this);

        //배경음을 플래이한다.
        if(cc.globals.engine.bBackSound == 1) this.back_audio.play();
    },

    onUserEnterRoom : function(evtParams){
        var room = evtParams.room;
        if(room.isGame) return;
        var cnt = parseInt(this.num_players.string) + 1; 
        this.num_players.string = cnt + " " +  cc.globals.engine.stringTable('unit.person');
    },

    onUserExitRoom : function(evtParams){
        var room = evtParams.room;
        if(room.isGame) return;
        var cnt = parseInt(this.num_players.string) - 1; 
        this.num_players.string = cnt + " " +  cc.globals.engine.stringTable('unit.person');
    },

    getPlayerCount(room){
        var userList = room.getUserList();
        var count = 0;
        for(var i= 0 ; i < userList.length ; i++){
            if(userList[i].containsVariable("bPlayer")) count++;
        }
        return count;
    },

    onTouchStart(evt) {
        Logger.log("TouchStart");
        this.touchstart_posx = evt.getLocationX();
    },

    onTouchEnd(evt) {
        Logger.log("TouchEnd");
        var endposx = evt.getLocationX();
        if(endposx - this.touchstart_posx >= 100){
            this.chip_current = (this.chip_current + this.chip_count - 1) % this.chip_count;
            this.arrangeChips();
        }
        else if(this.touchstart_posx - endposx >= 100) {
            this.chip_current = (this.chip_current + 1) % this.chip_count;
            this.arrangeChips();
        }
    },
    
    //  현재 중심 chip 번호에 준하여 chip들을 재배치한다.
    arrangeChips() {
        Logger.log("현재 칩" + this.chip_current);
        Logger.log("칩 개수" + this.chip_count);
        //  chip번호가 허용범위를 넘지 않도록 조절
        if(this.chip_current < 0)this.chip_current = 0;
        //if(this.chip_current >= this.chip_count)this.chip_current = this.chip_count - 1; 
        var start_chip = this.chip_current - 2;
        this.chip_box.active = true;
        for(var i = start_chip; i < start_chip + 5; i ++)
        {
            if(i >= 0)
                var index = i % this.chip_count;
            else{
                index = i + this.chip_count;
            }
            var item = cc.find('Chip' + (i - start_chip + 1), this.chip_box);
            var chip = cc.find('chip', item);
            var count = cc.find('count', item);
            var sp = chip.getComponent(cc.Sprite);
            sp.spriteFrame = null;
            if(index < this.chip_count && index >= 0)
            {
                sp.spriteFrame = this.chips[this.chip_data[index].get("chip_level_image")];
                count.getComponent(cc.Label).string = this.chip_data[index].get("playerCount") + " " + cc.globals.engine.stringTable('unit.person');
            }
        }
    },

    

    //  탈퇴단추를 클릭했을때
    onClickExitButton(){
        
        cc.globals.engine.quitGame();
    },

    //  아바타를 클릭했을때
    onClickAvatar() {
        this.avatar_box.active = true;
    },
    
    //  1:1문의 단추를 클릭했을때
    onClickChatButton() {
        this.chat_box.getComponent("Chat").openChatBox();
        // this.chat_box.getComponent("Chat").log.string = "";
        // this.chat_box.getComponent("Chat").msg.string = "";
        // this.chat_box.active = true;
        // //cc.globals.engine.connectToChatServer();
    },

    //  금고단추를 클릭했을때
    onClickSafeButton() {
        this.safepwd_box.active = true;
    },
    
    //  충전단추를 클릭했을때
    onClickChargeButton() {
        this.charge_box.getComponent("Charge").openChargeBox();
    },

    //  환전단추를 클릭했을때
    onClickExchangeButton() {
        this.exchange_box.getComponent("Exchange").openExchangeBox();
    },

    //  공지사항단추를 클릭했을때
    onClickNoticeButton() {

        this.notice_box.getComponent("Notice").onOpenNoticeList();
    },

    //  설정단추를 클릭했을때
    onClickSettingButton() {
        this.setting_box.active = true;
    },

    onClickNextChip() {
        if(cc.globals.engine.bEffectSound == 1) this.next_audio.play();
        this.chip_current = (this.chip_current + 1) % this.chip_count;
        this.arrangeChips();
    },

    onClickPreviousChip() {
        if(cc.globals.engine.bEffectSound == 1) this.prev_audio.play();
        this.chip_current = (this.chip_current - 1 + this.chip_count) % this.chip_count;
        this.arrangeChips();
    },

    onClickCurrentChip() {
        cc.globals.engine.prevChannel = this.chip_current;
        
        var betting = this.chip_data[this.chip_current].get("chip_level");
        var min_money = parseInt(this.chip_data[this.chip_current].get("min_money"));
        if(cc.globals.engine.myUserData.gamemoney < min_money){
            this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.enterroom_money_lack'));
            return;
        }
        //this.loading_box.getComponent("Loading").playLoading();
        cc.globals.engine.enterRoom(this.chip_data[this.chip_current]);
        //cc.director.loadScene('gameroom');
    },
   
    
    onUpdateChannelData(data){
        Logger.log(data.get("chip_level_image"));
        this.chip_data[this.chip_count] = data;
        this.chip_count ++;
        this.arrangeChips();
        var cnt = this.getPlayerCount(cc.globals.engine.gatewaySFS.lastJoinedRoom) + data.get("totalPlayers");
        
        this.num_players.string = cnt + " " +  cc.globals.engine.stringTable('unit.person');
    },
    onUpdateChannelPlayers(data){

        Logger.log("User num change");
        for(var i = 0; i < this.chip_count; i ++) {
            Logger.log(this.chip_data[i].get("name")+"------" + data.get("name") );
            if(this.chip_data[i].get("name") == data.get("name")) {
                this.chip_data[i].putInt("playerCount", data.get("playerCount"));
                break;
            }
            
        }
        //this.num_players.string = "" + data.get("totalPlayers") + " " + cc.globals.engine.stringTable('unit.person');
        this.arrangeChips();
    },

    // 게임엔진 이벤트 처리부
    onGameEngineEventHandler (evt) {
        
        switch(evt.type) {
            case GameEngine.Events.UPDATE_CHANNELDATA:{
                Logger.log("게임엔진 이벤트: 침다타" );
                this.onUpdateChannelData(evt.data);
                break;
            }

            case GameEngine.Events.UPDATE_CHANNEL_PLAYERS:{
                Logger.log("게임엔진 이벤트: player" );
                this.onUpdateChannelPlayers(evt.data);
                break;
            }
            
            case GameEngine.Events.DISCONNECTED:{
                Logger.log("connection lost..");
                this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.disconnected_to_server'));
                break;
            }
            case GameEngine.Events.CHAT_DISCONNECTED: {
                //if(cc.GameEngine.isOnChatServer == true)
                if(this.chat_box.active == true)
                    this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.chat_admin_leave'));
                this.GameEngine.isOnChatServer = false;
                this.chat_box.active = false;
                break;
            }
            case GameEngine.Events.ROOMENTER_SUCCESSED:{
                //  훌라 게임장에 입장한다.
                cc.director.loadScene('gameroom');
                break;
            }
            case GameEngine.Events.ROOMENTER_FAILED:{
                // 방입장 실패
                this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.failed_to_enter_room'));
                break;
            }
            case GameEngine.Events.FLOW_NOTICE:{
                // 긴급공지
                //this.flow_board.string = "";
                this.flow_board.string = evt.data.get("quicknotice");
                cc.log(this.flow_board.string);
                break;
            }

            case GameEngine.Events.EXCHANGE_SAFEMONEY:{
                Logger.log("머니 변화");
                var result = evt.data.get("result");
                if(result == 3){
                    var top = this.top_box.getComponent("TopMenu");
                    top.lbl_gamemoney.string = Utils.numberWithCommas(evt.data.get("gamemoney"));
                    top.lbl_safemoney.string = Utils.numberWithCommas(evt.data.get("savemoney"));
                    var userVars = [];
                    userVars.push(new SFS2X.SFSUserVariable("savemoney", evt.data.get("savemoney")));
                    userVars.push(new SFS2X.SFSUserVariable("gamemoney", evt.data.get("gamemoney")));
                    cc.globals.engine.gatewaySFS.send(new SFS2X.SetUserVariablesRequest(userVars));
                }
                break;
            }

            case GameEngine.Events.CHARGE_RESULT:{
                var msgbox = this.popup_box.getComponent("Popup");
                var msg = "";
                if(evt.result.get("status") == 1){    //  충전성공
                    msg = /*"충전금액 " + */Utils.numberWithCommas(parseInt(evt.result.get("money"))) + " " + cc.globals.engine.stringTable('msg.charge_request_allow');
                    cc.globals.engine.myUserData.gamemoney += evt.result.get("money");
                    var top = this.top_box.getComponent("TopMenu");
                    top.lbl_gamemoney.string = Utils.numberWithCommas(cc.globals.engine.myUserData.gamemoney);
                    var userVars = [];
                    userVars.push(new SFS2X.SFSUserVariable("gamemoney", cc.globals.engine.myUserData.gamemoney));
                    cc.globals.engine.gatewaySFS.send(new SFS2X.SetUserVariablesRequest(userVars));
                }
                
                else if(evt.result.get("status") == 2)    //  충전 취소
                    msg = /*"충전금액 " + */Utils.numberWithCommas(parseInt(evt.result.get("money"))) + " " + cc.globals.engine.stringTable('msg.charge_request_cancel');
                else if(evt.result.get("status") == 3){
                    msg = /*"충전금액 " + */Utils.numberWithCommas(parseInt(evt.result.get("money"))) + " " + cc.globals.engine.stringTable('msg.charge_request_allow');
                }
                // else if(evt.data.result == 3)    //  유저가 취소
                //     msg = cc.globals.engine.stringTable('msg.charge_user_cancel');
                msgbox.showMessage(msg);
                
                break;
            }
            case GameEngine.Events.DISCHARGE_RESULT:{
                var msgbox = this.popup_box.getComponent("Popup");
                var msg = "";
                if(evt.result.get("status") == 1){ //  성공
                    if(evt.result.get("bPartner") == 1){
                        cc.globals.engine.myUserData.gamemoney -= evt.result.get("money");
                        
                        var top = this.top_box.getComponent("TopMenu");
                        top.lbl_gamemoney.string = Utils.numberWithCommas(cc.globals.engine.myUserData.gamemoney);
                        
                        var userVars = [];
                        userVars.push(new SFS2X.SFSUserVariable("gamemoney", cc.globals.engine.myUserData.gamemoney));
                        cc.globals.engine.gatewaySFS.send(new SFS2X.SetUserVariablesRequest(userVars));
                    }
                    msg = /*"환전금액 " + */Utils.numberWithCommas(parseInt(evt.result.get("money"))) + " " + cc.globals.engine.stringTable('msg.discharge_request_allow');
                }   
                 //  실패(호출파라메터 오유) 
                else if(evt.result.get("status") == 2){
                    cc.globals.engine.myUserData.gamemoney += evt.result.get("money");
                    var top = this.top_box.getComponent("TopMenu");
                    top.lbl_gamemoney.string = Utils.numberWithCommas(cc.globals.engine.myUserData.gamemoney);

                    var userVars = [];
                    userVars.push(new SFS2X.SFSUserVariable("gamemoney", cc.globals.engine.myUserData.gamemoney));
                    cc.globals.engine.gatewaySFS.send(new SFS2X.SetUserVariablesRequest(userVars));

                    msg = /*"환전금액 " + */Utils.numberWithCommas(parseInt(evt.result.get("money"))) + " " + cc.globals.engine.stringTable('msg.discharge_request_cancel');
                }   
                else if(evt.result.get("status") == 3){
                    msg = /*"환전금액 " + */Utils.numberWithCommas(parseInt(evt.result.get("money"))) + " " + cc.globals.engine.stringTable('msg.discharge_request_allow');
                }    

                msgbox.showMessage(msg);
                
                break;
            }
            case GameEngine.Events.DISCHARGE_MONEY:{
                var result = evt.data.get("result");
                if(result == 1){
                    cc.globals.engine.myUserData.gamemoney -= evt.data.get("money");

                    var top = this.top_box.getComponent("TopMenu");
                    top.lbl_gamemoney.string = Utils.numberWithCommas(cc.globals.engine.myUserData.gamemoney);

                    var userVars = [];
                    userVars.push(new SFS2X.SFSUserVariable("gamemoney", cc.globals.engine.myUserData.gamemoney));
                    cc.globals.engine.gatewaySFS.send(new SFS2X.SetUserVariablesRequest(userVars));
                    
                }
                break;
            }

        }
    },
});
