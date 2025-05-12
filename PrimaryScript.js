function onLogout() {
    LogoutAccount();
    MoveWindow.Login();
}
function onLoginClick() {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;
    
    let hasFault = CheckLoginValues(false);

    if(hasFault) return;

    SessionVisual.LoginChecking();
    SessionVisual.LockInput();
    let out = LoginAccount(email,password);
    
    if(out == 200) {
        MoveWindow.Account();
    } else {
        SessionVisual.UnlockInput();
        SessionVisual.LoginFail();
    }
}
function onRegisterClick() {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;
    let username = document.getElementById("loginUsername").value;
    let hasFault = CheckLoginValues(true);

    if(hasFault) return;

    SessionVisual.LoginChecking();
    SessionVisual.LockInput();
    let out = RegisterAccount(email,password,username);
    
    if(out == 200) {
        LoginAccount(email,password);

        MoveWindow.Account();
    } else {
        SessionVisual.UnlockInput();
        SessionVisual.LoginFail();
    }
}
function CheckLoginValues(register) {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;
    let username = document.getElementById("loginUsername");

    console.log(username);
    SessionVisual.ClearState();
    let hasFault=false;

    if(!checkValidEmail(email)) {
        SessionVisual.CheckEmail();
        hasFault=true;
    } 

    if(!checkValidPass(password)) {
        SessionVisual.CheckPassword();
        hasFault=true;
    }
    if(register) {
        if(!checkValidUsername(username.value)) {
            SessionVisual.CheckUsername();
            hasFault=true;
        };
    }
    if(hasFault) {
        SessionVisual.LoginFail();
        return true;
    }
    return false;
}

function checkValidEmail(email) {
    return email.toLowerCase().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}
function checkValidPass(pass) {
    let checkSet = checkPassword(pass);
    let returnVal = true;
    checkSet.forEach(el => {
        if(el.isError) returnVal=false;
    });
    return returnVal;
}
function checkValidUsername(username) {
    if(username.length < 4 || username.length>16) return false;
    if(!/^\S*$/.test(username)) {
        return false;
    }
    return true;
}

