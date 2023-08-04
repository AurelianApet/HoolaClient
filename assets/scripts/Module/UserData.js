// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    properties: {
        //아이디
        id : 0,
        //파트너코드
        partner : "",
        // 유저이름
        name : "",
        // 유저아바타
        avatar : 0,
        // 전화번호
        tel : "",
        // 은행명
        bankname : "",
        // 은행계좌
        banknum : "",
        // 예금주
        bankmaster : "",
        // 게임머니
        gamemoney : 0,
        // 금고머니
        safemoney : 0,
        // TAKEBACK머니
        takebackmoney : 0,
        //이긴수
        winCnt : 0,
        //진수
        loseCnt : 0,
        //퍼센트
        percent : 0,
    },
});
