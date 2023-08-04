if (!window.i18n) window.i18n = {};
if (!window.i18n.languages) window.i18n.languages = {};
window.i18n.languages.mn={
// write your key value pairs here
    msg: {
        //  로그인
        cannot_connect_server: 'Сервер холбогдох боломжгүй байна.',
        disconnected_to_server: 'Сервер холболт тасарлаа.',
        dismatch_id_pwd: 'ID болон нууц үг буруу байна.',
        already_login: 'Холбогдсон  ID байна.',
        failed_to_login_server: 'Серверт нэвтрэх боломжгүй.',
        permit_disabled: 'Бүртгэлд зөвшөөрөгдөөгүй байна.',
        empty_id: 'ID оруулна уу.',
        empty_pwd: 'Нууц үг оруулна уу.',
        empty_safepwd: 'Аюулгүй дугаар оруулна уу.',
        empty_name: 'Нэрээ оруулна уу.',
        empty_bankname: 'Банкны нэрээ оруулна уу.',
        empty_banknum: 'Дансны дугаараа оруулна уу.',
        empty_bankmaster: 'Данс эзэмшигчийн нэрээ оруулна уу.',
        empty_tel: 'Утасны дугаараа оруулна уу.',
        empty_partner: 'Уригчийн кодоо оруулна уу.',
        dismatch_pwd_repwd: 'Нууц үг буруу байна.',
        failed_to_enter_room: 'Өрөөнд нэвтрэх амжилтгүй боллоо.',
        really_exit_room: 'Та үнэхээр өрөөнөөс гарахыг хүсч байна уу?',
        really_quit_game: 'Та энэ тоглоомыг дуусгах уу?',
        loading_text:'Уншигдаж байна.',

        memReg_success: 'Бүртгэл амжилттай боллоо.',
        memReg_loginidDoubled: 'ID давхардаж байна.',
        memReg_nameDoubled: 'Нэр давхардаж байна.',
        memReg_partnerMissing: 'Уригчийн код олдсонгүй.',
        memReg_failed: 'Бүртгэл амжилтгүй болллоо.',

        
        discharge_empty_banknum: 'Мөнгө авах банкны дансны дугаараа оруулна уу.',
        discharge_empty_name: 'Данс эзэмшигчийн нэрээ оруулна уу.',
        discharge_empty_money: 'Мөнгөн дүнгээ оруулна уу.',
        charge_empty_banknum: 'Мөнгө хийх банкны дансаа оруулна уу.',
        charge_empty_name: 'Данс эзэмшигчийн нэрээ оруулна уу.',
        charge_empty_money: 'Мөнгөн дүнгээ оруулна уу.',
        charge_user_cancel: 'Цэнэглэлт цуцлагдсан.',
        discharge_user_cancel: 'Таталт цуцлагдсан.',
        charge_request_allow: 'Цэнэглэлт амжилттай.',
        charge_request_cancel: 'Цэнэглэлт цуцлагдсан.',
        discharge_request_allow: 'Таталт амжилттай.',
        discharge_request_cancel: 'Таталт цуцлагдсан.',
        charge_request_successed: 'Цэнэглэх хүсэлт амжилттай боллоо.',
        charge_request_failed: 'Цэнэглэх хүсэлт амжилтгүй боллоо.',
        discharge_request_successed: 'Татах хүсэлт амжилттай боллоо.',
        discharge_request_failed: 'Татах хүсэлт амжилтгүй боллоо.',
        discharge_moneylack: 'Таны авах мөнгөний хэмжээ буруу тул цуцалсан байна.',
        
        safe_gamelack:'Хөрвүүлэлтийн хэмжээ тоглоомын мөнгөнөөс давж гарна.',
        safe_safelack:'Хөрвүүлэх дүн нь  хадгаламжийн мөнгөнөөс давсан байна.',
        changesafepwd_success: 'Нууц үг амжилттай солигдлоо.',
        changesafepwd_failed: 'Нууц үг солилт амжилтгүй боллоо.',
        safe_dismatch_pwd: 'Хадгаламжийн нууц үг буруу байна.',

        enterroom_money_lack: 'Орох мөнгөн дүнг зөвшөөрөхгүй.',

        chat_admin_leave: 'Админ түр байхгүй  байна.',
    },

    //  로딩 씬
    loading:{
        percent : 'Шинэчлэлт хийгдэж байна.',
    },

    chat: {
        name_admin: 'Админ',
    },

    unit: {
        wan:'к',
        yi:'сая',
        zhao:'тэрбум',
        person:'хүн',
        win:'хожил',
        lose:'мод',
        vip:'гуай',
        cards:'ш',

        single:'single',
        pair:'one pair',
        triple:'triple',
        straight:'straight',
        flush:'flush',
        poolhouse:'full house',
        fourcard:'four card',
        straightflush:'straight flush',

        backstraight:'back straight',
        mountainstraight:'mountain straight',
        backstraightflush:'back straight flush',
        mountainstraightflush:'mountain straight flush',
    },

    label: {
        preloading_loading_text: 'Ачааллаж байна...',

        lobby_safepwd_label1:'Нууц үг оруулна уу.',
        lobby_safepwd_label2:'(Алдаатай тул админтай холбогдонуу.)',
        lobby_safepwd_password_placeholder:'6 оронтой үсэг,тоо',

        login_member_id:'id:',
        login_member_pwd:'pass:',
        login_member_repwd:'Баталгаажуулах:',
        login_member_safepwd:'Аюулгүй дугаар:',
        login_member_name:'Нэр:',
        login_member_bankname:'Банкны нэр:',
        login_member_banknum:'Дансны дугаар:',
        login_member_bankmaster:'Данс эзэмшигчийн нэр:',
        login_member_tel:'Утас:',
        login_member_tel_comment:'Ашиглагдаж байгаа утасны дугаар.',
        login_member_parter:'Уригч/Уригчийн код:',
        login_member_placeholder_id:'ID оруулна уу.',
        login_member_placeholder_pwd:'Нууц үг оруулна уу.',
        login_member_placeholder_repwd:'Нууц үг оруулна уу.',
        login_member_placeholder_safepwd:'Аюулгүй дугаар оруулна уу.',
        login_member_placeholder_name:'Нэрээ оруулна уу.',
        login_member_placeholder_bankname:'Банкны нэрээ оруулна уу.',
        login_member_placeholder_banknum:'Дансны дугаараа оруулна уу.',
        login_member_placeholder_bankmaster:'Данс эзэмшигчийн нэрээ оруулна уу.',
        login_member_placeholder_parter:'Уригчийн кодоо оруулна уу.',

        lobby_charge:'Цэнэглэлт',
        lobby_discharge:'Зарлага',
        lobby_chat:'1:1 чат',
        lobby_notice:'Мэдээлэл',

        lobby_safe_safe:'Хадгаламж:',
        lobby_safe_game:'Game:',
        lobby_safe_exchangemoney:'Зарлагдах дүн:',
        lobby_safe_comment:'(Зарлагдах дүн 10000-с дээш.)',
        lobby_password_pwd:'Нууц үг:',
        lobby_password_repwd:'Нууц үг шалгах:',

        lobby_charge_banknum:'Дансны дугаар:',
        lobby_charge_name:'Данс эзэмшигчийн нэр:',
        lobby_charge_money:'Орлогын дүн:',
        lobby_charge_tel:'Утас:',
        lobby_charge_comment:'(/цэнэглэх дүн 10000-с дээш/)',

        lobby_discharge_banknum:'Дансны дугаар:',
        lobby_discharge_name:'Нэр:',
        lobby_discharge_money:'Зарлагын дүн:',
        lobby_discharge_tel:'Утас:',
        lobby_discharge_comment:'(Солин дүн 10000-с дээш.)',

        lobby_setting_backsound:'Дэлгэцний тохиргоо',
        lobby_setting_effectsound:'Дуу',
        lobby_setting_voice:'Дуу, хоолой',
        lobby_setting_turnon:'Асаах',
        lobby_setting_turnoff:'Унтраах',

        lobby_notice_title:'гарчиг:',
        lobby_notice_date:'өдөр:',
        lobby_notice_content:'мэдээлэл:',
    },
};