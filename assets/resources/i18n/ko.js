if (!window.i18n) window.i18n = {};
if (!window.i18n.languages) window.i18n.languages = {};
window.i18n.languages.ko={
// write your key value pairs here
    msg: {
        //  로그인
        welcome: "Welcom To ThirteenHoola",
        cannot_connect_server: "I can't connect to the server.",
        disconnected_to_server: 'Connection to server is blocked',
        dismatch_id_pwd: 'ID password is incorrect.',
        already_login: 'You are already logged in.',
        failed_to_login_server: "I can't log in to the server.",
        permit_disabled: 'You are not allowed to join.',
        empty_id: 'Please enter your ID.',
        empty_pwd: 'Please enter a password.',
        empty_safepwd: 'Please enter a safe password.',
        dismatch_safepwd_pwd : 'Safe password must be at least 6 characters.',
        empty_name: 'Please enter your name.',
        empty_bankname: 'Please enter your bank name',
        empty_banknum: 'Please enter your account number.',
        empty_bankmaster: 'Please enter the account holder.',
        empty_tel: 'Please enter a contact.',
        empty_partner: 'Please enter a referral / recommended code.',
        dismatch_pwd_repwd: 'Password is not correct.',
        failed_to_enter_room: 'The entry failed.',
        really_exit_room: 'Do you really want to leave the game room?',
        really_quit_game: 'Do you want to exit the game?',
        remove_cache: 'Update Client Version. Thanks.',
        loading_text:'Reading',

        memReg_success: 'Membership is successful.',
        memReg_loginidDoubled: 'ID is duplicated.',
        memReg_nameDoubled: 'The name is a duplicate.',
        memReg_partnerMissing: 'No referral / referral code found.',
        memReg_failed: 'Membership failed.',

        
        discharge_empty_banknum: 'Please enter the bank name account number.',
        discharge_empty_name: 'Please enter your withdrawal name.',
        discharge_empty_money: 'Please enter a withdrawal amount',
        charge_empty_banknum: 'Please enter your bank name account number.',
        charge_empty_name: 'Please enter your name.',
        charge_empty_money: 'Please enter the deposit amount',
        charge_user_cancel: 'The user canceled the charge request.',
        discharge_user_cancel: 'The user canceled the exchange request.',
        charge_request_allow: 'The charge request for has been approved.',
        charge_request_cancel: 'The charge request for has been canceled.',
        discharge_request_allow: 'Your money exchange request for has been approved.',
        discharge_request_cancel: 'Your money exchange request for has been canceled.',
        charge_request_successed: 'The charging request was successful.',
        charge_request_failed: 'Charging request failed.',
        discharge_request_successed: 'The exchange request was successful.',
        discharge_request_failed: 'The exchange request failed.',
        discharge_moneylack: 'Your request has been canceled because the exchange amount is greater than your money.',
        
        safe_gamelack:'Conversion amount exceeds game money.',
        safe_safelack:'Conversion amount is higher than the safe.',
        changesafepwd_success: 'Password modification was successful.',
        changesafepwd_failed: 'Password modification failed.',
        safe_dismatch_pwd: 'The safe is not correct.',

        enterroom_money_lack: 'You cannot enter the entrance fee.',

        chat_admin_leave: "The manager has left for a while.",
    },

    //  로딩 씬
    loading:{
        percent : "I'm making a plate.",
    },

    chat: {
        name_admin: '[Administrator]',
    },

    unit: {
        wan:'만',
        yi:'억',
        zhao:'조',
        person:'Players',
        win:'win',
        lose:'lose',
        vip:'',
        cards:'cards',
        
        single:'Single',
        pair:'Pair',
        triple:'Triple',
        backstraight:'Back straight',
        mountainstraight:'Mountain straight',
        straight:'Straight',
        flush:'Flush',
        poolhouse:'full house',
        fourcard:'Four Card',
        backstraightflush:'Tight Straight Flush',
        mountainstraightflush:'Mountain Straight Flush',
        straightflush:'Straight flush',
    },

    label: {
        preloading_loading_text: 'Loading1234 ...',

        lobby_safepwd_label1:'Please enter a password.',
        lobby_safepwd_label2:'(Contact administrator if password fails 5 times)',
        lobby_safepwd_password_placeholder:'Enter 6 alphanumeric characters',

        // login_member_id:'ID:',
        // login_member_pwd:'password:',
        // login_member_repwd:'Confirm Password:',
        // login_member_safepwd:'Safe Password:',
        // login_member_name:'name:',
        // login_member_bankname:'name of bank:',
        // login_member_banknum:'Account Number:',
        // login_member_bankmaster:'Account Holder:',
        // login_member_tel:'Contact:',
        // login_member_tel_comment:'Please enter your contact number.',
        // login_member_parter:'Referrer / Recommended Code:',
        // login_member_placeholder_id:'Please enter your ID.',
        // login_member_placeholder_pwd:'Please enter a password.',
        // login_member_placeholder_repwd:'Please check your password.',
        // login_member_placeholder_name:'Please enter your name.',
        // login_member_placeholder_bankname:'Please enter your bank name.',
        // login_member_placeholder_banknum:'Please enter your account number.',
        // login_member_placeholder_bankmaster:'Please enter the account holder.',
        // login_member_placeholder_parter:'Please enter a referral / recommended code.',

        login_member_id:'дугаар:',
        login_member_pwd:'нууц үг:',
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

        lobby_charge:'Charge',
        lobby_discharge:'Exchange',
        lobby_chat:'1:1 Inquiry',
        lobby_notice:'Notice',

        lobby_safe_safe:'Safe:',
        lobby_safe_game:'Game:',
        lobby_safe_exchangemoney:'Conversion Amount:',
        lobby_safe_comment:'(Currency exchange can only be made in ten thousand units.)',
        lobby_password_pwd:'Password:',
        lobby_password_repwd:'Confirm Password:',

        lobby_charge_banknum:'Deposit Account:',
        lobby_charge_name:'Depositor Name:',
        lobby_charge_money:'Deposit amount:',
        lobby_charge_tel:'Contact:',
        lobby_charge_comment:'(Recharge amount is only available in 10,000 units.)',

        lobby_discharge_banknum:'Account Number:',
        lobby_discharge_name:'Withdrawal Name:',
        lobby_discharge_money:'Withdrawal Amount:',
        lobby_discharge_tel:'Contact:',
        lobby_discharge_comment:'(Currency exchange can only be made in ten thousand units.)',

        lobby_setting_backsound:'Background',
        lobby_setting_effectsound:'Sound Effect',
        lobby_setting_voice:'Voice',
        lobby_setting_turnon:'On',
        lobby_setting_turnoff:'Off',
        
        lobby_notice_title:'Title:',
        lobby_notice_date:'Date:',
        lobby_notice_content:'Notice:',
    },
};