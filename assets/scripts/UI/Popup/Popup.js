// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lbl_message : cc.Label,
        //fnOnOkClick : null,
        background: cc.Sprite,
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        

    },

    start () {
        
    },
    
    // update (dt) {},
    

    onConfirmButtonClicked() {
            
        this.node.active = false;
        if(this.fnOnOkClick != null && this.fnOnOkClick != undefined)
            this.fnOnOkClick.call();
    },

    showMessage (msg, onokclick) {
        this.fnOnOkClick = onokclick;
        this.node.active = true;
        this.lbl_message.string = msg;
        
    },
});
