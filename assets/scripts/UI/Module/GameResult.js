// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var Logger = require("Logger");
cc.Class({
    extends: cc.Component,

    properties: {
        items : {
            default : [],
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    clearData() {
        for(var i = 0; i < this.items.length; i ++){
            this.items[i].getComponent("GameResultPlayer").clearData();
        }
    },

    showResult(data) {
        this.clearData();
        this.node.active = true;
        
        //  윈머니순으로 정렬한다.
        for(var i = 0; i < data.length - 1; i ++)
        {
            var wini = data[i].winmoney;
            Logger.log("머니:" + wini);
           // if(data[i].isWinner == 0)wini = -1 * wini;
            for(var j = i + 1; j < data.length; j ++)
            {
                var winj = data[j].winmoney;
                //if(data[j].isWinner == 0)winj = -1 * winj;
                if(winj > wini) {
                    var tmp = data[i];
                    data[i] = data[j];
                    data[j] = tmp;
                }
            }
        }

        for(var i = 0; i < data.length; i ++)
        {
            this.items[i].getComponent("GameResultPlayer").setData(data[i], i);
        }
    }
});
