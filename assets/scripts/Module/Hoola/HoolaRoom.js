// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var State = require('state.com');
var Logger = require("Logger");
var HoolaHand = require("HoolaHand");
var HoolaSeat = require("HoolaSeat");
var Constants = require("HoolaConstants");
import * as SFS2X from "sfs2x-api";
var STATES = cc.Enum({
    READY : "Ready",
    WAITING : "Waiting",
    PLAYING : "Playing",
    DEALING : "Dealing",
    BETTING : "Betting",
    IDLE : "Idle",
 });

var EVENTS = cc.Enum({
    SEAT : "Seat",                  // 앉기
    START_GAME : "StartGame",       // 게임시작
    RESET_GAME : "ResetGame",                // 게임초기화
    MOVE_GAME : "MoveGame",                // 게임초기화
    START_BETTING : "StartBetting",  // 베팅시작 
    BETTING_RESULT : "BettingResult",  // 베팅결과 
});

var ROOM_EVENTS = cc.Enum({
    UPDATE_SEATDATA : "HoolaRoom.UPDATE_SEATDATA",     // 자리정보 새로고침
    CARD_DEALING : "HoolaRoom.DEALING_CARDS",          // 카드딜링 
    UPDATE_CARDS : "HoolaRoom.UPDATE_CARDS",            //  플레이어들의 카드정보 갱신
    REGISTER_CARDS: "HoolaRoom.REGISER_CARDS",          //  카드등록
    REGISTER_TURN : "HoolaRoom.REGISTER_TURN",            //  카드를 낼 순서
    EMOTION_SOUND : "HoolaRoom.EMOTION_SOUND",          //  감정보이스 플레이
    ROUND_NOTIFY : "HoolaRoom.NotifyRound",
    UPDATE_ROOMMONEY : "HoolaRoom.UPDATE_ROOMMONEY",   // 방의 토탈머니&콜머니 새로고침
    GAME_RESULT : "HoolaRoom.GAME_RESULT",             // 게임결과
    EXIT_ROOM : "HoolaRoom.EXIT_ROOM",                 // 내가 방탈퇴
    MOVE_ROOM : "HoolaRoom.MOVE_ROOM",                 // 내가 방이동
    ON_ERROR : "HoolaRoom.ON_ERROR",                   // 게임중 에러
});

function on (message) {
    return function (msgToEvaluate) {
        return msgToEvaluate === message;
    };
}

