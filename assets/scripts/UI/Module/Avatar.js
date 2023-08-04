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
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.clearAvatar();
    },

    // update (dt) {},

    clearAvatar() {
        this.node.getComponent(cc.Sprite).spriteFrame = null;
        //this.node.parent.active = false;
    },

    setAvatar(avatar) {
        this.node.parent.active = true;
        Logger.log2(this, '아바타 로딩 - 번호 : ' + avatar);
        cc.loader.loadRes("texture/avatar/avatar"+ avatar, cc.SpriteFrame, function (err, spriteFrame) {
            this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            this.node.width = this.node.height = 65;
        }.bind(this)) ;
    }
});
