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
var GatewaySocket = require("GatewaySocket");
var HoolaSocket = require("HoolaSocket");
var ChatSocket = require("ChatSocket");
var GameSocket = require("GameSocket");
var HoolaRoom = require("HoolaRoom");
var UserData = require("UserData");

import * as SFS2X from "sfs2x-api";

const i18n = require('LanguageData');

var GameEngineEvents = cc.Enum({
    UPDATE_CHANNELDATA : 'GameEngineEvents.UPDATE_CHANNELDATA',
    UPDATE_USERDATA : 'GameEngineEvents.UPDATE_USERDATA',
    UPDATE_USERMONEY : 'GameEngineEvents.UPDATE_USERMONEY',
    LOAD_NOTICE : 'GameEngineEvents.LOAD_NOTICE',
    UPDATE_CHANNEL_PLAYERS : 'GameEngineEvents.UPDATE_CHANNEL_PLAYERS',
    ENTER_SAFE: 'GameEngineEvents.ENTER_SAFE',
    CHANGE_SAFEPWD: 'GameEngineEvents.CHANGE_SAFEPWD',
    EXCHANGE_SAFEMONEY: 'GameEngineEvents.EXCHANGE_SAFEMONEY',
    CHARGE_MONEY: 'GameEngineEvents.CHARGE_MONEY',
    DISCHARGE_MONEY: 'GameEngineEvents.DISCHARGE_MONEY',
    MEMBER_REGISTER: 'GameEngineEvents.MEMBER_REGISTER',
    CHARGE_BANKINFO: 'GameEngineEvents.CHARGE_BANKINFO',
    DISCHARGE_BANKINFO: 'GameEngineEvents.DISCHARGE_BANKINFO',
    CHARGE_RESULT: 'GameEngineEvents.CHARGE_RESULT',
    DISCHARGE_RESULT: 'GameEngineEvents.DISCHARGE_RESULT',
    FLOW_NOTICE : 'GameEngineEvents.FLOW_NOTICE',

    LOGIN_SUCCESSED : 'GameEngineEvents.LOGIN_SUCCESSED',
    LOGIN_FAILED : 'GameEngineEvents.LOGIN_FAILED',    
    DISCONNECTED : 'GameEngineEvents.DISCONNECTED',

    ROOMENTER_SUCCESSED : 'GameEngineEvents.ROOMENTER_SUCCESSED',
    ROOMENTER_FAILED : 'GameEngineEvents.ROOMENTER_FAILED',

    CHAT:'GameEngineEvents.CHAT',
    CHAT_UPDATED:'GameEngineEvents.CHAT_UPDATED',
    CHAT_DISCONNECTED: 'GameEngineEvent.CHAT_DISCONNECTED',
});

