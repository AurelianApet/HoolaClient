module.exports = {
    numberWithCommas: function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    numberWithDanWei: function(x) {
        var ret = "";
        var danwei = ["", cc.globals.engine.stringTable('unit.wan'), cc.globals.engine.stringTable('unit.yi'), cc.globals.engine.stringTable('unit.zhao')], str = [];
        var cnt = 0;

        if(x < 0) x = 0;

        while(x) {
            str[cnt] = "";
            if(x % 10000 != 0)
            {
                str[cnt] = x % 10000 + danwei[cnt];
                
            }
            x = Math.floor(x / 10000);
            cnt++;
        }
        cnt--;
        while(cnt >= 0){
            ret += str[cnt--];
        }
        if(ret == "")ret = "0";
        return ret;
    }
}