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
        seatno : cc.Integer,
        name : cc.String,
        avatar : cc.Integer,
        money : 0,
        winmoney : 0,
        isWinner : 0,
        hand : null,
        isOutReserved : cc.Boolean,
        isMoveReserved : cc.Boolean,
    },
    
    ctor() {
        this.seatno = -1;
        this.name = "";
        this.avatar = 0;
        this.money = 0;
        this.winmoney = 0;
        this.isWinner = 0;
        this.isOutReserved = false;
        this.isMoveReserved = false;
    }
});
