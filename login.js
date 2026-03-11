document.getElementById("btn-login").addEventListener("click",function(){
    

    const userInput= document.getElementById("user");
    const user=userInput.value;

    const passInput= document.getElementById("pass");
    const pass=passInput.value;

    if(user==="admin" && pass==="admin123"){
        window.location.replace("/home.html");
    }

    else{
        alert("User and Password Wrong");
    }

})