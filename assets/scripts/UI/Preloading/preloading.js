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
        nLoadedScenes : cc.Integer,     // 로딩된 화면수
        nTotal : 112,             // 게임에 이용된 전체 asset수
        nLoadedAssets : [],
        clLoadingPercent : cc.Label,
        strErrorMessage : cc.String,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        this.strErrorMessage = "";
        this.nLoadedScenes = 0;
        this.nLoadedAssets = [0,0];
        this.updateProgress(0);

        
        // 로그인 화면을 로딩한다.
        cc.director.preloadScene("login",
            function(completedCount, totalCount){
                Logger.log2(self, "login화면 completed:" + completedCount.toString() + ", total:" + totalCount.toString());
                self.nLoadedAssets[0] = completedCount;
            }, 
            function(err){
                if(err == null) { // 성공
                    self.nLoadedScenes++;
                } else {
                    self.strErrorMessage = err.toString();
                }
            });
        // 로딩 화면을 로딩한다.
        cc.director.preloadScene("loading",
            function(completedCount, totalCount){
                Logger.log2(self, "loading화면 completed:" + completedCount.toString() + ", total:" + totalCount.toString());
                self.nLoadedAssets[1] = completedCount;
            }, 
            function(err){
                if(err == null) { // 성공
                    self.nLoadedScenes++;
                } else {
                    self.strErrorMessage = err.toString();
                }
            });
    },

    updateProgress(progress) {
        this.clLoadingPercent.string = Math.floor(progress * 100) + "%";
    },

    update(dt) {
        // 로딩중 오류가 있으면 로딩메시지 표시
        if(this.strErrorMessage.length > 0) {
            this.clLoadingPercent.string = this.strErrorMessage;
            return;
        }
        
        // 현재까지 로딩된 에셋수
        var curLoaded = 0;
        for(var i=0; i<this.nLoadedAssets.length; i++) {
            curLoaded += this.nLoadedAssets[i];
        }
        // 현재 로딩퍼센트를 계산한다.
        var progress = curLoaded / this.nTotal;
        if(progress > 1.0)
            progress = 1.0;

        this.updateProgress(progress);
        
        if(this.nLoadedScenes >= 2) {
            // 모든 화면이 로딩이 끝나면 로그인화면으로 넘어간다.
            cc.director.loadScene("login");
        }
    }
});
