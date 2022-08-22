/*
    * Name, username, email, password: can't be blank
    * must agree terms & conditions
    * Email must be valid xyz@mail.com
    * password must be 8 or more characters with a mix of letters, numbers & symbols
    * name must be between 3 & 14 characters without numbers
    * username must be between 4 & 12 characters including letters, numbers, .-_ without any other symbols & spaces & can't start with numbers
*/

//? UI Selectors
const UIForm = document.querySelector('#registration-form')

const UIName = document.querySelector('#first-name')
const UIUsername = document.querySelector('#username')
const UIMail = document.querySelector('#email')
const UIPassword = document.querySelector('#password')
const UIPWConfirmation = document.querySelector('#confirm-password')
const UITerms = document.querySelector('#check-agree-terms')
const UINotify = document.querySelector('#notifications')

const UIRequiredElements = [UIName, UIUsername, UIMail, UIPassword, UIPWConfirmation] 

//? Regex
const nameValidation =  /\d/ // if it has numbers show alert

// username: can't start with numbers or symbols, can't have spaces, can't have any symobols but one dot, underscore & hyphen between words
// const usernameValidation = /^\D([a-zA-Z\d]*)([-._]{1,1})?([a-zA-Z\d]*)?([-._]{1,1})?([a-zA-Z\d]*)?\w$/ // \D allows all special characters
const usernameValidation = /^(?!\d|.*?([_.-]).*\1)[\w.-]+$/

// user@mail.com
const emailValidation = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/ // decided to use the html default validation

// password must bet. 8 ~ 14 characters with a mix of letters, numbers & symbols
const passwordValidation = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*_+]).*$/

//? form eventListner
UIForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //Name, username, email, password,: can't be blank
    if(checkRequired(UIRequiredElements)){
        if(checkNameInput(UIName, 3, 14) &&
        checkUsernameInput(UIUsername, 4, 12) &&
        checkPassword(UIPassword, UIPWConfirmation, 6, 12) &&
        checkTerms(UITerms)){
            window.location.href = '/success.html'
        }
    }
})

//? functions

function checkRequired(inputsArray){
    let count = 0
    UINotify.innerHTML = ''
    inputsArray.forEach((input) => {
        if(input.value.trim() === ''){
            showAlert(`${input.id} is Required`)
            count++
        }
    })
    if(count === 0){
        hideAlert()
        return true
    }else{
        return false
    }
}

function checkNameInput(input, min, max){
    if(input.value.length < min || input.value.length > max || nameValidation.test(input.value)){
        showAlert(`Name has to be between ${min} & ${max} characters without numbers`)
        return false
    }else{
        return true
    }
}
function checkUsernameInput(input, min, max){
    // username must be between 4 & 12 characters
    if(
        input.value.length < min ||
        input.value.length > max ||
        usernameValidation.test(input.value) === false
        ){
        showAlert(`${input.id} 4~12 characters, can't have whitespaces, numbers at the begining or any symbols but dot, underscore & dash between words`)
        return false
    }else{
        return true
    }

    // username has to be between 4 & 12 characters
}
function checkPassword(pw, confirmPw, min, max){
    if(pw.value !== confirmPw.value){
        showAlert('passwords doesn\'t match')
    }else if(pw.value.length < min || pw.value.length > max || passwordValidation.test(pw.value) === false) {
        showAlert(`Password must be 8 characters or more with at least 1 capital, 1 small letter & 1 symbol`)
        return false
    }else{
        return true
    }

}
function checkTerms(terms){
    if(terms.checked === false){
        showAlert('Terms & Conditions Agreemend Is Not Checked')
        return false
    }else{
        return true
    }
}

function showAlert(message){    
    UINotify.innerHTML += `<li>${message}</li>`
    if(UINotify.parentElement.classList.contains('d-none')){
        UINotify.parentElement.classList.remove('d-none')
    }

}
function hideAlert(){
    if(UINotify.parentElement.classList.contains('d-none')) return
    UINotify.parentElement.classList.add('d-none')
}