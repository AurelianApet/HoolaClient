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
var GamePacket = require("GamePacket");
var GameSocketEvents = cc.Enum({
    DISCONNECTED : 'GameSocketEvents.DISCONNECTED',
    ON_MESSAGE : 'GameSocketEvents.ON_MESSAGE',
});

var GameSocket = cc.Class({
    extends: cc.Component,

    properties: {
        bIsConnected : cc.Boolean,
    },

    // 생성자
    ctor () {
        this._procFuncs = [];
        this.bIsConnected = false;
    },

    addEventListener (callback, target) {
        this.node.on(GameSocketEvents.ON_MESSAGE, callback, target);
        this.node.on(GameSocketEvents.DISCONNECTED, callback, target);
    },

    removeEventListener (callback, target) {
        this.node.off(GameSocketEvents.ON_MESSAGE, callback, target);
        this.node.off(GameSocketEvents.DISCONNECTED, callback, target);
    },

    // LIFE-CYCLE CALLBACKS:

    start () {

    },

    // update (dt) {},

    init (url) {
        this._url = url;
        this._wsSocket = null;
        this._packetForReceive = new GamePacket.Packet(0);
        
        if(this.node == null) {
            this.node = new cc.Node();
        }
    },

    close() {
        if(this._wsSocket != null) {
            this._wsSocket.close();
            this._wsSocket = null;
        }
        this.bIsConnected = false;
    },

    registerPacketProcess(id, func, target) {
        this._procFuncs[id] = {func: func, target:target};
    },

    
    connect (onconnect, onerr) {
        var self = this;
        var path = this._url;
        Logger.log2(this, '서버에 접속합니다. 주소:' + path);
        if(this._wsSocket != null) {
            Logger.log2(this, "이미 접속되어 있습니다.");
            return;
        }

        // 웹소켓을 생성한다.
        this._wsSocket = new WebSocket(path);
        this._wsSocket.binaryType = "arraybuffer";
        this._wsSocket.onopen = function(evt) {
            self.bIsConnected = true;
            onconnect();
        };

        this._wsSocket.onmessage = function(evt) {
            self.onReceiveData(evt.data);
        };

        this._wsSocket.onerror = function(evt) {
            self.bIsConnected = false;
            onerr();
        };

        this._wsSocket.onclose = function(evt) {
            self.bIsConnected = false;
            self._wsSocket = null;
            Logger.log2(self, "소켓 연결이 해제되었습니다.");
            self.node.emit(GameSocketEvents.DISCONNECTED, {type:GameSocketEvents.DISCONNECTED});
        };
    },

    // 패킷데이터를 전송한다.
    sendPacket(packet) {
        if(this._wsSocket == null)
            return;
        this._wsSocket.send(packet.build());
    },

    onReceiveData (data) {
        var self = this;
        this.packetForReceive = new GamePacket.Packet(0);
        var buffer = new Uint8Array(data);
        var readBytes = 0;
        var parsedBytes = 0;

        //Logger.log2(this, buffer.length.toString() + "바이트 도착.");

        while(readBytes < buffer.length)
        {
            parsedBytes = this.packetForReceive.parse(buffer, readBytes);
            if(parsedBytes < 0) {
                Logger.log2(this, "불량패킷이 도착!!!");
                this._wsSocket.close();
                return;
            }
            if(this.packetForReceive.isPacketReadyForParsing)
            {
                //Logger.log2(this, "패킷[" + this.packetForReceive.packetid + "] 이 도착.");
                var proc = this._procFuncs[this.packetForReceive.packetid];
                if(proc != null) {
                    // 패킷 처리부를 실행한다.
                    var data = proc.func.bind(proc.target, this.packetForReceive).call();
                    this.node.emit(GameSocketEvents.ON_MESSAGE, {type:GameSocketEvents.ON_MESSAGE, packetid:this.packetForReceive.packetid, data:data});
                }
                else {
                    Logger.log2(this, "패킷[" + this.packetForReceive.packetid + "] 처리부가 등록되어 있지 않습니다.");
                }
                this.packetForReceive = new GamePacket.Packet(0);
            }
            readBytes+=parsedBytes;
        }
    },
});

module.exports = {
    Events: GameSocketEvents,
    Socket: GameSocket,
};
