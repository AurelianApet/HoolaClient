// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    statics: {
        // 카드형태
        CARD_CLOVER:1,
        CARD_HEART:2,
        CARD_DIAMOND:3,
        CARD_SPADE:4,

        // 라운드타임
        ROUND_DAWN : 1, // 새벽
        ROUND_MORNING : 2, // 아침
        ROUND_NOON : 3, // 점심
        ROUND_EVENING : 4, // 저녁

        bettingTypeString(bettype) {
            switch(bettype){
                case this.BETTING_CALL:
                    return "";
                case this.BETTING_CHECK:
                    return "";
                case this.BETTING_DIE:
                    return "";
                case this.BETTING_PING:
                    return "";
                case this.BETTING_RAISE:
                    return "";
                default:
                    return "?";
            }
        },
    },
});
