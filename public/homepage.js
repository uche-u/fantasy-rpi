document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("loginform").addEventListener("click", function() {
        document.getElementById("homepageform").innerHTML = '<div class="form-group"><label for="realInputUsername"> Username </label><input type="username" class="form-control" id="realInputUsername" placeholder="Username"></div><div class="form-group"><label for="realInputPassword1">Password</label><input type="password" class="form-control" id="realInputPassword1" placeholder="Password"><small id="passwordHelp2">Your password must be greater than 8 characters and contain at least 1 number.</small></div><button id="loginbutton" type="submit" class="btn btn-primary">Log in</button>';

        document.getElementById("signupform").style.borderBottom = "none";
        document.getElementById("loginform").style.borderBottom = "2px solid black";
        /*

        <div class="form-group">
              <label for="realInputUsername"> Username </label>
              <input type="username" class="form-control" id="realInputUsername" placeholder="Username">
          </div>
          <div class="form-group">
            <label for="realInputPassword1">Password</label>
            <input type="password" class="form-control" id="realInputPassword1" placeholder="Password">
            <small id="passwordHelp2">Your password must be greater than 8 characters and contain at least 1 number.</small>
          </div>
          <button id="loginbutton" type="submit" class="btn btn-primary">Log in</button>

        */
       
    });

    document.getElementById("signupform").addEventListener("click", function() {
        document.getElementById("homepageform").innerHTML = '<div class="form-group"><label for="exampleInputUsername"> Username </label><input type="username" class="form-control" id="exampleInputUsername" placeholder="Username"></div><div class="form-group"><label for="exampleInputEmail1">Email address</label><input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></div><div class="form-group"><label for="exampleInputPassword1">Password</label><input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"><small id="passwordHelp" class="form-text text-muted">Your password must be greater than 8 characters and contain at least 1 number.</small></div><div class="form-group"><label for="exampleConfirmPassword1">Confirm Password</label><input type="password" class="form-control" id="exampleConfirmPassword1" placeholder="Confirm Password"></div><button type="submit" class="btn btn-primary" onclick="verifyPassword()">Sign Up</button>';
       
        document.getElementById("loginform").style.borderBottom = "none";
        document.getElementById("signupform").style.borderBottom = "2px solid black";
        /*

        <div class="form-group">
            <label for="exampleInputUsername"> Username </label>
            <input type="username" class="form-control" id="exampleInputUsername" placeholder="Username">
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
        </div>
        <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
            <small id="passwordHelp" class="form-text text-muted">Your password must be greater than 8 characters and contain at least 1 number.</small>
        </div>
        <div class="form-group">
            <label for="exampleConfirmPassword1">Confirm Password</label>
            <input type="password" class="form-control" id="exampleConfirmPassword1" placeholder="Confirm Password">
        </div>
        <button type="submit" class="btn btn-primary" onclick="verifyPassword()">Sign Up</button>

        */

    });

    document.getElementById("navNews").addEventListener("click", function () {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        
    });

    document.getElementById("navRanking").addEventListener("click", function () {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    
});

document.getElementById("navRoster").addEventListener("click", function () {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });

});

document.getElementById("navLeague").addEventListener("click", function () {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });

});
      

});

function verifyPassword() {  
    var pw = document.getElementById("exampleInputPassword1").value;      
    //check empty password field  
    if(pw == "") {  
       alert("**Fill the password please!");  
       return false;  
    }  
    //minimum password length validation  
    if(pw.length < 8) {  
       alert("**Password length must be atleast 8 characters");  
       return false;  
    }
    if(!/\d/.test(pw)){
        alert("**Password length must contain a number");  
        return false;  
    }
    var pwConfirm = document.getElementById("exampleConfirmPassword1").value; 
    if(pw!=pwConfirm){
        alert("**Passwords do not match");  
        return false;  
    }
    return true;
}  