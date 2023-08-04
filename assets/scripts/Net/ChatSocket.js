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
    LOGIN: 1,       //  유저아이디를 보내 로그인
    CHAT: 2,               // 채팅내용
 });

var ChatSocket = cc.Class({
    extends: GameSocket.Socket,

    properties: {
        
    },

    
    // 생성자
    ctor () {
        this.registerPacketProcess(PacketIDs.CHAT, this.procChat, this);
    },

    start () {

    },
    doLogin(username) {
        Logger.log2(this, "상담서버에 자기의 유저이름 통지: " + username);
        var packet = new GamePacket.Packet(PacketIDs.LOGIN);
        packet.writeString(username);
        this.sendPacket(packet);
    },

    sendChat (text) {
        Logger.log2(this, "채팅요청 :" + text);
        // 채팅 패킷을 전송한다.
        var packet = new GamePacket.Packet(PacketIDs.CHAT);
        packet.writeString(text);
        this.sendPacket(packet);
    },

    // 채팅 응답 처리부
    procChat(packet) {
        var data = {};
        data.chat = packet.readString();
        return data;
    },
});

module.exports = {
    Socket: ChatSocket,
    PacketIDs: PacketIDs,
};