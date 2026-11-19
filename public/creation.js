document.addEventListener("DOMContentLoaded", function() {
    


    document.getElementById("createleaguepage").style.left = "100%";
    document.getElementById("joinleaguepage").style.right = "100%";

    document.getElementById("create").addEventListener("click", function() {
        document.getElementById("createleaguepage").style.display = "block";
        setTimeout(function() {
            document.getElementById("createleaguepage").style.left = "0";
        }, 1);
       
    });


    document.getElementById("join").addEventListener("click", function() {
        document.getElementById("joinleaguepage").style.display = "block";
        setTimeout(function() {
            document.getElementById("joinleaguepage").style.right = "0";
        }, 1);
    });


    document.getElementById("leftarrow").addEventListener("click", function() {

        document.getElementById("createleaguepage").style.left = "100%";
        
        setTimeout(function() {
            document.getElementById("createleaguepage").style.display = "none";
        }, 500);
    });


    document.getElementById("rightarrow").addEventListener("click", function() {

        document.getElementById("joinleaguepage").style.right = "100%";
        
        setTimeout(function() {
            document.getElementById("joinleaguepage").style.display = "none";
        }, 500);
    });


});
