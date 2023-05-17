const APIURL = ` https://api.dictionaryapi.dev/api/v2/entries/en/`;
const form = document.querySelector("#form");
const inpWord = document.querySelector(".inputWord");
const appContent = document.querySelector(".app-content");

const searchedWord = document.querySelector(".word");
const phonetics = document.querySelector(".phonetics");
const meaning = document.querySelector(".meaning");
const examples = document.querySelector(".examples");
const audioTag = document.querySelector("#audioTag");
const audioIcon = document.querySelector("#audioIcon");
const errorMsg = document.querySelector(".errorMes");

window.onload = () => {
    let word = "dictionary";
    getDef(word)
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let userWord = inpWord.value;
    getDef(userWord)
    e.target.reset();
})


async function getDef(userWord){
    let serverResponse = await fetch(APIURL + userWord);
    let resp = await serverResponse.json();
    let data = resp;

    if(data.title == 'No Definitions Found'){
        errorMsg.style.display = `block`;
        setTimeout( () => {
            errorMsg.style.display = "none";
        }, 3000)
        return;
    }

    getAudio(data[0].phonetics)
    getWord(data[0].word);
    getPhonetic(data[0].phonetic);
    writeDefinition(data[0].meanings);
    getExamples(data[0].meanings)
}


function getAudio(data){
    let audio = "";
    data.forEach( item => {
        if(item.audio !== ""){
            audio = item.audio;
            return;
        }
    })

    if(audio == undefined || audio === ""){
        audioIcon.style.color = `red`;
        audioTag.src = ``;
        
    }else{
        audioTag.src = `${audio}`;
        audioIcon.style.color = `plum`;
    }
}

function getPhonetic(data){
    if(data === "" || data === undefined){
        phonetics.innerText = ""
    }else{
        phonetics.innerText = `${data}`
    }
}

function getWord(data){
    searchedWord.innerHTML = ``;
    let name = data.charAt(0).toUpperCase() + data.slice(1,data.length).toLowerCase();
    searchedWord.innerText = name;
}

function writeDefinition(array){
    meaning.innerHTML = ``;
    let meanings;
    let datas = array;

    datas.forEach( data => {
        if(data == undefined){
            return;
        }else{
            meanings += `
                <span class="eachMean">
                    <div class="partOfSpeech">${data.partOfSpeech}</div>
                    ${data.definitions[0].definition}
                </span>
            `
        }
    })
    meaning.innerHTML = meanings;

    meaning.removeChild(meaning.childNodes[0])
}

function getExamples(data){
    let datas = data[0].definitions;

    let exmps = [];
    let fix = []
    datas.forEach( (data) => {
        if(data.example != "" && data.example != undefined && !(data.example.includes(";"))){
            exmps.push(data.example)
        }else if(data.example != "" && data.example != undefined && (data.example.includes(";"))){
            fix.push(data.example)
        }
    })

    fix.forEach( (item) => {
        let fixing = item;
        let newSentence = fixing.split(";");
        let fixedSentence = newSentence[0] + ", " + newSentence[1].trim();
        exmps.push(fixedSentence);
    })

    if(exmps.length <= 0){
        examples.innerHTML = ``
    }else{
        examples.innerHTML = ``;
        examples.innerHTML += `<div class="ex-head">Examples</div>`
        let examp;
        
        exmps.forEach( (item) => {
            examp += `
                <div class="ex">${item}</div>
            `
        })
        examples.innerHTML += examp;
        examples.removeChild(examples.childNodes[1])
    }
}

audioIcon.addEventListener("click", () => {
    let audioCheck = (audioTag.attributes[0].nodeValue);
    if(audioCheck === "" || audioCheck === undefined){
        return
    }else{
        audioTag.currentTime = 0;
        audioTag.play()
    }
    
})