var constants = require('HoolaConstants');
cc.Class({
    extends: cc.Component,

    properties: {
        cardNumber: 0,  //  카드번호
        isSelected: false,  //  카드가 선택되었는가
        highlight: cc.Node, //  카드가 선택되었을때 뒤배경
        texBack: cc.SpriteFrame,    //  카드뒤면
        texJoker: cc.SpriteFrame,   //  조커카드
        texCard: [cc.SpriteFrame],  //  카드이미지
        isOpened : true,    //  앞뒤면(true = 앞면, false = 뒤면)
        AudioSource: cc.AudioSource,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    //  카드설정
    setCard(num) {
        this.cardNumber = num;
        this.updateSprite();
    },

    //  카드 열림상태결정
    openCard(opened) {
        this.isOpened = opened;
        this.updateSprite();
    },

    //  카드그림 갱신하기
    updateSprite() {
        if(this.isOpened == true) {
            if(this.cardNumber >= 1 && this.cardNumber <= 52) {
                this.node.getComponent(cc.Sprite).spriteFrame = this.texCard[this.cardNumber - 1];  
                return;
            }
        }
        this.node.getComponent(cc.Sprite).spriteFrame = this.texBack;  
    },

    // update (dt) {},

    releaseTouchEvent() {
        this.node.off('touchend', this.onTouchUp, this);
    },

    setupTouchEvent() {
        this.cvPosition = this.node.getPosition();
        this.node.on('touchend', this.onTouchUp, this);
    },

    onTouchUp(evt) {
        //카드클릭 음성 출력
        this.AudioSource = new cc.AudioSource();
        cc.loader.loadRes("audio/cards/cardclick", cc.AudioClip, function (err, audioClip) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            
            this.AudioSource.clip = audioClip;
            if(cc.globals.engine.bEffectSound == 1) this.AudioSource.play();
        }.bind(this)) ;

        this.node.stopAllActions();
        var endpos;
        if(this.isSelected == false) {
            endpos = new cc.Vec2(this.cvPosition.x, this.cvPosition.y + 10);
            this.isSelected = true;
            this.highlight.active = true;
        } else {
            endpos = new cc.Vec2(this.cvPosition.x, this.cvPosition.y);
            this.isSelected = false;
            this.highlight.active = false;
        }
        this.node.runAction(cc.moveTo(0.1, endpos).easing(cc.easeElasticOut()));
    },
    releaseCard(){
        var endpos = new cc.Vec2(this.cvPosition.x, this.cvPosition.y);
        this.isSelected = false;
        this.highlight.active = false;
        this.node.runAction(cc.moveTo(0.1, endpos).easing(cc.easeElasticOut()));
    }
});
