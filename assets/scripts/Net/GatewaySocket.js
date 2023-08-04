// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var Logger = require("Logger");
var GameSocket = require("GameSocket");
var GamePacket = require("GamePacket");

var PacketIDs = cc.Enum({
    LOGIN: 1,               // 로그인
    USERDATA: 2,            // 유저정보
    USERMONEY: 3,           // 유저머니
    CHANGE_AVATAR: 4,       // 아바타변경
    SELECT_GAME: 5,         // 게임선택
    CHANNEL_DATA: 6,           // 방정보
    LOAD_NOTICE: 7,         //  공지목록읽기
    UPDATE_CHANNEL_PLAYERS: 8,   //  채널안에서 플레이중인 유저수
    ENTER_SAFE: 9,          //  금고열기
    EXCHANGE_SAFEMONEY: 10,     //  금고머니 보관/전환
    CHARGE_MONEY: 11,       //  머니충전
    DISCHARGE_MONEY: 12,    //  머니환전
    MEMBER_REGISTER: 13,    //  회원가입
    CHARGE_BANKINFO: 14,    //  충전하기에서 필요한 입금계좌, 입금자명, 연락처
    DISCHARGE_BANKINFO: 15,    //  충전하기에서 필요한 입금계좌, 입금자명, 연락처
    CHANGE_SAFEPWD: 16,     //  금고비번 수정
    CHARGE_RESULT: 17,      //  충전요청 승인/취소 결과
    DISCHARGE_RESULT: 18,   //  환전요청 승인/취소 결과
    CHAT : 19               //  1:1문의 채팅내용
 });

