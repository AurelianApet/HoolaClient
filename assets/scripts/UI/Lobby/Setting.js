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
        backon : cc.Toggle,
        effecton : cc.Toggle,
        voiceon : cc.Toggle,
        backoff : cc.Toggle,
        effectoff : cc.Toggle,
        voiceoff : cc.Toggle,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        cc.log("back::::" + cc.globals.engine.bBackSound);
        if(cc.globals.engine.bBackSound == 1){
            this.backon.isChecked = true;
            this.backoff.isChecked = false;
        }
        else{
            this.backon.isChecked = false;
            this.backoff.isChecked = true;
        }
        if(cc.globals.engine.bEffectSound == 1){
            this.effecton.isChecked = true;
            this.effectoff.isChecked = false;
        }
        else{
            this.effecton.isChecked = false;
            this.effectoff.isChecked = true;
        }
        if(cc.globals.engine.bVoice == 1){
            this.voiceon.isChecked = true;
            this.voiceoff.isChecked = false;
        }
        else{
            this.voiceon.isChecked = false;
            this.voiceoff.isChecked = true;
        }
      
    },

    // update (dt) {},
    onClickExitButton() {
        this.node.active = false;
    },

    onChangeBackSound(e, param) {
        cc.globals.engine.bBackSound = param;
        cc.globals.engine.bChangeSetting = true;
        
    },

    onChangeEffectSound(e, param) {
        cc.globals.engine.bEffectSound = param;
        
    },

    onChangeVoice(e, param) {
        cc.globals.engine.bVoice = param;
    }
});
