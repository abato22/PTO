//VIEWING PASSWORD
const checkBox = document.getElementById("checkbox-id");
checkBox.addEventListener("click", viewPassword);

function viewPassword(){
    const word = document.getElementById("pass-id");
    //if type of word is password one change it to text type of word
    if(word.type === "password"){
      word.type = "text";
    } 
    //change back to password if it is text type
    else{
      word.type = "password";
    }
}


const cookie = document.getElementById("sign-in-form")
cookie.addEventListener("submit", setCookie)
//function that is setting a cookie with name user and value of email and password that were used
function setCookie(){
  const email = document.getElementById("email-id")
  const password = document.getElementById("pass-id")
  const user = "user"
  const data = email.value + " , " + password.value
  document.cookie = user + "=" + data + ";SameSite=None; Secure;"
}