var GatewaySocket = cc.Class({
    extends: GameSocket.Socket,

    properties: {
        
    },

    
    // 생성자
    ctor () {
        this.registerPacketProcess(PacketIDs.LOGIN, this.procLogin, this);
        this.registerPacketProcess(PacketIDs.USERDATA, this.procUserData, this);
        this.registerPacketProcess(PacketIDs.USERMONEY, this.procUserMoney, this);
        this.registerPacketProcess(PacketIDs.SELECT_GAME, this.procSelectGame, this);
        this.registerPacketProcess(PacketIDs.CHANNEL_DATA, this.procChannelData, this);
        this.registerPacketProcess(PacketIDs.CHARGE_MONEY, this.procChargeMoney, this);
        this.registerPacketProcess(PacketIDs.DISCHARGE_MONEY, this.procDischargeMoney, this);
        this.registerPacketProcess(PacketIDs.LOAD_NOTICE, this.procLoadNotice, this);
        this.registerPacketProcess(PacketIDs.UPDATE_CHANNEL_PLAYERS, this.procUpdateChannelPlayers, this);
        this.registerPacketProcess(PacketIDs.ENTER_SAFE, this.procEnterSafe, this);
        this.registerPacketProcess(PacketIDs.EXCHANGE_SAFEMONEY, this.procExchangeSafeMoney, this);
        this.registerPacketProcess(PacketIDs.MEMBER_REGISTER, this.procMemberRegister, this);
        this.registerPacketProcess(PacketIDs.CHARGE_BANKINFO, this.procChargeBankInfo, this);
        this.registerPacketProcess(PacketIDs.DISCHARGE_BANKINFO, this.procDischargeBankInfo, this);
        this.registerPacketProcess(PacketIDs.CHANGE_SAFEPWD, this.procChangeSafePwd, this);
        this.registerPacketProcess(PacketIDs.CHARGE_RESULT, this.procChargeResult, this);
        this.registerPacketProcess(PacketIDs.DISCHARGE_RESULT, this.procDischargeResult, this);
        this.registerPacketProcess(PacketIDs.CHAT, this.procChat, this);
    },

    start () {

    },

    // update (dt) {},
    // 게이트웨이에 로그인한다.
    doLogin (id, pwd) {
        Logger.log2(this, "로그인요청 id=" + id + ",pwd=" + pwd);
        // 로그인 패킷을 전송한다.
        var packet = new GamePacket.Packet(PacketIDs.LOGIN);
        packet.writeString(id);
        packet.writeString(pwd);
        this.sendPacket(packet);
    },

    doMemberRegister(data) {
        Logger.log2(this, "회원가입 id=" + data.id + ", pwd=" + data.pwd);
        var packet = new GamePacket.Packet(PacketIDs.MEMBER_REGISTER);
        packet.writeString(data.id);
        packet.writeString(data.pwd);
        packet.writeString(data.repwd);
        packet.writeString(data.name);
        packet.writeString(data.bankname);
        packet.writeString(data.banknum);
        packet.writeString(data.bankmaster);
        packet.writeString(data.tel);
        packet.writeString(data.partner);
        this.sendPacket(packet);
    },

    // 아바타 변경요청
    doChangeAvatar(avatar) {
        Logger.log2(this, "아바타변경요청 avatar=" + avatar);
        var packet = new GamePacket.Packet(PacketIDs.CHANGE_AVATAR);
        packet.writeInt32(avatar);
        this.sendPacket(packet);
    },

    // 게임선택 요청-방목록 요청
    doSelectGame(gameid) {
        var packet = new GamePacket.Packet(PacketIDs.SELECT_GAME);
        packet.writeString(gameid);
        this.sendPacket(packet);
    },

    doLoadNotice() {
        var packet = new GamePacket.Packet(PacketIDs.LOAD_NOTICE);
        this.sendPacket(packet);
    },

    doEnterSafe(password) {
        var packet = new GamePacket.Packet(PacketIDs.ENTER_SAFE);
        packet.writeString(password);
        this.sendPacket(packet);
    },
    doChangeSafePwd(pwd) {
        var packet = new GamePacket.Packet(PacketIDs.CHANGE_SAFEPWD);
        packet.writeString(pwd);
        this.sendPacket(packet);
    },

    doExchangeSafeMoney(money, flag) {
        var packet = new GamePacket.Packet(PacketIDs.EXCHANGE_SAFEMONEY);
        packet.writeInt32(money);
        packet.writeByte(flag);
        this.sendPacket(packet);
    },

    doChargeMoney(data) {
        var packet = new GamePacket.Packet(PacketIDs.CHARGE_MONEY);
        packet.writeString(data.account);
        packet.writeString(data.name);
        packet.writeInt32(data.money);
        packet.writeString(data.tel);
        this.sendPacket(packet);
    },
    doDischargeMoney(data) {
        var packet = new GamePacket.Packet(PacketIDs.DISCHARGE_MONEY);
        packet.writeString(data.account);
        packet.writeString(data.name);
        packet.writeInt32(data.money);
        packet.writeString(data.tel);
        this.sendPacket(packet);
    },

    doChargeBankInfo() {
        var packet = new GamePacket.Packet(PacketIDs.CHARGE_BANKINFO);
        this.sendPacket(packet);
    },
    doDischargeBankInfo() {
        var packet = new GamePacket.Packet(PacketIDs.DISCHARGE_BANKINFO);
        this.sendPacket(packet);
    },
    sendChat(text) {
        Logger.log2(this, "채팅요청 :" + text);
        // 채팅 패킷을 전송한다.
        var packet = new GamePacket.Packet(PacketIDs.CHAT);
        packet.writeString(text);
        this.sendPacket(packet);
    },

    // 로그인 응답 처리부
    procLogin(packet) {
        var data = {};
        data.result = packet.readByte();
        console.log(data);
        return data;
        /*
        if(result == 0)
        {
            // 로그인 성공
            this.node.emit(GatewaySocketEvents.LOGIN_SUCCESSED, {type:GatewaySocketEvents.LOGIN_SUCCESSED});
        }
        else
        {
            // 로그인 실패
            this.node.emit(GatewaySocketEvents.LOGIN_FAILED, {type:GatewaySocketEvents.LOGIN_FAILED, code:result});
            // 소켓을 차단한다.
            this._wsSocket.close();
        }
        Logger.log2(this, "로그인응답 = " + result);*/
    },

    // 유저정보 응답 처리부
    procUserData(packet) {
        var data = {};
        data.name = packet.readString();
        data.avatar = packet.readInt32();
        data.playCnt = packet.readInt32();
        data.winCnt = packet.readInt32();
        //data.tel = packet.readString();
        //data.bankname = packet.readString();
        //data.banknum = packet.readString();
        //data.bankmaster = packet.readString();
        Logger.log2(this, "유저정보 응답 - name=" + data.name + ",avatar=" + data.avatar + ",playCnt=" + data.playCnt + ",winCnt=" + data.winCnt);
        return data;
    },

    // 유저머니 처리부
    procUserMoney(packet) {
        var data = {};
        
        data.gamemoney = packet.readString();
        data.safemoney = packet.readString();
        //data.modified = pacekt.readByte();
        Logger.log2(this, "유저머니 응답 - gamemoney=" + data.gamemoney + ",safemoney=" + data.safemoney + ",takebackmoney=" + data.takebackmoney);
        return data;
    },

    // 게임선택
    procSelectGame(packet) {
        var data = {};
        data.serverip = packet.readString();
        data.serverport = packet.readInt32();
        data.sessionid = packet.readString();
        data.chatip = packet.readString();
        data.chatport = packet.readInt32();
        return data;
    },

    // 방정보 처리부
    procChannelData(packet) {
        var data = {};
        data.uid = packet.readInt32();
        data.chip_level_name = packet.readString();
        data.chip_level = packet.readInt64();
        data.min_money = packet.readString();
        data.chip_level_image = packet.readString();
        data.game_mode = packet.readInt32();
        data.num_playing_users = packet.readInt32();
        return data;
    },

    procLoadNotice(packet) {
        var data = {};
        data.title = packet.readString();
        data.content = packet.readString();
        data.regdate = packet.readString();
        return data;
    },

    procUpdateChannelPlayers(packet) {
        var data = {};
        data.gatewayUsers = packet.readInt32();
        data.betting = packet.readInt64Array();
        data.count = packet.readByteArray();
        return data;
    },

    procEnterSafe(packet) {
        var data = {};
        data.result = packet.readByte();
        return data;
    },

    procExchangeSafeMoney(packet) {
        var data = {};
        data.result = packet.readByte();
        data.gamemoney = packet.readString();
        data.safemoney = packet.readString();
        return data;
    },

    procChargeMoney(packet) {
        var data = {};
        data.result = packet.readByte();
        return data;
    },

    procDischargeMoney(packet) {
        var data = {};
        data.result = packet.readInt32();
        return data;
    },

    procMemberRegister(packet) {
        var data = {};
        data.result = packet.readByte();
        return data;
    },
    procChargeBankInfo(packet) {
        var data = {};
        data.result = packet.readByte();
        data.account = packet.readString();
        data.account_name = packet.readString();
        data.tel = packet.readString();
        return data;
    },
    procDischargeBankInfo(packet) {
        var data = {};
        data.result = packet.readByte();
        data.account = packet.readString();
        data.account_name = packet.readString();
        data.tel = packet.readString();
        return data;
    },

    procChangeSafePwd(packet) {
        var data = {};
        data.result = packet.readByte();
        return data;
    },

    procChargeResult(packet) {
        var data = {};
        data.result = packet.readByte();
        data.money = packet.readString();
        return data;
    },

    procDischargeResult(packet) {
        var data = {};
        data.result = packet.readByte();
        data.money = packet.readString();
        return data;
    },

    procChat(packet) {
        var data = {};
        data.chat = packet.readString();
        return data;
    }
});

module.exports = {
    Socket: GatewaySocket,
    PacketIDs: PacketIDs,
};