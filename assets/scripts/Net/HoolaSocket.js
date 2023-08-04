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
var GameSocket = require("GameSocket");
var GamePacket = require("GamePacket");

var PacketIDs = cc.Enum({
    LOGIN: 1,           // 로그인
    GAME_READY: 2,      // 게임준비상태 알림
    PLAYER_DATA: 3,     // 플레이어가 게임방에 입장
    ROOM_ENTER: 7,      // 게임방입장
    ROOM_OUT: 8,        // 플레이어가 게임방에서 탈퇴
    GAME_START: 9,      // 게임시작
    DEALING_CARDS: 12,  // 딜링카드정보
    REGISTER_CARDS: 13, // 카드내기정보
    ROOM_RESET: 14,     // 게임장 재설정(결과후)
    GAME_RESULT: 18,     // 게임결과
    UPDATE_CARDS: 19,   //  카드정보갱신
    REGISTER_TURN: 20,  //  카드낼순서
    PASS_CARD: 21,      //  패스
    REGISTER_READY: 22,  //  카드를 낼 준비완료,
    EMOTION_SOUND: 23,  //  감정보이스 플레이
    ROOM_MOVE: 24,      //  방이동
 });

var HoolaSocket = cc.Class({
    extends: GameSocket.Socket,

    properties: {
        
    },

    // 생성자
    ctor () {
        this.registerPacketProcess(PacketIDs.LOGIN, this.procLogin, this);
        this.registerPacketProcess(PacketIDs.PLAYER_DATA, this.procPlayerData, this);
        this.registerPacketProcess(PacketIDs.ROOM_ENTER, this.procRoomEnter, this);
        this.registerPacketProcess(PacketIDs.ROOM_OUT, this.procRoomOut, this);
        this.registerPacketProcess(PacketIDs.GAME_START, this.procGameStart, this);
        this.registerPacketProcess(PacketIDs.DEALING_CARDS, this.procDealingCards, this);
        this.registerPacketProcess(PacketIDs.REGISTER_CARDS, this.procRegisterCards, this);
        this.registerPacketProcess(PacketIDs.ROOM_RESET, this.procRoomReset, this);
        this.registerPacketProcess(PacketIDs.GAME_RESULT, this.procGameResult, this);
        this.registerPacketProcess(PacketIDs.UPDATE_CARDS, this.procUpdateCards, this);
        this.registerPacketProcess(PacketIDs.REGISTER_TURN, this.procRegisterTurn, this);
        this.registerPacketProcess(PacketIDs.EMOTION_SOUND, this.procEmotionSound, this);
        this.registerPacketProcess(PacketIDs.ROOM_MOVE, this.procRoomMove, this);
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

     // 게임서버에 로그인한다.
     doLogin (sessionid) {
        Logger.log2(this, "로그인 요청 sessionid=" + sessionid);

        var packet = new GamePacket.Packet(PacketIDs.LOGIN);
        packet.writeString(sessionid);
        this.sendPacket(packet);
    },

    // 게임방에 입장한다.
    doEnterRoom(betting) {      
        Logger.log2(this, "방입장 요청 betting=" + betting);
        var packet = new GamePacket.Packet(PacketIDs.ROOM_ENTER);
        packet.writeInt32(-1);
        packet.writeInt32(betting);
        this.sendPacket(packet);
    },

    // 게임준비상태 알림
    doGameReady() {
        var packet = new GamePacket.Packet(PacketIDs.GAME_READY);
        this.sendPacket(packet);
    },


    // 방나가기 요청을 한다.
    doRoomOut() {
        var packet = new GamePacket.Packet(PacketIDs.ROOM_OUT);
        this.sendPacket(packet);
    },

    doRoomMove() {
        var packet = new GamePacket.Packet(PacketIDs.ROOM_MOVE);
        this.sendPacket(packet);
    },
    

    // 카드등록 요청을 한다.
    doRegisterCards(cards) {
        var packet = new GamePacket.Packet(PacketIDs.REGISTER_CARDS);
        packet.writeByteArray(cards);
        this.sendPacket(packet);
    },

    //  패스 요청을 한다.
    doPassCard() {
        var packet = new GamePacket.Packet(PacketIDs.PASS_CARD);
        this.sendPacket(packet);
    },

    //  카드낼준비 완료
    doRegisterReady() {
        var packet = new GamePacket.Packet(PacketIDs.REGISTER_READY);
        this.sendPacket(packet);
    },

    // 방나가기 요청을 한다.
    doRoomOut() {
        var packet = new GamePacket.Packet(PacketIDs.ROOM_OUT);
        this.sendPacket(packet);
    },

    doPlayEmotionSound(avatar, number) {
        var packet = new GamePacket.Packet(PacketIDs.EMOTION_SOUND);
        packet.writeByte(avatar);
        packet.writeByte(number);
        this.sendPacket(packet);
    },

    // 로그인 응답 처리부
    procLogin(packet) {
        var data = {};
        data.result = packet.readByte();
        return data;
    },

    procRoomEnter(packet) {
        var data = {};
        data.code = packet.readByte();
        data.roomid = packet.readInt64();
        data.seatno = packet.readInt32();
        data.betting = packet.readInt64();
        return data;
    },

    // 플레이어가 게임방에 입장
    procPlayerData(packet) {
        var data = {};
        data.seat = packet.readByte();
        data.name = packet.readString();
        data.avatar = packet.readInt32();
        data.money = packet.readString();
        return data;
    },

    // 플레이어가 게임방에서 탈퇴
    procRoomOut(packet) {
        var data = {};
        data.seatno = packet.readByte();
        data.flag = packet.readByte();
        return data;
    },

    // 게임시작-게임참여 알림.
    procGameStart(packet) {
        var data = {};
        data.seats = packet.readByteArray();
        data.boss = packet.readByte();
        return data;
    },

    
    procGameResult(packet) {
        var data = {};
        data.players = packet.readByte();
        data.seats = packet.readByteArray();
        data.iswinner = packet.readByteArray();
        data.winmoney = packet.readInt64Array();
        data.gamemoney = packet.readStringArray();
        console.log(data);
        return data;
    },

    // 게임장 재설정(결과후)
    procRoomReset(packet) {
        var data = {};
        return data;
    },

    procDealingCards(packet) {
        var data = {};
        data.cards = packet.readByteArray();
        return data;
    },

    procRegisterCards(packet) {
        var data = {};
        data.result = packet.readByte();
        data.seatno = packet.readByte();
        data.cards = packet.readByteArray();
        data.bundleString = packet.readString();
        data.soundString = packet.readString();
        return data;
    },

    procUpdateCards(packet) {
        var data = {};
        data.seats = packet.readByteArray();
        data.counts = packet.readByteArray();
        data.cards = packet.readByteArray();
        return data;
    },

    procRegisterTurn(packet) {
        var data = {};
        data.seat = packet.readByte();
        data.name = packet.readString();
        data.timeout = packet.readByte();
        data.bundleInfo = packet.readByte();
        return data;
    },

    // 플레이어가 게임방에서 탈퇴
    procRoomOut(packet) {
        var data = {};
        data.seatno = packet.readByte();
        data.flag = packet.readByte();
        return data;
    },

    procEmotionSound(packet) {
        var data = {};
        data.avatar = packet.readByte();
        data.number = packet.readByte();
        return data;
    },

    procRoomMove(packet) {
        var data = {};
        data.seatno = packet.readByte();
        data.flag = packet.readByte();
        return data;
    },

});

module.exports = {
    Socket: HoolaSocket,
    PacketIDs: PacketIDs,
};
