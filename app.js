/*
Amber Allen
January 15th, 2025
Dictionary Application to practice API requests
API: https://dictionaryapi.dev/
*/



//Setting some DOM elements to vars
const userInput = document.querySelector('input');
const submitBtn = document.querySelector('img');
const previousWordsContainer = document.querySelector('#prevWords');
const leftContainer = document.querySelector('#leftContainer');

//Setting first part of api URL to const
const apiURL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

//Counter for previously searched words
let prevWordCount = 0;

//Process input if user submits
window.addEventListener('keydown', (e) => {
    if (e.key === "Enter" && userInput.value) {
        queryUserWord(userInput.value, true);
        userInput.value = '';
    }
})
submitBtn.addEventListener('click', () => {
    if (userInput.value) {
        queryUserWord(userInput.value, true);
        userInput.value = '';
    }
})


//Sends request to API
//If success: calls buildResult() and buildPrevious() (if bool == true)
//If fail:    calls buildWordNotFound()
function queryUserWord(userWord, bool) {
    //Build url
    const fullURL = apiURL + userWord;

    //Query API
    axios.get(fullURL)
        .then(result => {
            console.log();
            buildResult(result.data[0]);
            if (bool) {
                buildPrevious(result.data[0].word, result.data[0].meanings[0].definitions[0].definition);
            }
        })
        .catch(e => {
            buildWordNotFound(userWord);
        })
}



//This builds and adds a display to the page that lets user know word wasnt found
function buildWordNotFound(word) {
    leftContainer.firstElementChild.remove();

    const resultContainer = document.createElement('div');
    resultContainer.setAttribute('id', "resultContainer");

    const resultHeader = document.createElement('div');
    resultHeader.setAttribute('id', "resultHeader");
    resultContainer.append(resultHeader);

    const resultHeaderH2 = document.createElement('h2');
    resultHeaderH2.innerText = `'${word}' not found. Please try a different word`;
    resultHeader.append(resultHeaderH2);

    const defContainer = document.createElement('div');
    defContainer.setAttribute('id', "definitionsContainer");
    resultContainer.append(defContainer);

    const defConH3 = document.createElement('h3');
    defConH3.innerText = "Definitions";
    defContainer.append(defConH3);

    const defDiv = document.createElement('div');
    defDiv.setAttribute('id', "definitions");
    defContainer.append(defDiv);

    leftContainer.append(resultContainer);
}



//Maps through results from API and builds/displays the results to user
function buildResult(data) {
    //Remove old result
    leftContainer.firstElementChild.remove();

    const resultContainer = document.createElement('div');
    resultContainer.setAttribute("id", "resultContainer");

    const resultHeader = document.createElement('div');
    resultHeader.setAttribute('id', 'resultHeader');
    const resultHeaderH1 = document.createElement('h1');
    resultHeaderH1.innerText = data.word;
    resultHeader.append(resultHeaderH1);
    const resultHeaderH2 = document.createElement('h2');
    resultHeaderH2.innerText = data.phonetic;
    resultHeader.append(resultHeaderH2);

    //Add complete header div to main container. 
    resultContainer.append(resultHeader);

    const defContainer = document.createElement('div');
    defContainer.setAttribute('id', 'definitionsContainer');
    resultContainer.append(defContainer);

    const defContainerH3 = document.createElement('h3');
    defContainerH3.innerText = "Definitions";
    defContainer.append(defContainerH3);


    const definitions = document.createElement('div');
    definitions.setAttribute('id', 'definitions');
    defContainer.append(definitions);

    //Now we go through. for each def, print the below
    let defCounter = 1;
    console.log(data);
    //data.meaning (ARRAY)
    //For each entry in data.meaning...
    data.meanings.map(entry => {
        //Save the part of speech here entry.partOfSpeech
        let partOfSpeech = entry.partOfSpeech;
        entry.definitions.map(def => {
            const defCon = document.createElement('div');
            defCon.className = "entry";

            const defBElement = document.createElement('b');
            defBElement.className = "defTitle";
            defBElement.innerText = `${defCounter}. ${partOfSpeech}`;
            defCounter += 1;
            defCon.append(defBElement);

            const defPElement = document.createElement('p')
            defPElement.innerText = def.definition;
            defCon.append(defPElement);

            definitions.append(defCon);
        })
    })

    leftContainer.append(resultContainer);
}


//Builds and adds new word/definition to previous words section on page
function buildPrevious(word, def) {
    prevWordCount += 1;
    //Make the container
    const container = document.createElement('div');
    container.className = 'prevWordEntry';

    //Build and add the elements to container
    const aElement = document.createElement('a');
    const bElement = document.createElement('b');
    bElement.innerText = prevWordCount + ". ";
    const spanElement = document.createElement('span');
    spanElement.className = "word";
    spanElement.innerText = word;
    bElement.append(spanElement);
    aElement.append(bElement);
    const pElement = document.createElement('p');
    pElement.innerText = def;
    container.append(aElement);
    container.append(pElement);

    //Add the eventListener to new a
    aElement.addEventListener('click', (e) => {
        queryUserWord(e.explicitOriginalTarget.innerText, false);
    })

    //Add container to previousWords
    previousWordsContainer.append(container);
}




