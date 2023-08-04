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
    properties: {
        value : cc.Integer,     // 카드값 ( 0 ~ 52,  0 : 뒤집힌 카드(모르는 카드), 1~13 : ♣A, 2, 3, ... K,  14~26 : ♥, 27~39 : ♦, 40~52 : ♠)
        kind : cc.Integer,      // 카드종류 ( 0 ~ 4, 0 : 뒤집힌 카드(모르는 카드), 1 : ♣,  2 : ♥, 3 : ♦, 4 : ♠)
        num : cc.Integer,       // 카드인덱스 ( 1 ~ 13 , 0 : 뒤집힌 카드(모르는 카드), 1: A, 2 : 2, ... , 11 : J, 12 : Q, 13 : K)
    },

    ctor() {
        
    },

    setValue(card) {
        this.value = card;
        if(card == 0) {
            this.kind = 0;
            this.num = 0;
        }
        else{
            this.kind = Math.floor((card - 1) / 13) + 1;
            this.num = (card - 1) % 13 + 1;
        }
    },

    toNumString() {
        var str = "";
        if (this.num == 1) {
            str="A";
        } else if (this.num >= 2 && this.num <= 10) {
            str=this.num.toString();
        } else if (this.num == 11) {
            str="J";
        } else if (this.num == 12) {
            str="Q";
        } else if (this.num == 13) {
            str="K";
        }
        return str;
    }
});

