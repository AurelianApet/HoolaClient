// 바이트 자료 Endian 형태를 정의한 상수이다.
const ENDIAN_BIG = 0x22222222;
const ENDIAN_LITTLE = 0x11111111;

function writeInt32ToBuffer(buf, iOffset, iEndianType, val) {
    if(iEndianType == ENDIAN_BIG) {
        buf[iOffset] = ((val >> 24) & 0xFF);
        buf[iOffset + 1] = ((val >> 16) & 0xFF);
        buf[iOffset + 2] = ((val >> 8) & 0xFF);
        buf[iOffset + 3] = ((val) & 0xFF);
    } else {
        buf[iOffset] = ((val) & 0xFF);
        buf[iOffset + 1] = ((val >> 8) & 0xFF);
        buf[iOffset + 2] = ((val >> 16) & 0xFF);
        buf[iOffset + 3] = ((val >> 24) & 0xFF);
    }
}

function writeShortToBuffer(buf, iOffset, iEndianType, val) {
    if(iEndianType == ENDIAN_BIG) {
        buf[iOffset] = ((val >> 8) & 0xFF);
        buf[iOffset + 1] = ((val) & 0xFF);
    } else {
        buf[iOffset] = ((val) & 0xFF);
        buf[iOffset + 1] = ((val >> 8) & 0xFF);
    }
}

function writeBytesToBuffer(buf, iOffset, data) {
	for(var i = 0; i < data.length; i++) {
		buf[iOffset + i] = data[i];
	}
}

function writeByteToBuffer(buf, iOffset, val) {
    buf[iOffset] = val;
}

function readInt32FromBuffer(data, iOffset, iEndianType) {
    if(iEndianType == ENDIAN_BIG)
        return ((data[iOffset] & 0xFF) << 24) | ((data[iOffset + 1] & 0xFF) << 16) | ((data[iOffset + 2] & 0xFF) << 8) | (data[iOffset + 3] & 0xFF);
    return (data[iOffset] & 0xFF) | ((data[iOffset + 1] & 0xFF) << 8) | ((data[iOffset + 2] & 0xFF) << 16) | ((data[iOffset + 3] & 0xFF) << 24);
}


function readInt64FromBuffer(data, iOffset, iEndianType) {
    var val = 0;
    for(var i=0; i<8; i++)
    {
        if(iEndianType == ENDIAN_BIG)
        {
            val = val | ((data[iOffset + i] & 0xFF) << (7-i));
        }
        else
        {
            val = val | ((data[iOffset + i] & 0xFF) << (i * 8));
        }
    }
    return val;
}


function readShortFromBuffer(data, iOffset, iEndianType) {
    if(iEndianType == ENDIAN_BIG)
        return (((data[iOffset] & 0xFF) << 8) | (data[iOffset + 1] & 0xFF));
    return ((data[iOffset] & 0xFF) | ((data[iOffset + 1] & 0xFF) << 8));
}

function readByteFromBuffer(data, iOffset) {
    return data[iOffset];
}

module.exports = {
    ENDIAN_BIG: ENDIAN_BIG,
    ENDIAN_LITTLE: ENDIAN_LITTLE,
    writeInt32ToBuffer: writeInt32ToBuffer,
    writeShortToBuffer: writeShortToBuffer,
    writeBytesToBuffer: writeBytesToBuffer,
    writeByteToBuffer: writeByteToBuffer,
    readInt32FromBuffer: readInt32FromBuffer,
    readInt64FromBuffer: readInt64FromBuffer,
    readShortFromBuffer: readShortFromBuffer,
    readByteFromBuffer: readByteFromBuffer
};