function checkPassword(pass) {
    let checkSet =[];
    if (pass.length < 8) {
        checkSet.push({isError:true,Message:"Your password must be 8 Charcters or longer"});
    }
    if (pass.length > 64) {
        checkSet.push({isError:false,Message:"Your password is longer than 64 characters, it may be difficult to remember"});
    }
    if (pass.search(/[0-9]/) < 0) {
        checkSet.push({isError:true,Message:"Your password must contain at least one Number"});
    }
    if (!/^\S*$/.test(pass)) {
        checkSet.push({isError:true,Message:"Your password must not contain Whitespace"});
    }
    if (!/^(?=.*[A-Z]).*$/.test(pass)) {
        checkSet.push({isError:true,Message:"Your password must have at least one Uppercase Character"});
    }
    if (!/^(?=.*[a-z]).*$/.test(pass)) {
        checkSet.push({isError:true,Message:"Your password must have at least one Lowercase Character"});
    }
    return checkSet;
}
const SessionVisual = {
    ShowPassword: (el) => {
        let passwordInput =  document.getElementById("loginPassword");
       if(el) passwordInput.type="Text";
        else passwordInput.type="Password"
    },
    LockInput: () => {
        document.getElementById("loginEmail").disabled=true;
        document.getElementById("loginPassword").disabled=true;
        if(document.getElementById("loginUsername") != undefined) document.getElementById("loginUsername").disabled=true;

    },
    UnlockInput: () => {
        document.getElementById("loginEmail").disabled=false;
        document.getElementById("loginPassword").disabled=false;
        if(document.getElementById("loginUsername") != undefined) document.getElementById("loginUsername").disabled=false;
    },
    HandleClassChange: (element,newclass,replace) => {
        if(element.classList.contains(replace)) element.classList.replace(replace,newclass) 
            else element.classList.add(newclass);
    },
    LoginChecking: () => {
        let CenterBorder = document.getElementsByClassName("CenterBorder")[0];
        let CenterButtonConfirm = document.getElementsByClassName("CenterButtonConfirm")[0];
        
        
        SessionVisual.HandleClassChange(CenterBorder,"loginClick","loginFailed");
        SessionVisual.HandleClassChange(CenterButtonConfirm,"loginClick","loginFailed");
    },
    LoginFail: () => {
        let CenterBorder = document.getElementsByClassName("CenterBorder")[0];
        let CenterButtonConfirm = document.getElementsByClassName("CenterButtonConfirm")[0];
        
        SessionVisual.HandleClassChange(CenterBorder,"loginFailed", "loginClick");
        SessionVisual.HandleClassChange(CenterButtonConfirm,"loginFailed", "loginClick");
    },

    CheckEmail: () => {
        document.getElementById("displayEmailFault").style.visibility="hidden";
        let email = document.getElementById("loginEmail").value;
        
        if(!checkValidEmail(email)) {
            document.getElementById("displayEmailFault").style.visibility="visible";
        }  
    },
    CheckUsername: () => {
        document.getElementById("displayUsernameFault").style.visibility="hidden";
        let username = document.getElementById("loginUsername").value;
        
        if(!checkValidUsername(username)) {
            document.getElementById("displayUsernameFault").style.visibility="visible";
        }  
    },
    CheckPassword: () => {
        let displayPassFault = document.getElementById("displayPassFault");
        let CenterLoginPassword = document.getElementsByClassName("CenterLoginPassword")[0];

        displayPassFault.innerHTML="";
        let pass = document.getElementById("loginPassword").value;
        let faults = checkPassword(pass);

        CenterLoginPassword.style.height="";
        let setHeight = 100+(faults.length*18)-2;
        if(setHeight<120)setHeight=120;
        if(!checkValidPass(pass)) {
            displayPassFault.style.color="red";
            displayPassFault.innerHTML=faults.map(el => { if(el.isError) return "- "+el.Message}).join("<br>");
            CenterLoginPassword.style.height=setHeight+"px"; 
            return;
        } 
        if(faults.length!=0) {
            displayPassFault.style.color="yellow";
            displayPassFault.innerHTML=faults.map(el => {return "- "+el.Message}).join("<br>");
            CenterLoginPassword.style.height=setHeight+"px"; 
        }
    },

    ClearState: () => {
        document.getElementById("displayEmailFault").style.visibility="hidden";

        let CenterBorder = document.getElementsByClassName("CenterBorder")[0];
        let CenterButtonConfirm = document.getElementsByClassName("CenterButtonConfirm")[0];
        
        SessionVisual.HandleClassChange(CenterBorder,"loginClick","");
        SessionVisual.HandleClassChange(CenterButtonConfirm,"loginClick","");
        SessionVisual.HandleClassChange(CenterBorder,"loginFailed","");
        SessionVisual.HandleClassChange(CenterButtonConfirm,"loginFailed","");
        SessionVisual.UnlockInput();
    },
    CheckLoggedIn: () => {
        let accinfo = document.getElementsByClassName("CenterElement")[0];
        let confirmbutton =  document.getElementsByClassName("CenterButtonConfirm")[0];
        if(LoginConfirm()) {
            accinfo.style.visibility="visible";
            confirmbutton.children[0].innerHTML="Logout";
            confirmbutton.setAttribute( "onClick", "javascript: onLogout();" )
        } else {
            accinfo.style.visibility="hidden"
            MoveWindow.Login();
            confirmbutton.onclick="";
            confirmbutton.children[0].innerHTML="Login";
            
        }
        
    },
    LoginInfoWrite: () => {


        let tempAcc =GetLoggedAccountTemp();
        let acc=GetLoggedAccount(tempAcc.uuid);

        document.getElementById("infoUser").innerHTML="Username: "+acc.username;
        document.getElementById("infoEmail").innerHTML="Email: "+acc.email;
        document.getElementById("infoId").innerHTML="UUID: "+acc.uuid;
        document.getElementById("infoRegAt").innerHTML="Registered At: "+new Date(acc.registerTime);

        document.getElementById("infoLogAt").innerHTML="Logged in At: "+new Date(tempAcc.logintime);

        document.title=document.title.replace("Profile",acc.username);

    }
}
const MoveWindow = {
    Account: () => {
        window.location.href="https://altrion.github.io/ExampleLoginSite/profile";
    },
    Login: () => {
        window.location.href="https://altrion.github.io/ExampleLoginSite/login";
    },
    Register: () => {
        window.location.href="https://altrion.github.io/ExampleLoginSite/register";
    }
}
