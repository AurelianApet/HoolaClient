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
        avatars:[cc.SpriteFrame],
        avatar_ellipse: {
            default: null,
            type: cc.Prefab,
        },
        avatar_user: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var avatar_count = 12;
        var container = cc.find('container', this.node);

        for(var i = 0; i < avatar_count; i ++)
        {
            var ellipse = cc.instantiate(this.avatar_ellipse);
            ellipse.parent = container;
            ellipse.name = 'ellipse' + (i + 1);
            ellipse.setPosition(-420 + (i % 6) * 165, 100-180 * Math.floor(i / 6));  

            var avatar = new cc.Node('avatar' + (i + 1));
            var sp = avatar.addComponent(cc.Sprite);
            sp.spriteFrame = this.avatars[i];
            avatar.parent = container;
            avatar.setPosition(-420 + (i % 6) * 165, 100-180 * Math.floor(i / 6));
        }
    },

    // update (dt) {},
    onClickExitButton() {
        this.node.active = false;
    },
    onClickAvatar() {
        var selected = 0;
        for(var i = 0; i < 12; i ++){
            var avatar = cc.find('container/ellipse' + (i + 1), this.node);
            if(avatar.getComponent(cc.Toggle).isChecked)break;
        }
        selected = i;
        this.avatar_user.getComponent(cc.Sprite).spriteFrame = this.avatars[selected];
        this.avatar_user.width = 74;
        this.avatar_user.height = 74;
        this.node.active = false;

        cc.globals.engine.myUserData.avatar = i + 1;
        cc.globals.engine.changeAvatar(i + 1);
    }
});
