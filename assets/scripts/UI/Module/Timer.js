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
    extends: cc.Component,

    properties: {
        light: cc.Node,
        front: cc.Node,
        timeLeft : 0.0,
        timerEnabled : false,
        timeOut : 0.0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.timeLeft = 0.0;
    },

    start () {
        
    },

    update (dt) {
        if(this.timerEnabled == false)
            return;

        this.timeLeft = this.timeLeft - dt;

        if(this.timeLeft < 0) {
            this.timeLeft = 0.0;
            this.stopTimer();
        }
        var width = this.node.width;
        var frontwidth = this.timeLeft / this.timeOut * width;
        this.front.width = frontwidth;
        this.light.x = frontwidth;
    },

    stopTimer() {
        this.timerEnabled = false;
        this.node.active = false;
    },

    startTimer(pos, seconds) {
        this.node.active = true;

        this.timeLeft = seconds;
        this.timeOut = seconds;
        this.timerEnabled = true;

        this.node.setPosition(pos);
    },
});
