import { 
    checkAuth, 
    getCharacter,
    logout, 
    createDefaultCharacter,
    updateBottom,
    updateHead,
    updateMiddle,
    updateCatchphrases
} from '../fetch-utils.js';

checkAuth();

const headDropdown = document.getElementById('head-dropdown');
const middleDropdown = document.getElementById('middle-dropdown');
const bottomDropdown = document.getElementById('bottom-dropdown');
const headEl = document.getElementById('head');
const middleEl = document.getElementById('middle');
const bottomEl = document.getElementById('bottom');
const reportEl = document.getElementById('report');
const catchphrasesListEl = document.getElementById('catchphrases');
const catchphraseInput = document.getElementById('catchphrase-input');
const catchphraseButton = document.getElementById('catchphrase-button');
const logoutButton = document.getElementById('logout');

// we're still keeping track of 'this session' clicks, so we keep these lets
let headCount = 0;
let middleCount = 0;
let bottomCount = 0;

headDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    headCount++;

    // update the head in supabase with the correct data
    const updatedCharacter = await updateHead(headDropdown.value);
    refreshData(updatedCharacter);
});


middleDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    middleCount++;
    // update the middle in supabase with the correct data
    const updatedCharacter = await updateMiddle(middleDropdown.value);
    refreshData(updatedCharacter);
});


bottomDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    bottomCount++;
    // update the bottom in supabase with the correct data
    const updatedCharacter = await updateBottom(bottomDropdown.value);
    refreshData(updatedCharacter);
});

catchphraseButton.addEventListener('click', async() => {
    // go fetch the old catch phrases
    const character = await getCharacter();
    const newCatchphraseArr = character.catchphrases;
    // update the catchphrases array locally by pushing the new catchphrase into the old array
    newCatchphraseArr.push(catchphraseInput.value);
    // catchphrase.push(catchphraseInput.value);
    await updateCatchphrases(newCatchphraseArr);
    // update the catchphrases in supabase by passing the mutated array to the updateCatchphrases function
    refreshData();
    catchphraseInput.value = '';
});

window.addEventListener('load', async() => {
    //on load, attempt to fetch this user's character
    const character = await getCharacter();
    // if this user turns out not to have a character
    if (!character) {
        await createDefaultCharacter(character);

    } else {
        await fetchAndDisplayCharacter();
    }
    // and put the character's catchphrases in state (we'll need to hold onto them for an interesting reason);
    // then call the refreshData function to set the DOM with the updated data
    refreshData();
});

logoutButton.addEventListener('click', () => {
    logout();
});

function displayStats() {
    reportEl.textContent = `In this session, you have changed the head ${headCount} times, the body ${middleCount} times, and the pants ${bottomCount} times. And nobody can forget your character's classic catchphrases:`;
}

async function fetchAndDisplayCharacter() {
    // fetch the character from supabase
    const character = await getCharacter();
    // if the character has a head, display the head in the dom
    if (character.head) {
        headEl.textContent = '';
        const img = document.createElement('img');
        img.src = `../assets/${character.head}-head.png`;
        headEl.append(img);
    }

    // if the character has a middle, display the middle in the dom
    if (character.middle) {
        middleEl.textContent = '';
        const img = document.createElement('img');
        img.src = `../assets/${character.middle}-middle.png`;
        middleEl.append(img);
    }
    // if the character has a pants, display the pants in the dom
    if (character.bottom) {
        bottomEl.textContent = '';
        const img = document.createElement('img');
        img.src = `../assets/${character.bottom}-pants.png`;
        bottomEl.append(img);

    }
    // loop through catchphrases and display them to the dom (clearing out old dom if necessary)
    catchphrasesListEl.textContent = '';
    for (let catchphrase of character.catchphrases) {
        const catchphraseEl = document.createElement('p');
        catchphraseEl.classList.add('catchphrase');
        catchphraseEl.textContent = catchphrase;
        catchphrasesListEl.append(catchphraseEl);
    }
}
function refreshData() {
    displayStats();
    fetchAndDisplayCharacter();
}
