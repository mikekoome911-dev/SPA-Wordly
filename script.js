 const searchForm = document.getElementById('search-form');
 const searchInput = document.getElementById('search-input');
 const resultsDisplay = document.getElementById('results-display');
 const wordHeading = document.getElementById('word-heading');
 const wordPhonetic = document.getElementById('word-phonetic');
 const audioTriggerBtn = document.getElementById('audio-trigger-btn');
 const audioEngine = document.getElementById('audio-element');
 const dynamicContent = document.getElementById('dynamic-lexicon-content');
 const statusMessage = document.getElementById('status-message');

 searchForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const wordToSearch = searchInput.value.trim();
    if (wordToSearch !== "") {
        searchWordInDictionary(wordToSearch);
    }
 });

 function searchWordInDictionary(word) {
    statusMessage.textContent = "Searching for: " + word;
    resultsDisplay.classList.add('hidden');

    const apiURL = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;
    
    fetch(apiURL)
    .then(function(response) {
        if (response.ok === false) {
            throw new Error("Word not found");
        }
        return response.json();
    })
    .then(function(data) {
       if (Array.isArray(data)) {
        displayResultsOnPage(data[0]);
       } else {
        displayResultsOnPage(data);
       }
    })
    .catch(function() {
        statusMessage.textContent = "Could not find any results for '" + word + "'. Try again!";
        resultsDisplay.classList.add('hidden');
    });
 }
 function displayResultsOnPage(wordData) {
    statusMessage.textContent = "";
    resultsDisplay.classList.remove('hidden');
    dynamicContent.innerHTML = "";

    wordHeading.textContent = wordData.word;
    wordPhonetic.textContent = wordData.phonetic || "";

    let audioUrl = ""
    if (wordData.phonetics && wordData.phonetics.length > 0) {
        for (let k = 0; k < wordData.phonetics.length; k++) {
            if (wordData.phonetics[k].audio && wordData.phonetics[k].audio !== "") {
                audioUrl = wordData.phonetics[k].audio;
                break;
            }
        }
    }

    if (audioUrl !== "") {

        if (audioUrl.startsWith("//")) {
            audioUrl = "https:" + audioUrl;
        }
        audioEngine.src = audioUrl;
        audioTriggerBtn.classList.remove('hidden');
    } else {
        audioTriggerBtn.classList.add('hidden');
    }

    for (let i = 0; i < wordData.meanings.length; i++) {
        const currentMeaning = wordData.meanings[i];

        const articleBlock = document.createElement('article');
        articleBlock.classList.add('lexical-unit');

        const label = document.createElement('p');
        label.classList.add('part-of-speech-label');
        label.textContent = currentMeaning.partOfSpeech;
        articleBlock.appendChild(label);

        for (let j = 0; j < currentMeaning.definitions.length; j++) {
            if (j >=2 ) {
                break;
            }

            const singleDefinition = currentMeaning.definitions[j];

            const definitionParagraph = document.createElement('p');
            definitionParagraph.classList.add('definition-sentence');
            definitionParagraph.textContent = (j + 1) + ". " + singleDefinition.definition;

            articleBlock.appendChild(definitionParagraph);
        }

        dynamicContent.appendChild(articleBlock);
    }
 }
 
audioTriggerBtn.addEventListener('click', function() {
    audioEngine.play();
});