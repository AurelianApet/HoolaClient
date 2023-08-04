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
var Constants = require("HoolaConstants");
var HoolaRoom = require("HoolaRoom");
var GameEngine = require("GameEngine");
import * as SFS2X from "sfs2x-api";

var audioGroup = cc.Class({
    properties : {
        source: {
            default:[],
            type:cc.AudioClip
        }
    }
});
cc.Class({
    extends: cc.Component,

    properties: {
        playerSeats : {
            default : [],
            type : cc.Node
        },
        cardPrefab : cc.Prefab,
        gameBoard : cc.Node,
        timer : cc.Node,
        cardBundle: cc.Node,
        KA2View: cc.Node,
        OldCardView: cc.Node,
        resultView: cc.Node,

        ccRoom : null, // 현재 게임방
        popup_box : cc.Node, // 메시지창
        register_turn : 0,   //  
        betting: cc.Label,
        score: cc.Label,

        emotionAudio: {
            default: [],
            type: audioGroup,
            serializable: false
        },

        AudioSource: cc.AudioSource,
        DealingAudio: cc.AudioSource,


        out_reserved: cc.Node,
        move_reserved: cc.Node,
        out: cc.Node,
        move: cc.Node,

        btnPass: cc.Button,
        btnRegister: cc.Button,
        btnSort : cc.Button
    },

    // LIFE-CYCLE CALLBACKS:
    ctor () {
        this._timer = 0;
        this.bFlag = true;
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    update (dt) {
        this._timer += dt;
        if ( this._timer >= 25.0 ) {
          this._timer = 0;
          var joinroom = cc.globals.engine.gatewaySFS.lastJoinedRoom ;
          cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("blank", null));
           if(joinroom.isGame)
               cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("blank", null,joinroom));  
         
        }
        
     },

    onLoad () {
        this.ccRoom = cc.globals.engine.gameRoom;
        this.ccRoom.init(this);
        this.ccRoom.addEventListener(this.onRoomEventHandler, this);
    },

    start () {
        
        
        this.ccRoom.setPlayerSeatData();
        // 모든 자리정보를 갱신한다.
        for(var i=0; i<4; i++) {
            this.onRoomUpdateSeatData(i);
        }
        cc.globals.engine.addEventListener(this.onGameEngineEventHandler, this);
        
        this.popup_box.active = false;
        
        
        this.btnPass.interactable = false;
        this.btnRegister.interactable = false;
        this.btnSort.interactable = false;
    },
    // onUserCountChange : function(event){
    //     var room = event.room;
    //     if(room.isGame){
    //         Logger.log(room.name + "->방인원수:" +  room.userCount);
    //         if(this.ccRoom != null){
    //             this.ccRoom.setPlayerSeatData();
    //             for (var i = 0; i < this.playerSeats.length; i++){
    //                 this.onRoomUpdateSeatData(i);
    //             }
    //         }
    //     }
    // },
    

    // 처음 게임장입장하고 관전하는 상태
    onEnterReadyState() {
        Logger.log2(this, '게임준비상태');

        // 내자리 정보   
        this.ccRoom.seatOnTable();

        // 자리정보갱신
        // this.onRoomUpdateSeatData(this.ccRoom.iMySeatNo);
        // for(var i=0; i<4; i++) {
        //     this.onRoomUpdateSeatData(i);
        // }
        
        
        //cc.globals.engine.ccGameSocket.doGameReady();
    },
    
    // 게임이 대기상태로 들어갈때
    onEnterWaitingState() {
        Logger.log2(this, '대기상태');

        // // 내자리부터 시작하여 모든 플레이어정보를 갱신한다.
        // for(var i=0; i<4; i++) {
        //     this.onRoomUpdateSeatData(i);
        // }

        // 타이머 없앤다.
        this.hideTimer();
        this.cardBundle.active = false;
        this.KA2View.getComponent("KA2View").clearData();
        this.OldCardView.getComponent("OldCardView").init();
        this.resultView.active = false;

        // 매 자리마다 카드, 등 게임데이터를 초기화한다.
        for(var i=0; i<this.playerSeats.length; i++) {
            this.playerSeats[i].getComponent("Player").clearGameData();
        }

        this.betting.string = Utils.numberWithCommas(this.ccRoom.betting);

        var val = this.ccRoom.iMyScore;
        var str = Utils.numberWithCommas(Math.abs(val));
        if(val < 0){
            str = "-" + str;
            this.score.node.color = new cc.Color(14, 163, 218);
        }
        else {
            this.score.node.color = new cc.Color(203, 42, 15);
        }
        this.score.string = str;
        // 내가 게임장에 입장하면 게임준비상태 알림
        var joinroom = cc.globals.engine.gatewaySFS.lastJoinedRoom ;
        if(joinroom.isGame)
            cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("ready", null,joinroom));
       
        
    },

    // 해당 번호의 자리를 갱신한다.
    onRoomUpdateSeatData(seatno) {
        // 표시자리번호를 얻는다.
        //Logger.log("remove seat:" + seatno);
        var display_seat = this.ccRoom.getViewSeatNo(seatno);

        var data = this.ccRoom.getSeatData(seatno);
        if(data == null) {
            this.playerSeats[display_seat].getComponent("Player").clearPlayerData();
        }
        else {
            this.playerSeats[display_seat].getComponent("Player").setPlayerData(data);
        }
    },

    onEnterDealingState() {
        Logger.log2(this, '게임이 시작되었습니다. 카드를 딜링합니다.');

        this.nSelectedCards = 0;
    },

    onRoomEventHandler (evt) {
        switch(evt.type) {
            case HoolaRoom.Events.UPDATE_SEATDATA : {
                this.onRoomUpdateSeatData(evt.seatno);
                break;
            }
            case HoolaRoom.Events.CARD_DEALING : {
                this.resultView.active = false;
                this.onRoomCardDealing(evt.cards);
                break;
            }
            case HoolaRoom.Events.UPDATE_CARDS : {
                //this.resultView.active = false;
                this.onRoomUpdateCards();
                break;
            }
            case HoolaRoom.Events.REGISTER_CARDS: {
                this.onRoomRegisterCards(evt.seatno, evt.cards, evt.bundleString, evt.soundString);
                break;
            }
            case HoolaRoom.Events.REGISTER_TURN : {
                this.onRoomRegisterTurn(evt.seat, evt.timeout, evt.bundleInfo);
                break;
            }
            case HoolaRoom.Events.EMOTION_SOUND : {
                this.onRoomEmotionSound(evt.avatar, evt.number);
                break;
            }
            case HoolaRoom.Events.ROUND_NOTIFY : {
                this.onRoomRoundNotify(evt.round);
                break;
            }
            case HoolaRoom.Events.UPDATE_ROOMMONEY : {
                this.onRoomUpdateTotalAndCall(evt.roomtotal, evt.callmoney);
                break;
            }
            case HoolaRoom.Events.GAME_RESULT : {
                this.onRoomGameResult(evt.players, evt.seats);
                break;
            }
            case HoolaRoom.Events.EXIT_ROOM : {
                // 로비화면으로 이동
                // cc.globals.engine.quitHoolaGame();
                
                cc.director.loadScene("lobby");
                break;
            }
            case HoolaRoom.Events.MOVE_ROOM : {
                for(var i=0; i<4; i++) {
                    // 표시자리번호를 얻는다.
                    var display_seat = this.ccRoom.getViewSeatNo(i);

                    this.playerSeats[display_seat].getComponent("Player").clearPlayerData();
                }
                this.onClickMoveRoomReserved()
                break;
            }
            case HoolaRoom.Events.ON_ERROR : {
                this.onRoomGameError(evt.msg);
                break;
            }
        }
    },

    onRoomUpdateCards() {
        for(var i = 0; i < this.ccRoom.players.length; i ++) {
            
            var seatno = this.ccRoom.getViewSeatNo(this.ccRoom.players[i].seatno);
            var hand = this.ccRoom.players[i].hand;

            var player = this.playerSeats[seatno].getComponent("Player");
            player.clearGameData(); //  원래 플레이어가 들고있던 카드정보 초기화
            
            // if(hand.cards.length == 1){  //  땁이면
            //     player.playThap();
            // }
            //  새로 갱신된 카드정보로 맞추기
            for(var j = 0; j < hand.cards.length; j ++) {
                var newCard = cc.instantiate(this.cardPrefab).getComponent("Card");
                newCard.setCard(hand.cards[j].value);
                
                this.gameBoard.addChild(newCard.node);
                
                var targetNode = player.cardAnchors[j];
                var ScaleX = targetNode.width / newCard.node.width;
                var ScaleY = targetNode.height / newCard.node.height;
                newCard.node.setScale(ScaleX, ScaleY);

                player.setCardNode(newCard.node, j);
                player.count++;

                if(seatno == 0)
                {
                    newCard.openCard(true);
                    // 내 자리 카드인 경우 타치액션가능하게 한다.
                    newCard.getComponent("Card").setupTouchEvent();
                }
            }
        }
        for(var i=0; i<4; i++) {
            this.onRoomUpdateSeatData(i);
        }
    },

    startTimer(seatno, time) {
        var pos = this.playerSeats[seatno].getComponent("Player").getTimerPosition();
        pos = this.gameBoard.convertToNodeSpaceAR(pos);

        // 타이머를 가동한다.
        this.timer.getComponent("Timer").startTimer(pos, time);
    },
    hideTimer() {
        // 타이머를 중지하고 숨긴다.
        this.timer.getComponent("Timer").stopTimer();
    },
    onRoomRegisterCards(seatno, cards, bundleString, soundString) {
        var bundleBox = this.cardBundle;
        
        bundleBox.getComponent("CardBundle").regiserBundle(cards, bundleString);

        this.KA2View.getComponent("KA2View").checkCards(cards);
        this.OldCardView.getComponent("OldCardView").registerRec(cards);

        //  카드조합에 따르는 음성
        if(cc.globals.engine.bEffectSound == 1) this.DealingAudio.play();
        // if(soundString == "Thap") {
        //     var seat = this.ccRoom.getViewSeatNo(seatno);
        //     console.log(seat);
        //     this.playerSeats[seat].getComponent("Player").playThap();
        // }
        // var avatar = this.ccRoom.ccSeats[this.register_turn].avatar;
        // avatar = avatar % 1;    //  목소리가 1명분 준비되여있기때문에
        // avatar ++;
        // this.playCardBundleSound(avatar, soundString);
    },

    onRoomRegisterTurn(seat, timeout, bundleInfo) {
        Logger.log2(this, "on Room register turn is " + seat);
        if(seat == this.ccRoom.iMySeatNo){
            this.btnPass.interactable = true;
            this.btnRegister.interactable = true;
            this.btnSort.interactable = true;
        }
        else{
            this.btnPass.interactable = false;
            this.btnRegister.interactable = false;
            this.btnSort.interactable = false;
        }
        //  원래 턴인 플레이어의 진행효과는 중지한다.
        var seatno = this.ccRoom.getViewSeatNo(this.register_turn);
        var highlight = this.playerSeats[seatno].getComponent("Player").highlight;
        highlight.getComponent(cc.Animation).stop();
        highlight.active = false;
        this.hideTimer();

        this.register_turn = seat;

        //  새턴의 플레이어의 진행효과를 실행한다.
        var newseatno = this.ccRoom.getViewSeatNo(seat);
        var newhighlight = this.playerSeats[newseatno].getComponent("Player").highlight;
        newhighlight.active = true;
        newhighlight.getComponent(cc.Animation).play("seathighlight");
        
        if(timeout != 0) this.startTimer(newseatno, timeout);
        if(bundleInfo == 0) this.cardBundle.active = false;

        this.bFlag = true;
    },

    onRoomCardDealing(cards) {
        var room = this.ccRoom;

        // 0번째 플레이어부터 카드를 분배한다.
        var data = {};
        data.cards = cards;
        data.targetCardIndex = [];
        for(var i=0; i<room.players.length; i++) {
            data.targetCardIndex[i] = 0;
        }

        this.onDealingCards(0, 0, data);
    },

    // 딜링카드를 받았을때`
    // player자리 부터 index번째 카드를 딜링한다
    onDealingCards(player, index, data) {
        if(index >= data.cards.size()){
            cc.globals.engine.readyForRegister();
            for(var i=0; i<4; i++) {
                this.onRoomUpdateSeatData(i);
            }
            return;
        }
        // 게임에 실지 참여하는 플레이어들에게 한장씩 분배한다.
        setTimeout(function(){
            var seatno = this.ccRoom.getViewSeatNo(this.ccRoom.players[player].seatno);
            var i = data.targetCardIndex[player];
            data.targetCardIndex[player]++;
        
            this.startDealingAction(seatno, i, data.cards.getInt(index), true);
            if(cc.globals.engine.bEffectSound == 1) this.DealingAudio.play();
            player++; index++;
            if(player >= this.ccRoom.players.length) {
                player = 0;
            }
            this.onDealingCards(player, index, data);
        }.bind(this), 50);
    },

    // 해당 자리에 카드를 딜링한다.
    startDealingAction(seatno, index, card, opened) {
        Logger.log2(this, seatno + ":" + index + ":" + card + ":" + opened);
        // 새 카드를 생성한다.
        var newCard = cc.instantiate(this.cardPrefab).getComponent("Card");
        newCard.setCard(card);
        newCard.openCard(opened);
        this.gameBoard.addChild(newCard.node);

        // 카드 애님 시작값 
        var startPos = cc.v2(0, 0);
        //newCard.node.setRotation(90);
        newCard.node.setPosition(startPos);
        newCard.node.setScale(0.7, 0.7);

        // 목표위치
        Logger.log2(this, "cardAnchor Index : " + index);
        var targetNode = this.playerSeats[seatno].getComponent("Player").cardAnchors[index];
        
        // 카드 애니메이션 
        var endPos = targetNode.getPosition();
        
        if(seatno == 0)
        {            
            endPos.x += targetNode.width;
            endPos.y -= targetNode.height / 2;
        }
        else
        {
            endPos.x -= targetNode.width;
        }
        
        endPos = this.playerSeats[seatno].convertToWorldSpaceAR(endPos);
        endPos = this.gameBoard.convertToNodeSpaceAR(endPos);
        
        var endScaleX = targetNode.width / newCard.node.width;
        var endScaleY = targetNode.height / newCard.node.height;
        
        var moveAction = cc.moveTo(0.5, endPos).easing(cc.easeCubicActionOut());
        var rotateAction = cc.rotateBy(0.5, 270).easing(cc.easeCubicActionOut());
        var scaleAction = cc.scaleTo(0.5, endScaleX, endScaleY).easing(cc.easeCubicActionOut());
        var callback = cc.callFunc(this.onDealEnd, this, {seatno:seatno, index:index});
        newCard.node.runAction(scaleAction);
        //newCard.node.runAction(rotateAction);
        newCard.node.runAction(cc.sequence(moveAction, callback));
    },

    // 카드 딜링 애니메이션이 완료됬을때
    onDealEnd(target, data) {
        var player = this.playerSeats[data.seatno].getComponent("Player");
        player.setCardNode(target, data.index);
        player.count = 13;

        // 카드가 모두 딜링되면 족보를 갱신한다.
        if(player.getEmptyCardIndex()<0) {
            //player.setMaidJokbo(player.ccSeat.hand.isMaidJokbo);
            //player.setHandString(player.ccSeat.hand.jokbo);
        }

        // 내 자리 카드인 경우 타치액션가능하게 한다.
        if(this.ccRoom.iMySeatNo >= 0 && data.seatno == 0) {
            target.getComponent("Card").setupTouchEvent();
        }
    },

    // 게임결과처리
    onRoomGameResult(players, seats) {
        Logger.log("결과처리");
        this.hideTimer();
        // 매 자리마다 카드, 등 게임데이터를 초기화한다.
        for(var i=0; i<this.playerSeats.length; i++) {
            this.playerSeats[i].getComponent("Player").clearGameData();
        }

        var seatData = [];
        for(var i = 0; i < players; i ++) {
            seatData[i] = this.ccRoom.ccSeats[seats[i]];
        }
        this.resultView.active = true;
        this.resultView.getComponent("GameResult").showResult(seatData);
    },

    onRoomGameError(msg) {
        var msgbox = this.popup_box.getComponent("Popup");
        cc.globals.engine.quitHoolaGame();
        msgbox.showMessage(msg, 
            function() {
                // 확인버튼을 누르면 방나가기 한다.
                cc.director.loadScene("lobby");
            });
    },

    onClickRegisterButton() {
        if(this.ccRoom.clickFlag == false) return ;
        
        var seatno = this.ccRoom.getViewSeatNo(this.register_turn);
        //  자기 차례가 아니라면 [등록]동작을 무시한다.
        if(seatno)return;

        // 플레이어가 [등록]단추를 눌렀다는것과 낸 카드정보를 알린다.
        var player = this.playerSeats[0].getComponent("Player");
        var cards = player.getSelectedCards();
        if(cards.length == 0)return;    //  한장도 선택하지 않은 상태라면 등록하지 않는다.
        cc.globals.engine.registerCards(cards);
        this.ccRoom.clickFlag = false ;
        
    },
    
    onClickSortButton() {

    },

    onClickPassButton() {
        if(this.bFlag == false) return;
        this.bFlag = false;

        var seatno = this.ccRoom.getViewSeatNo(this.register_turn);
        //  자기 차례가 아니라면 [패스]동작을 무시한다.
        if(seatno)return;
        // 플레이어가 [패스]단추를 눌렀다는것과 낸 카드정보를 알린다.
        cc.globals.engine.passCard();
        var player = this.playerSeats[0].getComponent("Player");
        var cards = player.getReleaseCards();
        if(cc.globals.engine.bEffectSound == 1) this.DealingAudio.play();
        

        
    },

    
    playEmotionSound(number){
        var avatar = this.ccRoom.ccSeats[this.ccRoom.iMySeatNo].avatar;
        avatar = avatar % 9;    //  목소리가 9명분 준비되여있기때문에
        avatar ++;

        cc.globals.engine.playEmotionSound(avatar, number);
    },
    onRoomEmotionSound(avatar, number) {
        cc.loader.loadRes("audio/emotion/" + avatar + "/emo"+ number, cc.AudioClip, function (err, audioClip) {
            this.AudioSource.clip = audioClip;
            if(cc.globals.engine.bEffectSound == 1) this.AudioSource.play();
        }.bind(this)) ;
    },

    playCardBundleSound(avatar, src){

        return;
        cc.loader.loadRes("audio/cards/" + avatar + "/" + src, cc.AudioClip, function (err, audioClip) {
            this.AudioSource.clip = audioClip;
            if(cc.globals.engine.bEffectSound == 1) this.AudioSource.play();
        }.bind(this)) ;
    },

    //  [빨리]를 눌렀을때
    onClickEmotion1() {
        this.playEmotionSound(1);
    },

    //  [황당]을 눌렀을때
    onClickEmotion2() {
        this.playEmotionSound(2);
    },

    //  [분노]를 눌렀을때
    onClickEmotion3() {
        this.playEmotionSound(3);
    },

    //  [아싸]를 눌렀을때
    onClickEmotion4() {
        this.playEmotionSound(4);
    },

    //  [실수]를 눌렀을때
    onClickEmotion5() {
        this.playEmotionSound(5);
    },

    //  [미안]을 눌렀을때
    onClickEmotion6() {
        this.playEmotionSound(6);
    },

    //  [감사]를 눌렀을때
    onClickEmotion7() {
        this.playEmotionSound(7);
    },

    //  [인사]를 눌렀을때
    onClickEmotion8() {
        this.playEmotionSound(8);
    },

    onClickMoveroom() {     //  방이동을 눌렀다면 예약한다.
        this.move.active = false;
        this.move_reserved.active = true;
        cc.globals.engine.reserveMoveroom();
    },

    onClickMoveRoomReserved() { //  방이동예약을 눌렀다면 예약을 취소한다.
        this.move_reserved.active = false;
        this.move.active = true;
        cc.globals.engine.cancelMoveroom();
    },

    onClickOut() {  //  탈퇴를 눌렀다면 예약한다.
        this.out.active = false;
        this.out_reserved.active = true;
        cc.globals.engine.reserveOut();
    },
    
    onClickOutReserved() {  //  탈퇴예약을 눌렀다면 예약을 취소한다.
        this.out_reserved.active = false;
        this.out.active = true;
        cc.globals.engine.cancelOut();
    },

    onGameEngineEventHandler (evt) {
        switch(evt.type){
            case GameEngine.Events.DISCONNECTED:{
                Logger.log("connection lost..");
                this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.disconnected_to_server'));
                break;
            }
        }
        
    }
    

});