var HoolaRoom = cc.Class({
    extends: cc.Component,

    properties: {
        fsmEvaluating : false,
        fsmInstance : null,
        fsmModel : null,
        ccSeats : [],                       // 방안의 모든 자리정보
        iMySeatNo : cc.Integer,             // 내가 앉은 자리번호
        players : [],
        iRoomID : cc.Integer,
        iBossSeatNo : cc.Integer,          // 보스자리번호
        nCurrentRound : 0,
        nTotalBettingMoney : 0,
        nCurrentCallMoney : 0,
        bIsInited : cc.Boolean,

        betting:0,
        iMyScore:0,
        clickFlag :cc.Boolean ,
    },

    // 생성자
    ctor () {
        this.iBossSeatNo = -1;
        this.iMySeatNo = -1;
        this.nCurrentRound = 0;
        this.bIsInited = false;
        this.clickFlag = true ;
        // 자리정보를 초기화한다.
        for(var i=0; i<4; i++) {
            this.ccSeats[i] = null;
        }

    },

    init(target) {
        var self = this;
        // 자리정보를 초기화한다.
        for(var i=0; i<4; i++) {
            this.ccSeats[i] = null;
        }
        if(this.node == null)
            this.node = new cc.Node();

        State.console = console;
        this.fsmModel = new State.StateMachine("root");
        var initial = new State.PseudoState("init-root", this.fsmModel, State.PseudoStateKind.Initial);
        var ready = new State.State(STATES.READY, this.fsmModel);
        var waiting = new State.State(STATES.WAITING, this.fsmModel);
        var playing = new State.State(STATES.PLAYING, this.fsmModel);

        var initialP = new State.PseudoState("init-playing", playing, State.PseudoStateKind.Initial);
        var dealing = new State.State(STATES.DEALING, playing);
        var betting = new State.State(STATES.BETTING, playing);
        var idle = new State.State(STATES.IDLE, playing);

        initial.to(ready);
        ready.to(waiting).when(on(EVENTS.SEAT));    //관전상태에서 앉기 이벤트가 발생하면 대기상태로 이행
        waiting.to(dealing).when(on(EVENTS.START_GAME)); //대기상태에서 시작 이벤트가 발생하면 게임진행상태
        waiting.to(waiting).when(on(EVENTS.RESET_GAME));   //진행상태에서 끝 이벤트가 발생하면 
        playing.to(waiting).when(on(EVENTS.RESET_GAME));   //진행상태에서 끝 이벤트가 발생하면 
        playing.to(ready).when(on(EVENTS.MOVE_GAME));   //진행상태에서 끝 이벤트가 발생하면 게임대기상태
        ready.entry(function () {
            target.onEnterReadyState();
        });
        waiting.entry(function () {
            target.onEnterWaitingState();
        });

        initialP.to(dealing);
        dealing.to(betting).when(on(EVENTS.START_BETTING));
        betting.to(idle).when(on(EVENTS.BETTING_RESULT));
        
        dealing.entry(function () {
            target.onEnterDealingState();
        });

        betting.entry(function () {
            target.onEnterBettingState(self);
        });

        // create a State machine instance
        this.fsmInstance = new State.StateMachineInstance("hoola-fsm");
        State.initialise(this.fsmModel, this.fsmInstance);

        this.bIsInited = true;
    },
    
    close()
    {
        this.bIsInited = false;
        cc.globals.engine.ccGameSocket.close();
    },

    isReadyState : function() {
        return this.fsmInstance.getCurrent(this.fsmModel.regions[0]).name == STATES.READY;   
    },

    log(seatno, msg) {
        var seat = this.getSeatData(seatno);
        Logger.log2(this, seat.name + ':' + seatno + ' 님 - ' + msg);
    },

    addEventListener (callback, target) {
        this.node.on(ROOM_EVENTS.CARD_DEALING, callback, target);
        this.node.on(ROOM_EVENTS.UPDATE_CARDS, callback, target);
        this.node.on(ROOM_EVENTS.REGISTER_CARDS, callback, target);
        this.node.on(ROOM_EVENTS.REGISTER_TURN, callback, target);
        this.node.on(ROOM_EVENTS.EMOTION_SOUND, callback, target);
        this.node.on(ROOM_EVENTS.UPDATE_SEATDATA, callback, target);
        this.node.on(ROOM_EVENTS.UPDATE_ROOMMONEY, callback, target);
        this.node.on(ROOM_EVENTS.GAME_RESULT, callback, target);
        this.node.on(ROOM_EVENTS.EXIT_ROOM, callback, target);
        this.node.on(ROOM_EVENTS.MOVE_ROOM, callback, target);
        this.node.on(ROOM_EVENTS.ON_ERROR, callback, target);
    },

    removeEventListener (callback, target) {
        this.node.off(ROOM_EVENTS.CARD_DEALING, callback, target);
        this.node.off(ROOM_EVENTS.UPDATE_CARDS, callback, target);
        this.node.off(ROOM_EVENTS.REGISTER_CARDS, callback, target);
        this.node.off(ROOM_EVENTS.REGISTER_TURN, callback, target);
        this.node.off(ROOM_EVENTS.EMOTION_SOUND, callback, target);
        this.node.off(ROOM_EVENTS.UPDATE_SEATDATA, callback, target);
        this.node.off(ROOM_EVENTS.UPDATE_ROOMMONEY, callback, target);
        this.node.off(ROOM_EVENTS.GAME_RESULT, callback, target);
        this.node.off(ROOM_EVENTS.EXIT_ROOM, callback, target);
        this.node.off(ROOM_EVENTS.MOVE_ROOM, callback, target);
        this.node.off(ROOM_EVENTS.ON_ERROR, callback, target);
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    close()
    {
        this.bIsInited = false;
        cc.globals.engine.ccGameSocket.close();
    },

    // 게임 시작
    startGame(seats, boss) {
        this.nTotalBettingMoney = 0;
        this.nCurrentCallMoney = 0;
        this.nCurrentRound = Constants.ROUND_DAWN;
        this.players = [];
        for(var i = 0; i < seats.size(); i++) {
            Logger.log("자리번호:" + seats.get(i));
            this.players[i] = this.ccSeats[seats.get(i)];
            this.players[i].winmoney = 0;
            this.players[i].isOutReserved = false;
            this.players[i].hand = new HoolaHand();
        }
        // 보스자리 설정
        this.iBossSeatNo = boss;
        this.log(boss, '보스입니다.');

        var self = this;
        setTimeout(function () {
            self.evaluate(EVENTS.START_GAME);
        }, 1);
    },

    playEmotionSound(avatar, number) {

        this.dispatchMessage(ROOM_EVENTS.EMOTION_SOUND, {avatar:avatar, number:number});
    },
     // 플래이어의 자리 정보 설정
     setPlayerSeatData(){
        //모든 자리 장보 초기화
        // for(var i = 0 ; i < 4 ; i++){
        //     var seat = new HoolaSeat();
        //     this.ccSeats[i] = seat;
        //     // 자리정보 룸이벤트 발생
        //     this.dispatchMessage(ROOM_EVENTS.UPDATE_SEATDATA, {seatno:i});
        // }
        //자리 정보 설정
        var playerList = cc.globals.engine.gatewaySFS.lastJoinedRoom.getUserList();
        var my = cc.globals.engine.gatewaySFS.mySelf;
        var item;
        for(var i = 0 ; i < playerList.length; i++){
            item = playerList[i];
            if(item.name == my.name) continue;
            this.setPlayerSeat(item.getVariable("seat").value,item.name,
                            item.getVariable("avatar").value,item.getVariable("gamemoney").value);
        }
        
    },
    // 플레이어 자리정보를 설정한다.
    setPlayerSeat(seatno, name, avatar, money) {
        Logger.log("자리정보 설정 :" + seatno);
        if(seatno < 0)  
            return;
        var seat = new HoolaSeat();
        seat.seatno = seatno;
        seat.name = name;
        seat.avatar = avatar;
        seat.money = money;
        seat.winmoney = 0;
        seat.isOutReserved = false;
        this.ccSeats[seatno] = seat;

        // 자리정보 룸이벤트 발생
        this.dispatchMessage(ROOM_EVENTS.UPDATE_SEATDATA, {seatno:seatno});
    },
    // 플레이어 자리정보를 지운다.
    removePlayerSeat(seatno) {
        Logger.log("업데이트 할 플래이어 자리:" + seatno);
        this.ccSeats[seatno] = null;

        // 자리정보 룸이벤트 발생
        this.dispatchMessage(ROOM_EVENTS.UPDATE_SEATDATA, {seatno:seatno});
    },
    getViewSeatNo(seat) {
        if(this.iMySeatNo < 0)
            return seat;
        
        return (4 + seat - this.iMySeatNo) % 4;
    },

    getSeatData(seat) {
        return this.ccSeats[seat];
    },

    // 내가 자리에 앉기한다
    seatOnTable() {
        this.setPlayerSeat(this.iMySeatNo, cc.globals.engine.myUserData.name, cc.globals.engine.myUserData.avatar,cc.globals.engine.myUserData.gamemoney);

        var self = this;
        this.iMyScore = 0;
        setTimeout(function () {
            self.evaluate(EVENTS.SEAT);
        }, 300);
    },

    // 방안의 메시지를 발생한다.
    dispatchMessage(type, params) {
        if(params == undefined) {
            params = {};
        }
        params.type = type;
        if(this.node != null) {
            this.node.emit(type, params);
        }
    },
    
    // 이벤트 발생
    evaluate (message) {
        if (this.fsmEvaluating) {
            var self = this;
            // can not call fsm's evaluate recursively
            setTimeout(function () {
                State.evaluate(self.fsmModel, self.fsmInstance, message);
            }, 1);
            return;
        }
        this.fsmEvaluating = true;
        State.evaluate(this.fsmModel, this.fsmInstance, message);
        this.fsmEvaluating = false;
    },
    setRegisterCards(seatno, cards, bundleString, soundString) {

        // 카드갱신 룸이벤트 발생
        this.dispatchMessage(ROOM_EVENTS.REGISTER_CARDS, {seatno:seatno, cards:cards, bundleString:bundleString, soundString:soundString});
    },

    setDealerCards(cards) {
        var index = 0;
        // 첫번째 플레이어부터 딜러카드를 한장씩 분배한다.
        for(var i=0; i<cards.size(); i++) {
            this.players[index].hand.addCard(cards.getInt(i));
            index++;
            if(index >= this.players.length) {
                index = 0;
            }
        }

        // 카드딜링 룸이벤트 발생
        this.dispatchMessage(ROOM_EVENTS.CARD_DEALING, {cards:cards});
    },
    updatePlayerCards(seats, counts, cards) {

        for(var i=0; i<seats.length; i++) {
            this.players[i] = this.ccSeats[seats[i]];
            this.players[i].winmoney = 0;
            this.players[i].isOutReserved = false;
            this.players[i].hand = new HoolaHand();
        }
        //  플레이어들의 카드갱신
        var index = 0;
        for(var i = 0; i < counts.length; i ++) {
            if(this.players[i].hand == undefined)continue;
            this.players[i].hand.initHand();
            for(var j = 0; j < counts[i]; j ++){
                this.players[i].hand.addCard(cards[index++]);
            }
        }
        
        // 카드갱신 룸이벤트 발생
        this.dispatchMessage(ROOM_EVENTS.UPDATE_CARDS, {counts:counts, cards:cards});
    },

    // 게임결과처리를 진행한다.
    setGameResult(players, seats, winmoney, gamemoney, iswinner) {
        //Logger.log("플래이어수:"+ players);
        for(var i = 0; i < players; i++) {
            var seat = this.getSeatData(seats[i]);
            seat.money = gamemoney[i];
            seat.winmoney = winmoney[i];
            seat.isWinner = iswinner[i];
            if(this.getViewSeatNo(seats[i]) == 0){ //  나의 스코를 갱신한다.
                Logger.log("윈 머니:"+ seat.winmoney);
                var val = seat.winmoney;
                //if(seat.isWinner == false)val = -1 * val;
                this.iMyScore += val;
                cc.globals.engine.myUserData.gamemoney = seat.money;
            }
        }

        // 룸의 게임결과이벤트 발생
        this.dispatchMessage(ROOM_EVENTS.GAME_RESULT,{players: players, seats: seats});
    },

    //  카드낼 차례가 된 플레이어정보 갱신
    updateRegisterTurn(seat, timeout, bundleInfo) {
        Logger.log2(this, "update register turn");
        
        // 카드갱신 룸이벤트 발생
        this.dispatchMessage(ROOM_EVENTS.REGISTER_TURN, {seat:seat, timeout:timeout, bundleInfo:bundleInfo});
    },

    resetGame() {
        var self = this;
        setTimeout(function () {
            self.evaluate(EVENTS.RESET_GAME);
        }, 1);
    },

    setError(msg) {
        if(this.bIsInited == false)
            return false;
        this.close();
        this.dispatchMessage(ROOM_EVENTS.ON_ERROR, {msg:msg});
    },

    // 플레이어 자리정보를 초기화한다.
    playerRoomOut() {
        this.close();
        // 방나가기 이벤트 발생
        this.dispatchMessage(ROOM_EVENTS.EXIT_ROOM);
        
    },

    // 플레이어 자리정보를 초기화한다.
    playerRoomMove(seatno, flag) {
        if(seatno < 0)
            return;

        var seat = this.getSeatData(seatno);

        if(flag == 0) { // 방 탈퇴
            
            if(seatno == this.iMySeatNo)
            {
                for(var i=0; i<4; i++) {
                    
                    this.ccSeats[i] = null;
                }
            }  
            else
            {
                this.ccSeats[seatno] = null;   
            }
            
            // 내가 방탈퇴이면
            if(this.iMySeatNo >= 0 && seatno == this.iMySeatNo) {
                // 방나가기 이벤트 발생
                this.dispatchMessage(ROOM_EVENTS.MOVE_ROOM);

                var self = this;
                setTimeout(function () {
                    self.evaluate(EVENTS.MOVE_GAME);
                }, 1);

                return;
            }
        } else if(flag == 1 && seat != null) { // 나가기 예약
            seat.isMoveReserved = true;
        } else if(flag == 2 && seat != null) { // 나가기 취소
            seat.isMoveReserved = false;
        }

        this.dispatchMessage(ROOM_EVENTS.UPDATE_SEATDATA, {seatno:seatno});
        
    },


    // update (dt) {},
});

module.exports = {
    Events: ROOM_EVENTS,
    Room: HoolaRoom,
};