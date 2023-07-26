const inputSlider= document.querySelector("[data-lengthSlider]");
const lengthDisplay= document.querySelector("[data-lengthNumber]");
const passwordDisplay= document.querySelector("[data-passwordDisplay");
const copyBtn= document.querySelector("[data-copy]");
const copyMsg= document.querySelector("[data-copyMsg]");
const uppercaseCheck= document.querySelector("#uppercase");
const lowercaseCheck= document.querySelector("#lowercase");
const numbersCheck= document.querySelector("#numbers");
const symbolsCheck= document.querySelector("#symbols");
const indicator= document.querySelector("[data-indicator]");
const generateBtn= document.querySelector(".generate-Btn");
const allCheckBox= document.querySelectorAll("input[type=checkbox]")
const symbols= '~`!@#$%^&*()_-=+{}[]|:;"<>,.?/';

let password= "";
let passwordLength= 10;
let checkCount= 0;
handleSlider(); // initially slider ki value ko 10 set kardege on refresh
// set strength circle to grey;
setIndicator('#ccc');

// set the password length
function handleSlider(){    // slider value ko change karne pe ui pe affect
    inputSlider.value= passwordLength;
    lengthDisplay.innerHTML =passwordLength;
    const min= inputSlider.min;
    const max= inputSlider.max;
    inputSlider.style.backgroundSize= ((passwordLength-min)*100/(max-min)) + "% 100%";
}

// set indiacator color
function setIndicator(color){
    indicator.style.backgroundColor = color;
    // apply shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min+1)) +min;
}

function getRandomNumber(){
    return getRndInteger(0,9);
}
function getLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function getUpperCase(){
    return String.fromCharCode(getRndInteger(65,90));
}
function getSymbol(){
    const randNum= getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper= false;
    let hasLower= false;
    let hasNum= false;
    let hasSym= false;
    if (uppercaseCheck.checked)hasUpper= true;
    if (lowercaseCheck.checked)hasLower= true;
    if (numbersCheck.checked)hasNum= true;
    if (symbolsCheck.checked)hasSym= true;
    if (hasUpper && hasLower && (hasNum||hasSym) && passwordLength>=8){
        setIndicator('#0f0');
    }
    else if ((hasLower||hasUpper) && (hasNum && hasSym) && passwordLength>=6){
        setIndicator('#ff0');
    }
    else{
        setIndicator('#f00');
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText= "copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    // to make copy wla span visisble and then invisible
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

// Event Listeners are added on how to respond to the events to call the functions
// Event listener on event slide
inputSlider.addEventListener('input',(e)=>{
    passwordLength= e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
    if (passwordDisplay.value){
        copyContent();
    }
});

generateBtn.addEventListener('click',()=>{
    //none of the checkbox are seelcted
    if (checkCount==0)return;

    if (passwordLength<checkCount){
        passwordLength= checkCount;
        handleSlider();
    }

    // let's start journey to find new password
    password= "";   // remove old password
    // lets put the stuff mentioned in the checkboxes
    /* if (uppercaseCheck.checked){
        password+= getUpperCase();
    }
    if (lowercaseCheck.checked){
        password+= getLowerCase();
    }
    if (numbersCheck.checked){
        password+= getRandomNumber();
    }
    if (symbolsCheck.checked){
        password+= getSymbol();
    } */
    let functArr= [];
    if (uppercaseCheck.checked){
        functArr.push(getUpperCase);
    }
    if (lowercaseCheck.checked){
        functArr.push(getLowerCase);
    }
    if (numbersCheck.checked){
        functArr.push(getRandomNumber);
    }
    if (symbolsCheck.checked){
        functArr.push(getSymbol);
    }
    // compulsory addition
    for (let i=0; i<functArr.length; i++){
        password+= functArr[i]();
    }
    // remaining characters
    for (let i=0; i<passwordLength-functArr.length; i++){
        let randIndex= getRndInteger(0,functArr.length-1);
        password+= functArr[randIndex]();
    }
    // shuffle ka elements kyu ki phela hamesha upper 2nd lower 3rd no 4th symbol fix ho gya tha
    password= shufflePassword(Array.from(password)); // password ko array mein convert karke pass krna
    // display password
    passwordDisplay.value= password;
    //calculate strength
    calcStrength();
});

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
});
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if (checkbox.checked)checkCount++;
    });
    if (passwordLength<checkCount){
        passwordLength= checkCount;
        handleSlider();
    }
}
function shufflePassword(arr){
    // Fisher Yates method
    for (let i= arr.length-1; i>0; i--){
        const j= Math.floor(Math.random()*(i+1));   // random index
        const temp= arr[i]; //swap
        arr[i]= arr[j];
        arr[j]= temp;
    }
    let str="";
    arr.forEach((el)=>(str+=el));
    return str;
}

