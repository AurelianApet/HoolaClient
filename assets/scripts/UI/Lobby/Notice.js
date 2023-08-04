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
var GameEngine = require("GameEngine");

cc.Class({
    extends: cc.Component,

    properties: {
        noticelist: cc.Node,
        noticeview: cc.Node,
        viewEnv: false,

        list: cc.Node,
        listitems : {
            default : [],
            tooltip : ""
        },

        viewTitle: cc.Label,
        viewContent: cc.Label,
        viewRegdate: cc.Label,

        listitemPrefab:cc.Prefab,
        
        noticeCount: 0,

        noticeItemBack:[cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.viewEnv = false;
        
        
    },

    // update (dt) {},

    clearNoticeList() {
        // 방리스트를 삭제한다.
        this.list.removeAllChildren();
        this.listitems = [];
        this.listitems.length = 0;
        this.noticeCount = 0;
    },
    onClickExitButton() {
        this.node.active = false;
        this.noticeview.active = false;
        this.noticelist.active = true;
        this.viewEnv = false;
    },
    
    onClickConfirmButton() {
        if(!this.viewEnv)
            this.node.active = false;
        else {
            this.noticeview.active = false;
            this.noticelist.active = true;
            this.viewEnv = false;
        }
    },

    onSelectNotice(title, date, content){
        this.noticeview.active = true;
        this.noticelist.active = false;
        this.viewEnv = true;
        Logger.log("onSelectNotice : title-> " + title);
        this.viewTitle.string = title;
        this.viewContent.string = content;
        this.viewRegdate.string = date;
    },

    onOpenNoticeList() {
        this.node.active = true;
        this.clearNoticeList();
        this.viewEnv = false;
        cc.globals.engine.addEventListener(this.onGameEngineEventHandler, this);
        cc.globals.engine.loadNotice();
    },

    onUpdateNotice(data) {
        this.noticeCount++;
        var item = cc.instantiate(this.listitemPrefab).getComponent("NoticeItem");
        var time = new Date(data.get("regdate"));
        Logger.log(data.get("title"));
        item.title.string = data.get("title");
        item.content = data.get("content");
        item.regdate.string = time.getFullYear() + "." + time.getMonth() + "." + time.getDate();
        item.No.string = this.noticeCount;
        item.noticeController = this.node;  
        item.node.getComponent(cc.Sprite).spriteFrame = this.noticeItemBack[this.noticeCount % 2];
        this.list.addChild(item.node);
    },


    // 게임엔진 이벤트 처리부
    onGameEngineEventHandler (evt) {

        switch(evt.type) {
            case GameEngine.Events.LOAD_NOTICE:{
                this.onUpdateNotice(evt.data);
                break;
            }
        }
    },
});
