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

import * as SFS2X from "sfs2x-api";

var gatewaySFS=null;

cc.Class({
    extends: cc.Component,

    properties: {
        nLoadedScenes : cc.Integer,     // 로딩된 화면수
        nTotalAssets : 722,             // 게임에 이용된 전체 asset수
        nLoadedAssets : [],
        cpLoadingProgress : cc.ProgressBar, 
        clLoadingPercent : cc.Label,
        strErrorMessage : cc.String,
        bgAnim: cc.Animation,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        var gatewaySFS =cc.globals.engine.gatewaySFS;

        
        var self = this;
        this.strErrorMessage = "";
        this.nLoadedScenes = 0;
        this.nLoadedAssets = [0,0];
        this.updateProgress(0);

        this.bgAnim.play('loadingscene');
        // 로비 화면을 로딩한다.
        cc.director.preloadScene("lobby",
            function(completedCount, totalCount){
                Logger.log2(self, "lobby화면 completed:" + completedCount.toString() + ", total:" + totalCount.toString());
                self.nLoadedAssets[1] = completedCount;
            }, 
            function(err){
                if(err == null) { // 성공
                    self.nLoadedScenes++;
                } else {
                    self.strErrorMessage = err.toString();
                }
            });
        // 게임장화면을 로딩한다.
        cc.director.preloadScene("gameroom",
            function(completedCount, totalCount){
                Logger.log2(self, "gameroom화면 completed:" + completedCount.toString() + ", total:" + totalCount.toString());
                self.nLoadedAssets[2] = completedCount;
            }, 
            function(err){
                if(err == null) { // 성공
                    self.nLoadedScenes++;
                } else {
                    self.strErrorMessage = err.toString();
                }
            });
    },

    // onLogin : function(event){
    //     var self = this;
    //     cc.log("HoolaGame server login success");
        
    //     // 로비 화면을 로딩한다.
    //     cc.director.preloadScene("lobby",
    //     function(completedCount, totalCount){
    //         Logger.log2(self, "lobby화면 completed:" + completedCount.toString() + ", total:" + totalCount.toString());
    //         self.nLoadedAssets[1] = completedCount;
    //     }, 
    //     function(err){
    //         if(err == null) { // 성공
    //             self.nLoadedScenes++;
    //         } else {
    //             self.strErrorMessage = err.toString();
    //         }
    //     });
    // // 게임장화면을 로딩한다.
    // cc.director.preloadScene("gameroom",
    //     function(completedCount, totalCount){
    //         Logger.log2(self, "gameroom화면 completed:" + completedCount.toString() + ", total:" + totalCount.toString());
    //         self.nLoadedAssets[2] = completedCount;
    //     }, 
    //     function(err){
    //         if(err == null) { // 성공
    //             self.nLoadedScenes++;
    //         } else {
    //             self.strErrorMessage = err.toString();
    //         }
    //     });

    // },

    updateProgress(progress) {
        this.cpLoadingProgress.progress = progress;
        this.clLoadingPercent.string = cc.globals.engine.stringTable('loading.percent') + " [ " + Math.floor(progress * 10) + "/10 ]";
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
        Logger.log("로딩된 에세수" + curLoaded);
        var progress = curLoaded / this.nTotalAssets;
        if(progress > 1.0)
            progress = 1.0;

        this.updateProgress(progress);
        
        if(this.nLoadedScenes >= 2) {
            // 모든 화면이 로딩이 끝나면 로비화면으로 넘어간다.
            cc.director.loadScene("lobby");
        }
    },

    
   

    

   
});
