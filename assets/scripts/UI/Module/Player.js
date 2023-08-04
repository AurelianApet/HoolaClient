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
var constants = require("HoolaConstants");
var deltaTime = 0;

cc.Class({
    extends: cc.Component,

    properties: {
        cardAnchors : {
            default : [],
            type : cc.Node
        },

        avatar : cc.Node,
        avatar_frame: cc.Node,
        card_count : cc.Label,

        lblName : cc.RichText,
        lblMoney : cc.RichText,
        cnGameResult : cc.Node,         // 게임결과 표시

        ccSeat : null, // 자리 정보
        highlight: cc.Node,     //  진행중인 플레이어 뒤배경
        count : 0,

        timerAnchor: cc.Node,
        thap: cc.Animation,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

         //카드를 초기화한다.
        for(var i=0; i<this.cardAnchors.length; i++) {
            this.cardAnchors[i].removeAllChildren();
            this.cardAnchors[i].removeComponent(cc.Sprite);
        }

        this.clearPlayerData();
        this.clearGameData();
    },

    update (dt) {

        //  선수가 차례가 되었다면 뒤배경변화를 준다. 0.7초에 한번씩 변화를 준다.
        if(this.isActive) {
            //console.log(deltaTime);
            deltaTime += dt;
            for(var i = 0; i < 3; i ++)
                this.highlight[i].active = false;
            if(deltaTime < 0.7)this.highlight[0].active = true;
            else if(deltaTime < 1.4)this.highlight[1].active = true;
            else if(deltaTime < 2.1)this.highlight[2].active = true;
            else deltaTime = 0;
        }
    },

    // 카드를 버린다.
    dropCards(cards) {
        for(var i=0; i<cards.length; i++) {
            for(var j=0; j<this.cardAnchors.length; j++) {
                var node = this.getCardNode(j);
                if(node != null && node.getComponent("Card").cardNumber == cards[i]) {
                    this.cardAnchors[j].removeAllChildren();
                }
            }
        }
        // 버린카드 자리를 채우면서 카드를 정렬한다.
        for(var i=0; i<this.cardAnchors.length; i++) {
            if(this.getCardNode(i) == null) {
                for(var j=i+1; j<this.cardAnchors.length; j++) {
                    var node = this.getCardNode(j);
                    if(node != null) {
                        // 카드를 옮길때 타치이벤트를 다시 등로한다.
                        node.getComponent("Card").releaseTouchEvent();
                        node.removeFromParent();
                        this.cardAnchors[i].addChild(node);
                        node.getComponent("Card").setupTouchEvent();
                        break;
                    }
                }
            }
        }
    },

    // 빈 카드노드를 얻는다.
    getEmptyCardIndex() {
        for(var i=0; i<this.cardAnchors.length; i++) {
            if(this.cardAnchors[i].childrenCount == 0)
                return i;
        }
        return -1;
    },

    // 카드노드를 설정한다.
    setCardNode(node, index) {  
        this.cardAnchors[index].removeAllChildren();
        node.removeFromParent();
        node.setPosition(cc.v2(0, 0));
        node.setRotation(0);
        this.cardAnchors[index].addChild(node);
    },

    // 카드노드를 얻는다.
    getCardNode(index) {
        if(this.cardAnchors[index].childrenCount == 0)
            return null;
        return this.cardAnchors[index].children[0];
    },

    // 머니정보를 갱신한다.
    updateMoney() {
        this.lblMoney.string = Utils.numberWithCommas(this.ccSeat.money);
    },

    // 자리정보를 갱신한다.
    setPlayerData(data) {
        this.ccSeat = data;
        this.lblName.string = data.name;
        this.lblMoney.string = Utils.numberWithCommas(data.money);
        this.avatar.getComponent("Avatar").setAvatar(data.avatar);
        this.avatar_frame.active = true;

        this.card_count.string = "Cards : " + this.count + cc.globals.engine.stringTable('unit.cards');
        //this.cnRoomOutReserved.active = this.ccSeat.isOutReserved;
    },

    // 게임데이터를 초기화한다.
    clearGameData() {
        // 카드를 초기화한다.
        for(var i = 0; i < this.cardAnchors.length; i++) {
            this.cardAnchors[i].removeAllChildren();
        }
        this.card_count.string = "";
        this.count = 0;
        this.highlight.getComponent(cc.Animation).stop();
        this.highlight.active = false;
    },

    // 플레이어 정보를 초기화한다.
    clearPlayerData() {
        this.clearGameData();

        this.avatar.getComponent("Avatar").clearAvatar();
        this.avatar_frame.active = false;
        
        this.lblName.string = "";
        this.lblMoney.string = "";
        this.ccSeat = null;
        // this.cnRoomOutReserved.active = false;

        
        this.highlight.getComponent(cc.Animation).stop();
        this.highlight.active = false;
    },

    getSelectedCards() {
        var cards = [];
        var cCount = 0;
        for(var i = 0; i < this.count; i ++)
        {
            var target = this.getCardNode(i);
            var card = target.getComponent('Card');
            if(card.isSelected)cards[cCount++] = card.cardNumber;
        }
        return cards;
    },
    //카드를 놓는다
    getReleaseCards(){

        for(var i = 0 ; i < this.count ; i++){
            var target = this.getCardNode(i);
            var card = target.getComponent('Card');
            if(card.isSelected){
                card.releaseCard();
            }
        }
    },
    // 타이머 위치를 얻는다.
    getTimerPosition() {
        return this.timerAnchor.parent.convertToWorldSpaceAR(this.timerAnchor.getPosition());
    },

    playThap() {
        this.thap.play("thap");
    },
});