var GameEngine = cc.Class({
    extends: cc.Component,

    statics: {
        // 게임아이디
        GAMEID_HOOLA : "hoola",
    },

    properties: {
        ccGatewaySocket : null,
        lang :'mn',
        stringTable:null,
        isOnLogin:false,
        ccGameSocket : null,
        ccChatSocket : null,
    },

    // 생성자
    ctor () {
        Logger.log("Start............");
        this.myUserData = new UserData();

        this.currentGameId = "";
        this.currentGameServerIp = "";
        this.currentGameServerPort = 0;
        this.currentGameSessionId = "";
        this.chatServerIp = "";
        this.chatServerPort = 0;

        this.ccGatewaySocket = null;
        this.ccGameSocket = null;
        this.ccChatSocket = null;
        this.gatewaySFS = null;
        this.gameIP = "127.0.0.1";
        this.gamPort = 8080;
        this.gatewayIP = "127.0.0.1";
        this.gatewayPort = 8080;
        this.isByExitButton = false;
        this.prevChannel = 2;
        this.version = "1.0.3";
        this.bEnter = false;
        this.bLoginClicked = false;

        this.bEffectSound = 1;
        this.bBackSound = 1;
        this.bVoice = 1;
        this.bChangeSetting = false;
        this.clickFlag = true ;
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },
    init () {
       
        Logger.log2(this, '게임 엔진을 초기화합니다.');

        if(this.node == null)
            this.node = new cc.Node();

        this.lang = 'ko';
        i18n.init(this.lang);

        this.stringTable = i18n.t;

        // 설정파일정보를 읽어온다.
        cc.loader.loadRes("jsons/config", function(err, res) {
            if(err) {
                Logger.log2(this, '설정정보를 읽어들일수 없습니다. Error:' + err.message);
                return;
            }

            Logger.log2(this, '게이트웨이 접속 주소 : ' + res.json.gatewayIP);
            Logger.log2(this, '게이트웨이 접속 포트 : ' + res.json.gatewayPort);
            // 게이트웨이 소켓을 생성한다.
            this.gatewayIP = res.json.gatewayIP;
            this.gatewayPort = res.json.gatewayPort;
            this.gameIP = res.json.gameIP;
            this.gamePort = res.json.gamePort;
            this.version = res.json.version;
        }.bind(this));
    },

    addEventListener (callback, target) {
        this.node.on(GameEngineEvents.UPDATE_CHANNELDATA, callback, target);
        this.node.on(GameEngineEvents.UPDATE_USERMONEY, callback, target);
        this.node.on(GameEngineEvents.UPDATE_USERDATA, callback, target);
        this.node.on(GameEngineEvents.LOAD_NOTICE, callback, target);
        this.node.on(GameEngineEvents.ENTER_SAFE, callback, target);
        this.node.on(GameEngineEvents.CHANGE_SAFEPWD, callback, target);
        this.node.on(GameEngineEvents.EXCHANGE_SAFEMONEY, callback, target);
        this.node.on(GameEngineEvents.CHARGE_MONEY, callback, target);
        this.node.on(GameEngineEvents.FLOW_NOTICE, callback, target);
        this.node.on(GameEngineEvents.DISCHARGE_MONEY, callback, target);
        this.node.on(GameEngineEvents.MEMBER_REGISTER, callback, target);
        this.node.on(GameEngineEvents.CHARGE_BANKINFO, callback, target);
        this.node.on(GameEngineEvents.DISCHARGE_BANKINFO, callback, target);
        this.node.on(GameEngineEvents.UPDATE_CHANNEL_PLAYERS, callback, target);
        this.node.on(GameEngineEvents.LOGIN_SUCCESSED, callback, target);
        this.node.on(GameEngineEvents.LOGIN_FAILED, callback, target);
        this.node.on(GameEngineEvents.DISCONNECTED, callback, target);
        this.node.on(GameEngineEvents.ROOMENTER_FAILED, callback, target);
        this.node.on(GameEngineEvents.ROOMENTER_SUCCESSED, callback, target);
        
        this.node.on(GameEngineEvents.CHARGE_RESULT, callback, target);
        this.node.on(GameEngineEvents.DISCHARGE_RESULT, callback, target);

        this.node.on(GameEngineEvents.CHAT, callback, target);
        this.node.on(GameEngineEvents.CHAT_UPDATED, callback, target);
        this.node.on(GameEngineEvents.CHAT_DISCONNECTED, callback, target);
    },

    removeEventListener (callback, target) {
        this.node.off(GameEngineEvents.UPDATE_CHANNELDATA, callback, target);
        this.node.off(GameEngineEvents.UPDATE_USERMONEY, callback, target);
        this.node.off(GameEngineEvents.UPDATE_USERDATA, callback, target);
        this.node.off(GameEngineEvents.LOAD_NOTICE, callback, target);
        this.node.off(GameEngineEvents.ENTER_SAFE, callback, target);
        this.node.off(GameEngineEvents.CHANGE_SAFEPWD, callback, target);
        this.node.off(GameEngineEvents.EXCHANGE_SAFEMONEY, callback, target);
        this.node.off(GameEngineEvents.FLOW_NOTICE, callback, target);
        this.node.off(GameEngineEvents.CHARGE_MONEY, callback, target);
        this.node.off(GameEngineEvents.DISCHARGE_MONEY, callback, target);
        this.node.off(GameEngineEvents.MEMBER_REGISTER, callback, target);
        this.node.off(GameEngineEvents.CHARGE_BANKINFO, callback, target);
        this.node.off(GameEngineEvents.DISCHARGE_BANKINFO, callback, target);
        this.node.off(GameEngineEvents.UPDATE_CHANNEL_PLAYERS, callback, target);
        this.node.off(GameEngineEvents.LOGIN_SUCCESSED, callback, target);
        this.node.off(GameEngineEvents.LOGIN_FAILED, callback, target);
        this.node.off(GameEngineEvents.DISCONNECTED, callback, target);
        this.node.off(GameEngineEvents.ROOMENTER_FAILED, callback, target);
        this.node.off(GameEngineEvents.ROOMENTER_SUCCESSED, callback, target);

        this.node.off(GameEngineEvents.CHARGE_RESULT, callback, target);
        this.node.off(GameEngineEvents.DISCHARGE_RESULT, callback, target);

        this.node.off(GameEngineEvents.CHAT, callback, target);
        this.node.off(GameEngineEvents.CHAT_UPDATED, callback, target);
        this.node.off(GameEngineEvents.CHAT_DISCONNECTED, callback, target);
    },

    onGatewayResponse : function(evt){
        var params = evt.params;
        var res = evt.params;
        switch(evt.cmd){
            case "getUserData":
            {
                Logger.log("유저 다타 얻기");
                cc.globals.engine.myUserData.id = params.get("uid");
                cc.globals.engine.myUserData.partner = params.get("partner");
                cc.globals.engine.myUserData.name = params.get("loginid");
                cc.globals.engine.myUserData.gamemoney = params.get("gamemoney");
                cc.globals.engine.myUserData.safemoney = params.get("savemoney");
                cc.globals.engine.myUserData.avatar = params.get("avatar");
                cc.globals.engine.myUserData.winCnt = params.get("winCnt");
                cc.globals.engine.myUserData.loseCnt = params.get("loseCnt");
                cc.globals.engine.myUserData.percent = params.getDouble("percent");
                cc.globals.engine.node.emit(GameEngineEvents.UPDATE_USERDATA, {type:GameEngineEvents.UPDATE_USERDATA});
                break;
            }
            case "loadNotice":
            {
                Logger.log("공지 사항 얻기");
                
                cc.globals.engine.node.emit(GameEngineEvents.LOAD_NOTICE, {type:GameEngineEvents.LOAD_NOTICE, data:params});
                break;
            }
            case "flowBoard":
            {
                Logger.log("흐름 공지 사항 얻기");
                
                cc.globals.engine.node.emit(GameEngineEvents.FLOW_NOTICE, {type:GameEngineEvents.FLOW_NOTICE, data:params});
                break;
            }
            case "chargeBankData":
            {
                Logger.log("차지 뱅크 얻기");
                
                cc.globals.engine.node.emit(GameEngineEvents.CHARGE_BANKINFO, {type:GameEngineEvents.CHARGE_BANKINFO, data:params});
                break;
            }
            case "dischargeBankData":
            {
                Logger.log("환전 뱅크 얻기");
                
                cc.globals.engine.node.emit(GameEngineEvents.DISCHARGE_BANKINFO, {type:GameEngineEvents.DISCHARGE_BANKINFO, data:params});
                break;
            }
            case "chargeMoney":
            {
                Logger.log("차지 머니");
                
                cc.globals.engine.node.emit(GameEngineEvents.CHARGE_MONEY, {type:GameEngineEvents.CHARGE_MONEY, data:params});
                break;
            }
            case "dischargeMoney":
            {
                Logger.log("환전 머니");
                
                cc.globals.engine.node.emit(GameEngineEvents.DISCHARGE_MONEY, {type:GameEngineEvents.DISCHARGE_MONEY, data:params});
                break;
            }
            case "chatMessage":
            {
                Logger.log("차트 메시지");
                
                cc.globals.engine.node.emit(GameEngineEvents.CHAT, {type:GameEngineEvents.CHAT, data:params});
                break;
            }
            case "chatReplyMessage":
            {
                Logger.log("상담회원 응답");
                
                cc.globals.engine.node.emit(GameEngineEvents.CHAT_UPDATED, {type:GameEngineEvents.CHAT_UPDATED, data:params});
                break;
            }
            case "enterSafe":
            {
                Logger.log("Enter Safe ");
                
                cc.globals.engine.node.emit(GameEngineEvents.ENTER_SAFE, {type:GameEngineEvents.ENTER_SAFE, data:params});
                break;
            }
            case "exchangeSafe":
            {
                Logger.log("Exchange Safe ");
                
                cc.globals.engine.node.emit(GameEngineEvents.EXCHANGE_SAFEMONEY, {type:GameEngineEvents.EXCHANGE_SAFEMONEY, data:params});
                break;
            }
            case "changeSafePwd":
            {
                Logger.log("금고 암호 바꾸기.... ");
                
                cc.globals.engine.node.emit(GameEngineEvents.CHANGE_SAFEPWD, {type:GameEngineEvents.CHANGE_SAFEPWD, data:params});
                break;
            }
            case "memberRegister":
            {
                Logger.log("회원 가입.... ");
                
                cc.globals.engine.node.emit(GameEngineEvents.MEMBER_REGISTER, {type:GameEngineEvents.MEMBER_REGISTER, result:params})    
                break;
            }
            case "acceptChargeMoney":
            {
                Logger.log("충전 요청 결과.... ");
                
                cc.globals.engine.node.emit(GameEngineEvents.CHARGE_RESULT, {type:GameEngineEvents.CHARGE_RESULT, result:params})    
                break;
            }
            case "acceptDischargeMoney":
            {
                Logger.log("환전 요청 결과.... ");
                
                cc.globals.engine.node.emit(GameEngineEvents.DISCHARGE_RESULT, {type:GameEngineEvents.DISCHARGE_RESULT, result:params})    
                break;
            }
            case "getChipData" : {
                Logger.log("칩다타");
                cc.globals.engine.node.emit(GameEngineEvents.UPDATE_CHANNELDATA, {type:GameEngineEvents.UPDATE_CHANNELDATA, data:res});
                break;
            }

            case "userJoinRoom":{
                Logger.log("RoomJoin success");
                cc.globals.engine.node.emit(GameEngineEvents.UPDATE_CHANNEL_PLAYERS, {type:GameEngineEvents.UPDATE_CHANNEL_PLAYERS,data:res});
                break;
            }
            case "userLeaveRoom":{
                Logger.log("LeaveRoom success");
                cc.globals.engine.node.emit(GameEngineEvents.UPDATE_CHANNEL_PLAYERS, {type:GameEngineEvents.UPDATE_CHANNEL_PLAYERS,data:res});
                break;
            }
            case "errorRoomEnter" : {
                Logger.log("방입장 오유");
                cc.globals.engine.node.emit(GameEngineEvents.ROOMENTER_FAILED, {type:GameEngineEvents.ROOMENTER_FAILED});
                break;
            }
            case "GAME_START" : {
                Logger.log("게임을 시작합니다.");
                cc.globals.engine.gameRoom.startGame(res.getSFSArray("seats"), res.get("boss"));
                break;
            }
            case "DEALING_CARD" : {
                cc.globals.engine.gameRoom.setDealerCards(res.getSFSArray("cards"));
                break;
            }
            case "REGISTER_TURN": {
                Logger.log2("카드낼 차례 : " + res.get("seat"));
                cc.globals.engine.gameRoom.updateRegisterTurn(res.get("seat"), res.get("timeout"), res.get("bundleinfo"));
                break;
            }

            case "ROOM_RESET" : {
                Logger.log("방초기화");
                cc.globals.engine.gameRoom.resetGame();
                break;
            }

            case "PLAYER_DATA" : {
                cc.globals.engine.gameRoom.setPlayerSeat(res.get("seat"), res.get("name"), res.get("avatar"), res.get("money"));                    
                break;
            }
            case "LEAVE_PLAYER_DATA" : {
                Logger.log("방에서 나간 플래이어의 자리정보를 지운다.")
                cc.globals.engine.gameRoom.removePlayerSeat(res.get("seat"));                    
                break;
            }

            case "ROOM_OUT" : {                
                Logger.log("방나가기");
                cc.director.loadScene("lobby");
                
                break;
            }

            case "ROOM_MOVE" : {                
                cc.globals.engine.gameRoom.playerRoomMove(evt.data.seatno, evt.data.flag);
                break;
            }

            case "EMOTION_SOUND" : {
                cc.globals.engine.gameRoom.playEmotionSound(evt.data.avatar, evt.data.number);
                break;
            }
            case "stopAction" :{
                
                break;
            }
            

            case "REGISTER_CARDS" : {
                cc.globals.engine.gameRoom.clickFlag = true ;
                var result = res.get("result");
                if(result == 0) {
                    Logger.log('카드등록실패 - 카드가 우세하지 못함');
                }
                else if(result == 2) {
                    Logger.log("카드등록실패 - 카드가 동일함");
                }
                else if(result == 3) {
                    Logger.log("카드등록실패 - 잘못된 카드묶음");
                }
                else {   //  카드등록 성공
                    Logger.log("카드등록성공");
                    cc.globals.engine.gameRoom.setRegisterCards(res.get("seatno"), res.get("cards"), res.get("bundleString"), res.get("soundString"));       
                }
                break;
            }
            case "UPDATE_TURN" : {
                Logger.log("턴을 업데이트 한다.");
                var joinroom = cc.globals.engine.gatewaySFS.lastJoinedRoom ;
                cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("betAllow", null,joinroom));
                break;
            }
            case "UPDATE_CARDS" : {
                Logger.log("카드정보갱신");

                cc.globals.engine.gameRoom.updatePlayerCards(res.get("seats"),res.get("counts"), res.get("cards"));
                break;
            }

            

            case "ROUND_NOTIFY" : {
                this.gameRoom.setRound(evt.data.round);
                break;
            }

            case "GAME_RESULT" : {
                //Logger.log2(this, "게임이 종료되여 결과표시");
                Logger.log("게임결과 표시");

                cc.globals.engine.gameRoom.setGameResult(res.get("players"), res.get("seats"), res.get("winmoney"), res.get("gamemoney"), res.get("iswinner"));
                break;
            }
            case "UPDATE_MONEY" : {
                Logger.log("업데이트 유저 머니");
                var param = new SFS2X.SFSObject();
                param.putInt("money", res.get("money"));
                cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("updateMoney", param));
                
                break;
            }
            
            case "BET_HISTORY" : {
                Logger.log("베팅이력");
                var joinroom = cc.globals.engine.gatewaySFS.lastJoinedRoom ;
                cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("betHistory", res,joinroom));
                
                break;
            }
            case "jongSan" : {
                Logger.log("정산");
                
                cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("jongSan", res));
                
                break;
            }
            case "endReady":{
                //방에 준비상태를 해제한다
                Logger.log("준비상태를 해제한다.")
                var room = cc.globals.engine.gatewaySFS.lastJoinedRoom;
                var roomVars = [];
                roomVars.push(new SFS2X.SFSRoomVariable("isReady", false));
                cc.globals.engine.gatewaySFS.send(new SFS2X.SetRoomVariablesRequest(roomVars, room));
                break;
            }
        }

    },

   

    // 게임을 선택한다.
    selectGame(gameid) {
        Logger.log2(this, '게임선택:' + gameid);
        this.currentGameId = gameid;
        // 게임선택 요청(방목록요청)
        
        //this.ccGatewaySocket.doSelectGame(gameid);
    },
    changeAvatar(avatar) {
        Logger.log2(this, "아바타변경요청: " + avatar);
        var params = new SFS2X.SFSObject();
        params.putInt("avatar", avatar);
        params.putInt("type", 1);
        this.gatewaySFS.send(new SFS2X.ExtensionRequest("updateUserData", params));

        //클라에서 아바타 변경
        this.myUserData.avatar = avatar;
        this.node.emit(GameEngineEvents.UPDATE_USERDATA, {type:GameEngineEvents.UPDATE_USERDATA});

    },
    enterSafe(password) {
        Logger.log2(this, "금고열기요청: 비번 - " + password);
        var params = new SFS2X.SFSObject();
        params.putUtfString("password", password);
        
        this.gatewaySFS.send(new SFS2X.ExtensionRequest("enterSafe", params));
        //this.ccGatewaySocket.doEnterSafe(password);
    },
    changeSafePwd(pwd) {
        Logger.log2(this, "금고비밀번호 수정: 비번 - " + pwd);
        var params = new SFS2X.SFSObject();
        params.putUtfString("password", pwd);
        this.gatewaySFS.send(new SFS2X.ExtensionRequest("changeSafePwd", params));
        
    },

    loadNotice() {
        Logger.log2(this, "공지목록읽기");
        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("loadNotice", null));
        //this.ccGatewaySocket.doLoadNotice();
    },
    exchangeSafeMoney(money, flag){
        Logger.log2(this, "금고머니조작: flag-" + flag);
        // flag: 1-보관, 2-전환
        var params = new SFS2X.SFSObject();
        params.putInt("flag", flag);
        params.putInt("money", money)
        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("exchangeSafeMoney", params));
        //this.ccGatewaySocket.doExchangeSafeMoney(money, flag);
    },
    chargeMoney(data) {
        Logger.log2(this, "머니충전");
        var param = new SFS2X.SFSObject();
        param.putUtfString("account", data.account);
        param.putUtfString("name", data.name);
        param.putInt("money", data.money);
        param.putUtfString("tel", data.tel);
        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("chargeMoney", param));
        //this.ccGatewaySocket.doChargeMoney(data);
    },
    dischargeMoney(data) {
        Logger.log2(this, "머니환전");
        var param = new SFS2X.SFSObject();
        param.putUtfString("account", data.account);
        param.putUtfString("name", data.name);
        param.putInt("money", data.money);
        param.putUtfString("tel", data.tel);
       
        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("dischargeMoney", param));
        //this.ccGatewaySocket.doDischargeMoney(data);
    },
    requireChargeBankInfo() {
        Logger.log2(this, "충전뱅크정보 요청");
        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("chargeBankData", null));
        //this.ccGatewaySocket.doChargeBankInfo();
    },
    requireDischargeBankInfo() {
        Logger.log2(this, "환전뱅크정보 요청");
        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("dischargeBankData", null));
    },
    
    quitGame() {
        // // 로그인화면으로 넘어간다.
        cc.globals.engine.gatewaySFS.send(new SFS2X.LogoutRequest());
        cc.director.loadScene('login');
    },



    //  카드딜링액션이 완료되여 카드등록기다림상태로 이행가능
    readyForRegister() {
        Logger.log2(this, '카드딜링액션이 완료, 카드등록기다림상태로 이행');
        //cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("registerReady", null));
        //this.ccGameSocket.doRegisterReady();
    },

    registerCards(cards) {
        Logger.log2(this, "카드등록");
        var param = new SFS2X.SFSObject();
        param.putIntArray("cards", cards);
        var joinroom = cc.globals.engine.gatewaySFS.lastJoinedRoom ;
        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("registerCards", param,joinroom));
       
    },

    passCard() {
        Logger.log2(this, "패스");
        var joinroom = cc.globals.engine.gatewaySFS.lastJoinedRoom ;
        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("passCards", null,joinroom));
    },

    playEmotionSound(avatar, number) {
        Logger.log2(this, "감정보이스 플레이 : ", number);
        cc.globals.engine.ccGameSocket.doPlayEmotionSound(avatar, number);
    },

    reserveMoveroom() {
        var joinroom = cc.globals.engine.gatewaySFS.lastJoinedRoom ;
        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("moveRoom", null,joinroom));

        
        //this.ccGameSocket.doRoomMove();
    },

    cancelMoveroom() {
        // 플래이어 파라메터 업데이트
        var userVars = [];
        userVars.push(new SFS2X.SFSUserVariable("bMoveRoomReserved", false));
        cc.globals.engine.gatewaySFS.send(new SFS2X.SetUserVariablesRequest(userVars));
        //this.ccGameSocket.doRoomMove();
    },

    reserveOut() {
        var joinroom = cc.globals.engine.gatewaySFS.lastJoinedRoom ;
        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("preLeaveRoom", null,joinroom));
        // cc.globals.engine.gatewaySFS.send(new SFS2X.LeaveRoomRequest());
        // cc.globals.engine.gatewaySFS.send(new SFS2X.JoinRoomRequest("HoolaGame Room"));
        // cc.director.loadScene('lobby');
        //this.ccGameSocket.doRoomOut();
    },

    cancelOut() {
        var userVars = [];
        userVars.push(new SFS2X.SFSUserVariable("bOutReserved", false));
        cc.globals.engine.gatewaySFS.send(new SFS2X.SetUserVariablesRequest(userVars));
    },

    quitHoolaGame() {
        if(this.ccGameSocket != null)
            this.ccGameSocket.close();
    },

  

    // 방에 입장한다.
    enterRoom(data) {
        if(this.bEnter == true) return;
        var self = this;
        Logger.log2(this, '방입장 요청 - 베팅값:' + Utils.numberWithCommas(data.get("chip_level")));

        ///remove Event Listener
        this.gatewaySFS.removeEventListener(SFS2X.SFSEvent.ROOM_JOIN, this.onHoolaRoomJoined); 
        this.gatewaySFS.removeEventListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this.onUserExitRoom); 
        this.gatewaySFS.removeEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this.onHoolaRoomJoinError);
        
        ///add Event Listener
        this.gatewaySFS.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, this.onHoolaRoomJoined, this);
        this.gatewaySFS.addEventListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this.onUserExitRoom, this);
        this.gatewaySFS.addEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this.onHoolaRoomJoinError, this);
        this.gatewaySFS.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, this.onConnectionLost, this);
      
        var param = new SFS2X.SFSObject();
        
        param.putInt("betting", data.get("chip_level"));
        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("doCreateRoom", param));
      
        
        
    },
    onConnectionLost :function(event){
        var reason = event.reason;
        if (reason == SFS2X.ClientDisconnectionReason.KICK){
            Logger.log("강퇴");
            cc.director.loadScene("login");
        }
        // if (reason == SFS2X.ClientDisconnectionReason.BAN){
        //     cc.globals.engine.node.emit(GameEngineEvents.DISCONNECTED, {type:GameEngineEvents.DISCONNECTED});
        // }
        if (reason != SFS2X.ClientDisconnectionReason.MANUAL){
            cc.globals.engine.node.emit(GameEngineEvents.DISCONNECTED, {type:GameEngineEvents.DISCONNECTED});
            if (reason == SFS2X.ClientDisconnectionReason.IDLE)
                cc.log("A disconnection occurred due to inactivity");
            else if (reason == SFS2X.ClientDisconnectionReason.KICK)
                cc.log("You have been kicked by the moderator");
            else if (reason == SFS2X.ClientDisconnectionReason.BAN)
                cc.log("You have been banned by the moderator");
            else
                cc.log("A disconnection occurred due to unknown reason; please check the server log");
	    }
    },
    onHoolaRoomJoined : function (event){
        Logger.log(event.room.name + "-> 방에 입장 성공");
        ///게임 화면으로..
    
        if(event.room.name != "HoolaGame Room")
            cc.director.loadScene("gameroom");
        if(!event.room.isGame) return;
        
        this.bEnter = true;
        // if(event.room.name != "HoolaRoom")
        // cc.globals.engine.node.emit(GameEngineEvents.ROOMENTER_SUCCESSED, {type:GameEngineEvents.ROOMENTER_SUCCESSED});
        this.gameRoom = new HoolaRoom.Room();
        this.gameRoom.betting = event.room.getVariable("betting").value;
        var playerList = this.gatewaySFS.lastJoinedRoom.getUserList();
        var seatno = [];
        var index = 0; 
        for(var i = 0 ; i < 4; i++) seatno[i] = -1;
        for(var i = 0; i < playerList.length ;i++){
            if(playerList[i].name == this.gatewaySFS.mySelf.name) continue;
             var seatVar = playerList[i].getVariable("seat");
             if(seatVar == null) continue;
             seatno[index] = seatVar.value;
             index++;
            //  if(seatVar != 0)
            //  palyerList[1].getVariable("isboss") = false; 
        }
        for(var i = 0 ; i < 4; i++){
            var bExist = false;
            for(var j = 0 ; j < seatno.length ; j++){
                if(seatno[j] == i) {
                    bExist = true;
                    break;
                }
            }
            if(!bExist) {
                this.gameRoom.iMySeatNo = i;
                break;
            }
        }

        
        Logger.log("입장한 방 자리번호:" + this.gameRoom.iMySeatNo);

       

        // 플래이어 파라메터 업데이트
        var userVars = [];
        userVars.push(new SFS2X.SFSUserVariable("bPlayer", false));
        userVars.push(new SFS2X.SFSUserVariable("seat", this.gameRoom.iMySeatNo));
        
        cc.globals.engine.gatewaySFS.send(new SFS2X.SetUserVariablesRequest(userVars));
        var joinroom = cc.globals.engine.gatewaySFS.lastJoinedRoom ;
        var param = new SFS2X.SFSObject();
        param.putInt("seat", this.gameRoom.iMySeatNo);
        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("sendSeat", param,joinroom));  
        
    },
    onHoolaRoomJoinError : function (event){
        Logger.log("흘라 방 입장 오유:" + event.errorCode);        
        this.node.emit(GameEngineEvents.ROOMENTER_FAILED, {type:GameEngineEvents.ROOMENTER_FAILED});
    },
    onUserExitRoom : function(evt){

    },
    

    //  상담서버에 소켓연결한다.
    connectToChatServer() {
        /*var self = this;
        this.ccChatSocket = new ChatSocket.Socket();
        this.ccChatSocket.init("ws://" + this.chatServerIp + ":" + this.chatServerPort + "/chat");
        this.ccChatSocket.addEventListener(this.onChatServerEventHandler, this);
        this.ccChatSocket.connect(function(){
            Logger.log2(self, '상담 서버에 접속되었습니다.');
            self.isOnChatServer = true;
            self.ccChatSocket.doLogin(self.myUserData.name);
        }, function(){
            Logger.log2(self, '상담 서버에 접속할수 없습니다.');
            self.isOnChatServer = false;
        });*/

        this.sendChat('#ChatLogin#');
    },

    closeChatConnection() {
        /*if(this.isOnChatServer != true)
            return;
        this.ccChatSocket.close();
        this.isOnChatServer = false;*/
        this.sendChat('#ChatLogout#');
    },

    sendChat(text) {
        Logger.log("차트:" + text);
        var param = new SFS2X.SFSObject();
        param.putUtfString("msg", text);
        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("chat", param));
        //this.ccGatewaySocket.sendChat(text);
        //this.ccChatSocket.sendChat(text);
    },
    onChatServerEventHandler (evt) {
        if(evt.type == GameSocket.Events.DISCONNECTED) {
            Logger.log2(this, '상담서버 접속이 차단');
            this.node.emit(GameEngineEvents.CHAT_DISCONNECTED, {type:GameEngineEvents.CHAT_DISCONNECTED});
        }
        else if(evt.type == GameSocket.Events.ON_MESSAGE) {
            switch(evt.packetid){
                case ChatSocket.PacketIDs.CHAT : {
                    Logger.log2(this, "상담원의 채팅 :" + evt.data.chat);
                    this.node.emit(GameEngineEvents.CHAT, {type:GameEngineEvents.CHAT, chat:evt.data.chat});
                    break;
                }
            }
        }
    },
    
});

module.exports = {
    Events: GameEngineEvents,
    Engine: GameEngine,
};