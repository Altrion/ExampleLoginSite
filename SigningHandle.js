
// This is just basic example on how to handle Account Login from Site
function LoginConfirm() {
    return localStorage.getItem("account") != undefined;
}
function LogoutAccount() {
    if(localStorage.getItem("account")) {
        localStorage.removeItem("account");
    }
}
function LoginAccount(email, pass) {
    if (localStorage.getItem("sitedata")) {
        account = _GetAccount(email);
        if(account) {
            if(account.pass==pass) {
                console.log(localStorage);
                account = {uuid:account.uuid,logintime:Date.now()};
                localStorage.setItem("account", JSON.stringify(account));
                return 200;
            }
            return 400;
        }
        return 404;
    }
    return 404;
}
function GetLoggedAccountTemp() {
    return JSON.parse(localStorage.getItem("account"));
}
function GetLoggedAccount(uuid) {
    siteData = JSON.parse(localStorage.getItem("sitedata"));
    return siteData.accounts.find((acc) => acc.uuid == uuid);
}
function RegisterAccount(_email, _pass,_username) {
    if (!localStorage.getItem("sitedata")) _CreateData();
    if (localStorage.getItem("sitedata")) {
        json = JSON.parse(localStorage.getItem("sitedata"));
        account = _GetAccount(_email);
        if(account) {
            return 400;
        }
        _uuid = crypto.randomUUID();
        _timenow = Date.now();
        json.accounts.push({email:_email,username:_username,pass:_pass,uuid:_uuid,registerTime:_timenow});
        localStorage.setItem("sitedata",JSON.stringify(json));
        return 200;
    }
    return 404;
}
function _GetAccount(email) {
    siteData = JSON.parse(localStorage.getItem("sitedata"));
    return siteData.accounts.find((acc) => acc.email == email);
}
function _CreateData() {
    localStorage.setItem("sitedata", JSON.stringify({accounts:[]}));
}