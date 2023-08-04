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
cc.Class({
    extends: cc.Component,

    properties: {
        cardAnchors: {
            default : [],
            type : cc.Node
        },
        bundle: cc.Node,
        bundleText: cc.Label,
        cardPrefab: cc.Prefab,
        originalPos: cc.Vec2
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.originalPos = this.bundle.getPosition();
    },

    // update (dt) {},
    clearBundle() {
        this.bundleText.string = "";
        for(var i = 0; i < 5; i ++)
        {
            this.cardAnchors[i].removeAllChildren();
        }
    },

    regiserBundle(cards, text) {
        this.node.active = true;

        this.clearBundle();  //  카드를 설정하기전에 원래 표시되었던 Bundle정보를 초기화한다.

        Logger.log2(this, text);
        text = text.replace("SINGLE", cc.globals.engine.stringTable('unit.single'));
        text = text.replace("PAIR", cc.globals.engine.stringTable('unit.pair'));
        text = text.replace("TRIPLE", cc.globals.engine.stringTable('unit.triple'));
        text = text.replace("BACKSTR", cc.globals.engine.stringTable('unit.backstraight'));
        text = text.replace("MOUNTAINSTR", cc.globals.engine.stringTable('unit.mountainstraight'));
        text = text.replace("STRAIGHT", cc.globals.engine.stringTable('unit.straight'));
        text = text.replace("FLUSH", cc.globals.engine.stringTable('unit.flush'));
        text = text.replace("POOLHOUSE", cc.globals.engine.stringTable('unit.poolhouse'));
        text = text.replace("FOURCARD", cc.globals.engine.stringTable('unit.fourcard'));
        text = text.replace("BACKSTRFLU", cc.globals.engine.stringTable('unit.backstraightflush'));
        text = text.replace("MOUNTAINSTRFLU", cc.globals.engine.stringTable('unit.mountainstraightflush'));
        text = text.replace("STRAIGHTFLUSH", cc.globals.engine.stringTable('unit.straightflush'));

        this.bundleText.string = text;

        //  카드설정
        for(var i = 0; i < cards.length; i ++) {

            var newCard = cc.instantiate(this.cardPrefab).getComponent("Card");
            newCard.setCard(cards[i]);
            newCard.openCard(true);
            
            var targetNode = this.cardAnchors[i];
            var ScaleX = targetNode.width / newCard.node.width;
            var ScaleY = targetNode.height / newCard.node.height;
            newCard.node.setScale(ScaleX, ScaleY);

            this.cardAnchors[i].addChild(newCard.node);
        }

        //  액션을 시작하기전에 카드묶음의 크기를 일정하게 크게한다.
        this.bundle.setScale(5);
        var pos = new cc.Vec2(-200, -11);
        pos.x += (5 - cards.length) * 75 / 2;
        this.bundle.setPosition(pos);

        //  카드내는 액션
        var scaleAction = cc.scaleTo(0.5, 1, 1).easing(cc.easeBackIn());
        this.bundle.runAction(scaleAction);
    }
});
