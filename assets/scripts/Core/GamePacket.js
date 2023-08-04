var BinaryIO = require("BinaryIO");
var Encoding = require("encoding");

var GamePacket = function(id) {
	this.packetid = id;
    this.dataBuffer = [];
    this.isHeaderReadyForParsing = false;
    this.isPacketReadyForParsing = false;
    this.dataBufferSizeForParsing = 0;
    this.dataBufferPosForParsing = 0;
};

GamePacket.prototype.writeInt32 = function(val) {
    BinaryIO.writeInt32ToBuffer(this.dataBuffer, this.dataBuffer.length, BinaryIO.ENDIAN_LITTLE, val);
};

GamePacket.prototype.readInt32 = function() {
    var val = BinaryIO.readInt32FromBuffer(this.dataBuffer, this.dataBufferPosForParsing, BinaryIO.ENDIAN_LITTLE);
    this.dataBufferPosForParsing+=4;
    return val;
};

GamePacket.prototype.readInt64 = function() {
    var val = BinaryIO.readInt64FromBuffer(this.dataBuffer, this.dataBufferPosForParsing, BinaryIO.ENDIAN_LITTLE);
    this.dataBufferPosForParsing+=8;
    return val;
};

GamePacket.prototype.writeInt16 = function(val) {
    BinaryIO.writeShortToBuffer(this.dataBuffer, this.dataBuffer.length, BinaryIO.ENDIAN_LITTLE, val);
};

GamePacket.prototype.readByte = function() {
    var val = BinaryIO.readByteFromBuffer(this.dataBuffer, this.dataBufferPosForParsing);
    this.dataBufferPosForParsing++;
    return val;
};

GamePacket.prototype.writeByte = function(val) {
    BinaryIO.writeByteToBuffer(this.dataBuffer, this.dataBuffer.length, val);
};

GamePacket.prototype.writeString = function(val) {
    var encoder = new Encoding.TextEncoder('utf-8');
    var bytes = encoder.encode(val);
    this.writeInt16(bytes.length);
    BinaryIO.writeBytesToBuffer(this.dataBuffer, this.dataBuffer.length, bytes);
};

GamePacket.prototype.readString = function() {
    var decoder = new Encoding.TextDecoder();
    var len = BinaryIO.readShortFromBuffer(this.dataBuffer, this.dataBufferPosForParsing, BinaryIO.ENDIAN_LITTLE);
    this.dataBufferPosForParsing += 2;
    if(len <= 0)
        return "";
    var buff = new ArrayBuffer(len);
    var bytesBuffer = new Uint8Array(buff);
    for(var i = 0; i < len; i++) {
        bytesBuffer[i] = this.dataBuffer[this.dataBufferPosForParsing];
        this.dataBufferPosForParsing++;
    }
    return decoder.decode(buff);
};

GamePacket.prototype.readByteArray = function() {
    var arr = [];
    var length = this.readInt32();
    for(var i=0; i<length; i++) {
        arr.push(this.readByte());
    }
    return arr;
};

GamePacket.prototype.writeByteArray = function(arr) {
    this.writeInt32(arr.length);
    for(var i=0; i<arr.length; i++) {
        this.writeByte(arr[i]);
    }
};

GamePacket.prototype.readInt64Array = function() {
    var arr = [];
    var length = this.readInt32();
    for(var i=0; i<length; i++) {
        arr.push(this.readInt64());
    }
    return arr;
};

GamePacket.prototype.readStringArray = function() {
    var arr = [];
    var length = this.readInt32();
    for(var i=0; i<length; i++) {
        arr.push(this.readString());
    }
    return arr;
};


GamePacket.prototype.build = function() {
    var totalLength = 4 + 2 + this.dataBuffer.length;
    var buffer = new ArrayBuffer(totalLength);
    var arr = new Uint8Array(buffer);
    var idx = 0;
    BinaryIO.writeInt32ToBuffer(arr, idx, BinaryIO.ENDIAN_LITTLE, totalLength); idx += 4;
    BinaryIO.writeShortToBuffer(arr, idx, BinaryIO.ENDIAN_LITTLE, this.packetid); idx += 2;
    BinaryIO.writeBytesToBuffer(arr, idx, this.dataBuffer);
    return buffer;
};

GamePacket.prototype.parse = function(buffer, offset) {
    var readBytes = offset; // 버퍼에서 실지 읽은 바이트수
    var headerSize = 6;

    if(this.isPacketReadyForParsing == true) {
        return 0;
    }

    while(readBytes < buffer.length) {
        // 헤더부를 읽는다.
        if(this.isHeaderReadyForParsing == false) {
            this.dataBuffer[this.dataBuffer.length] = buffer[readBytes];
            readBytes++;
            if(readBytes >= headerSize) {
                this.isHeaderReadyForParsing = true;
                // 헤더부를 파싱한다.
                var idx = 0;
                this.dataBufferSizeForParsing = BinaryIO.readInt32FromBuffer(this.dataBuffer, idx, BinaryIO.ENDIAN_LITTLE) - headerSize;
                idx += 4;
                if(this.dataBufferSizeForParsing > 40960) {
                    // 불량파켓으로 인정.
                    return -1;
                }
                this.packetid = BinaryIO.readShortFromBuffer(this.dataBuffer, idx, BinaryIO.ENDIAN_LITTLE);
                idx += 2;
                this.dataBuffer = [];

                if(this.dataBufferSizeForParsing == 0){
                    this.isPacketReadyForParsing = true;
                    return readBytes;
                }
            }
            continue;
        }
        // 데이터부를 읽는다.
        if(this.dataBuffer.length < this.dataBufferSizeForParsing) {
            this.dataBuffer[this.dataBuffer.length] = buffer[readBytes];
            readBytes++;
        }

        // 데이터부를 모두 읽었다면 
        if(this.dataBuffer.length >= this.dataBufferSizeForParsing) {
            this.isPacketReadyForParsing = true;
            return readBytes;
        }
    }
    return readBytes;
};

module.exports = {
    Packet: GamePacket,
};
