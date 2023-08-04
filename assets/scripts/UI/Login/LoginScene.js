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

var gatewaySFS = null;
var bLogin = false;

cc.Class({
    extends: cc.Component,

    properties: {
        loginid : cc.EditBox,
        loginpwd : cc.EditBox,
        loginform : cc.Node,
        membermodal : cc.Node,
        popup_box:cc.Node,
        loading_box : cc.Node,

        // 회원가입
        m_id: cc.EditBox,
        m_pwd: cc.EditBox,
        m_repwd: cc.EditBox,
        m_safepwd: cc.EditBox,
        m_name: cc.EditBox,
        m_bankname: cc.EditBox,
        m_banknum: cc.EditBox,
        m_bankmaster: cc.EditBox,
        m_tel1: cc.EditBox,
        m_status: cc.Label,
        m_login_status: cc.Label,
        m_partner: cc.EditBox,
    },
    ctor () {
        this.timer = 0;
    },
    // LIFE-CYCLE CALLBACKS:    
    
    onLoad () {
        // 대역 변수들을 설정하다.
        if(cc.globals == null) {
            cc.globals = {};
            this.loginid.setFocus();
            // 게임엔진을 초기화한다.
            cc.globals.engine = new GameEngine.Engine();
            cc.globals.engine.init();
        }
    },

    start () {
        bLogin = false;
        cc.globals.engine.bLoginClicked = false;
        // 게이트웨이 서버 창조.
        // cc.globals.engine.gatewaySFS.connect();
        //  초기가입자설정
        this.loginid.string = '';
        this.loginpwd.string = '';
        // 엔진 이벤트 처리부를 등록한다.
        cc.globals.engine.addEventListener(this.onGameEngineEventHandler, this);
    },

     update (dt) {
         if(cc.globals.engine.gatewaySFS != null){
            if(cc.globals.engine.gatewaySFS.isConnected){
                if(cc.globals.engine.gatewaySFS.mySelf != null){
                    this.timer += dt;
                    
                    if ( this.timer >= 25.0 ) {
                    this.timer = 0;
                    cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("blank", null));
                    }
                }
            }
         }
        
    },
     init(){
        var config = {};
        config.host = cc.globals.engine.gatewayIP;
        config.port = cc.globals.engine.gatewayPort;
        config.zone = "HoolaGame";
        config.debug = true;
        gatewaySFS = new SFS2X.SmartFox(config);
        cc.globals.engine.gatewaySFS = gatewaySFS;
            // 엔진 이벤트 처리부를 등록한다.
        cc.globals.engine.gatewaySFS.addEventListener(SFS2X.SFSEvent.CONNECTION, this.onConnection, this);
        cc.globals.engine.gatewaySFS.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, cc.globals.engine.onConnectionLost, this);
        cc.globals.engine.gatewaySFS.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, this.onLoginError, this);
        cc.globals.engine.gatewaySFS.addEventListener(SFS2X.SFSEvent.LOGIN, this.onLogin, this);
        cc.globals.engine.gatewaySFS.addEventListener(SFS2X.SFSEvent.LOGOUT, this.onLogout, this);
        cc.globals.engine.gatewaySFS.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, cc.globals.engine.onGatewayResponse);
        
    },

    // 게임엔진 이벤트 처리부
    onGameEngineEventHandler : function(evt) {
        Logger.log2(this, '게임엔진 이벤트 코드 - ' + evt.type);
        switch(evt.type) {
            case GameEngine.Events.LOGIN_SUCCESSED:{
                // 로그인 성공이면 로비화면으로 넘어간다.
                //this.loading_box.getComponent("Loading").stopLoading();
                cc.director.loadScene('loading');
                break;
            }
            case GameEngine.Events.LOGIN_FAILED:{
                this.loading_box.getComponent("Loading").stopLoading();
                // 로그인에 실패
                if(evt.code == 0)
                {
                    //this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.cannot_connect_server'));
                    this.m_status.string = cc.globals.engine.stringTable('msg.cannot_connect_server');
                }
                else if(evt.code == 1)
                {
                    //this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.dismatch_id_pwd'));
                    this.m_status.string = cc.globals.engine.stringTable('msg.dismatch_id_pwd');
                }
                else if(evt.code == 2) {
                    //this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.already_login'));
                    this.m_status.string = cc.globals.engine.stringTable('msg.already_login');
                }
                else if(evt.code == 3) {
                    //this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.permit_disabled'));
                    this.m_status.string = cc.globals.engine.stringTable('msg.permit_disabled');
                }
                else
                {
                    //this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.failed_to_login_server'));
                    this.m_status.string = cc.globals.engine.stringTable('msg.failed_to_login_server');
                }
                break;
            }
            case GameEngine.Events.DISCONNECTED:{
                if(cc.globals.engine.isOnLogin)
                    //this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.disconnected_to_server'));
                    this.m_status.string = cc.globals.engine.stringTable('msg.failed_to_login_server');
                break;
            }
            case GameEngine.Events.MEMBER_REGISTER: {
                var result = evt.result.get("result");
                if(result == 0) {
                    this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.memReg_success'));
                    this.m_status.string = cc.globals.engine.stringTable('msg.memReg_success');
                    this.membermodal.active = false;
                    this.loginform.active = true;
                    this.clearMemberPopup();
                    cc.globals.engine.gatewaySFS.disconnect();
                }
                else if(result == 1) {
                    this.m_status.string = cc.globals.engine.stringTable('msg.memReg_loginidDoubled');
                    //this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.memReg_loginidDoubled'));
                }
                else if(result == 2) {
                    this.m_status.string = cc.globals.engine.stringTable('msg.memReg_nameDoubled');
                    //this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.memReg_nameDoubled'));
                }
                else if(result == 3) {
                    this.m_status.string = cc.globals.engine.stringTable('msg.memReg_partnerMissing');
                    //this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.memReg_partnerMissing'));
                }
                else {
                    this.m_status.string = cc.globals.engine.stringTable('msg.memReg_failed');
                    //this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.memReg_failed'));
                }
                break;
            }
        }
    },
    
    // 로그인을 눌렀을때
    onClickLogin(){
        if(cc.globals.engine.bLoginClicked) return;
        cc.globals.engine.bLoginClicked = true;
        this.init();
        var loginid = this.loginid.string;
        var loginpwd = this.loginpwd.string;

        if(this.loginid.string == ""){
            this.m_login_status.string = cc.globals.engine.stringTable('msg.empty_id');
            //this.popup_box.getComponent('Popup').showMessage(cc.globals.engine.stringTable('msg.empty_id'));
            
            return;
        }
        else if(this.loginpwd.string == "") {
            this.m_login_status.string = cc.globals.engine.stringTable('msg.empty_pwd');
            //this.popup_box.getComponent('Popup').showMessage(cc.globals.engine.stringTable('msg.empty_pwd'));
            
            return;
        }
        else
        {
            bLogin = true;
            
            cc.globals.engine.gatewaySFS.connect();
            
             
        }
    },

    // 회원가입을 눌렀을때
    onClickMember(){
        this.init();
        cc.globals.engine.gatewaySFS.connect();
        this.membermodal.active = true;
        this.loginform.active = false;
        this.m_status.string = "";
    },

    // 닫기단추를 눌렀을때
    onClickClose(){
        if(cc.globals.engine.gatewaySFS.mySelf != null){
            cc.globals.engine.gatewaySFS.send(new SFS2X.LogoutRequest());
        }
        cc.globals.engine.gatewaySFS.disconnect();
        this.membermodal.active = false;
        this.loginform.active = true;
        this.m_status.string = "";
        this.m_login_status.string = "";
        this.clearMemberPopup();
        
    },

    clearMemberPopup() {
        this.m_id.string = "";
        this.m_pwd.string = "";
        this.m_repwd.string = "";
        this.m_name.string = "";
        this.m_bankname.string = "";
        this.m_banknum.string = "";
        this.m_bankmaster.string = "";
        this.m_tel1.string  = "";
        this.m_partner.string = "";  
    },


    

    onClickMemberConfirm() {
        //  입력사항 체크
        
        if(this.m_id.string == ""){
            this.m_status.string = cc.globals.engine.stringTable('msg.empty_id');
            //this.popup_box.getComponent('Popup').showMessage(cc.globals.engine.stringTable('msg.empty_id'));
            return;
        }
        if(this.m_pwd.string == "") {
            this.m_status.string = cc.globals.engine.stringTable('msg.empty_pwd');
            //this.popup_box.getComponent('Popup').showMessage(cc.globals.engine.stringTable('msg.empty_pwd'));
            return;
        }
        if(this.m_pwd.string != this.m_repwd.string){
            this.m_status.string = cc.globals.engine.stringTable('msg.dismatch_pwd_repwd');
            //this.popup_box.getComponent('Popup').showMessage(cc.globals.engine.stringTable('msg.dismatch_pwd_repwd'));
            return;
        }
        if(this.m_safepwd.string == "") {
            this.m_status.string = cc.globals.engine.stringTable('msg.empty_safepwd');
            //this.popup_box.getComponent('Popup').showMessage(cc.globals.engine.stringTable('msg.empty_safepwd'));
            return;
        }
        else{
            if(this.m_safepwd.string.length < 6){
                this.m_status.string = cc.globals.engine.stringTable('msg.dismatch_safepwd_pwd');
                //this.popup_box.getComponent('Popup').showMessage(cc.globals.engine.stringTable('msg.dismatch_safepwd_pwd'));
                return;
            }
        }
        if(this.m_name.string == "") {
            this.m_status.string = cc.globals.engine.stringTable('msg.empty_name');
            //this.popup_box.getComponent('Popup').showMessage(cc.globals.engine.stringTable('msg.empty_name'));
            return;
        }
        if(this.m_bankname.string == "") {
            this.m_status.string = cc.globals.engine.stringTable('msg.empty_bankname');
            //this.popup_box.getComponent('Popup').showMessage(cc.globals.engine.stringTable('msg.empty_bankname'));
            return;
        }
        if(this.m_banknum.string == "") {
            this.m_status.string = cc.globals.engine.stringTable('msg.empty_banknum');
            //this.popup_box.getComponent('Popup').showMessage(cc.globals.engine.stringTable('msg.empty_banknum'));
            return;
        }
        if(this.m_bankmaster.string == "") {
            this.m_status.string = cc.globals.engine.stringTable('msg.empty_bankmaster');
            //this.popup_box.getComponent('Popup').showMessage(cc.globals.engine.stringTable('msg.empty_bankmaster'));
            return;
        }
        if(this.m_tel1.string == "") {
            this.m_status.string = cc.globals.engine.stringTable('msg.empty_tel');
            //this.popup_box.getComponent('Popup').showMessage(cc.globals.engine.stringTable('msg.empty_tel'));
            return;
        }
        if(this.m_partner.string == "") {
            this.m_status.string = cc.globals.engine.stringTable('msg.empty_partner');
            //this.popup_box.getComponent('Popup').showMessage(cc.globals.engine.stringTable('msg.empty_partner'));
            return;
        }
        // if(!cc.globals.engine.gatewaySFS.isConnected){
        //     cc.globals.engine.gatewaySFS.connect();
        // }
        // if(cc.globals.engine.gatewaySFS.mySelf == null){
        //     var param = new SFS2X.SFSObject();
        //     param.putInt("register" ,1);
        //     cc.globals.engine.gatewaySFS.send(new SFS2X.LoginRequest("sfs_register", "", null, "HoolaGame", param));
        // }
        
            
        // var data = {};
        // data.id = this.m_id.string;
        // data.pwd = this.m_pwd.string;
        // data.repwd = this.m_repwd.string;
        // data.name = this.m_name.string;
        // data.bankname = this.m_bankname.string;
        // data.banknum = this.m_banknum.string;
        // data.bankmaster = this.m_bankmaster.string;
        // data.tel = this.m_tel1.string + this.m_tel2.string + this.m_tel3.string;
        // data.partner = this.m_partner.string;
        
        var params = new SFS2X.SFSObject();
        params.putUtfString("id", this.m_id.string);
        params.putUtfString("pwd", this.m_pwd.string);
        params.putUtfString("safepwd", this.m_safepwd.string);
        params.putUtfString("name", this.m_name.string);
        params.putUtfString("bankname", this.m_bankname.string);
        params.putUtfString("banknum", this.m_banknum.string);
        params.putUtfString("bankmaster", this.m_bankmaster.string);
        params.putUtfString("tel", this.m_tel1.string);
        params.putUtfString("partner", this.m_partner.string);
        this.m_status.string = "";
        cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("registerMember", params));

        
        
        
        
        //cc.globals.engine.registerMember(data);
    },

    onConnection : function(event){
        if(event.success){
            cc.log("Connected to gateway Server");
            if(bLogin) {
                var loginid = this.loginid.string;
                var loginpwd = this.loginpwd.string;
                var param = new SFS2X.SFSObject();
                param.putUtfString("version" ,cc.globals.engine.version);
                cc.log(param.getDump());
                ///Send Login request to smartServer///
                cc.globals.engine.gatewaySFS.send(new SFS2X.LoginRequest(loginid,loginpwd, param, "HoolaGame"));
            }
            else{
                var param = new SFS2X.SFSObject();
                param.putUtfString("version" ,cc.globals.engine.version);
                param.putInt("register" ,1);
                cc.globals.engine.gatewaySFS.send(new SFS2X.LoginRequest("sfs_register" + Math.random(100000), "", param, "HoolaGame"));
            }
        }
        else{
           this.m_login_status.string = cc.globals.engine.stringTable('msg.cannot_connect_server');
           //this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.cannot_connect_server'));
            cc.log("Connect to gateway Server Error");
        }
        
    },
    onLogin : function(event){

        var user = event.user;
        if(user.name.indexOf("sfs_register") > -1) return;
        cc.log("로그인 성공");
        cc.globals.engine.bLoginClicked = false;
        var userVars = [];
        userVars.push(new SFS2X.SFSUserVariable("bPlayer", false));
        cc.globals.engine.gatewaySFS.send(new SFS2X.SetUserVariablesRequest(userVars));
        //cc.globals.engine.gatewaySFS.send(new SFS2X.ExtensionRequest("getUserData", null));
        cc.director.loadScene('loading'); 
        
        // Remove SFS2X listeners
		// This should be called when switching scenes, so events from the server do not trigger code in this scene
        
        
        
    },
    onLoginError : function(event){
        var error =  event.errorCode ;
        Logger.log(error);
        cc.globals.engine.bLoginClicked = false;
        if(error == 3 || error == 2){
            this.loading_box.getComponent("Loading").stopLoading();
            this.m_login_status.string = cc.globals.engine.stringTable('msg.dismatch_id_pwd');
            //this.popup_box.getComponent("Popup").showMessage(cc.globals.engine.stringTable('msg.dismatch_id_pwd'));
         }       
        if(error == 6){
            this.loading_box.getComponent("Loading").stopLoading();
            this.m_login_status.string = cc.globals.engine.stringTable('msg.already_login');
            // this.popup_box.getComponent('Popup').showMessage(cc.globals.engine.stringTable('msg.already_login'));
        }
        if(error == 10){
            this.loading_box.getComponent("Loading").stopLoading();
            this.m_login_status.string = cc.globals.engine.stringTable('msg.permit_disabled');
            // this.popup_box.getComponent('Popup').showMessage(cc.globals.engine.stringTable('msg.permit_disabled'));
        }
        if(error == 9){
            this.loading_box.getComponent("Loading").stopLoading();
            this.m_login_status.string = cc.globals.engine.stringTable('msg.remove_cache');
            // this.popup_box.getComponent('Popup').showMessage(cc.globals.engine.stringTable('msg.permit_disabled'));
        }
        cc.globals.engine.gatewaySFS.disconnect();
        // Disconnect
        // Remove SFS2X listeners
		// This should be called when switching scenes, so events from the server do not trigger code in this scene
        
        
    },
    onLogout : function(event){
        cc.log("게이트웨이 로그 아웃");
    }





});
