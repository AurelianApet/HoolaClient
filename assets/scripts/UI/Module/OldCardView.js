// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var cardRec = cc.Class({
    properties: {
        cards:[],
    },
    
    ctor() {

    },

    setCards(_cards) {
        this.cards = _cards;
    }
});
cc.Class({
    extends: cc.Component,

    properties: {
        old:[],
        cardAnchors:{
            default: [],
            type: cc.Node
        },
        cardPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    init() {
        this.old = [];
        this.clearData();
    },
    clearData() {
        for(var i = 0; i < this.cardAnchors.length; i ++)
            this.cardAnchors[i].removeAllChildren();
    },

    registerRec(cards) {
        var rec = new cardRec();
        rec.setCards(cards);
        this.old[this.old.length] = rec;
        this.updateView();
    },

    updateView() {
        this.clearData();

        var startNum = this.old.length - 8;
        for(var i = startNum + 7; i >= startNum; i --) {
            if(i < 0)break;
            var rec = this.old[i];

            for(var j = 0; j < rec.cards.length; j ++)
            {
                var newCard = cc.instantiate(this.cardPrefab).getComponent("Card");
                newCard.setCard(rec.cards[j]);
                newCard.openCard(true);
                
                var targetNode = this.cardAnchors[(startNum + 7 - i) * 5 + j];
                var ScaleX = targetNode.width / newCard.node.width;
                var ScaleY = targetNode.height / newCard.node.height;
                newCard.node.setScale(ScaleX, ScaleY);
    
                targetNode.addChild(newCard.node);
            }
        }
    }
});
