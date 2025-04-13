import axios from 'axios';
import debounce from 'debounce';

import { notice, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const searchInput = document.querySelector(".search__input");
const autocomplete = document.querySelector(".search__autocomplete");
const autocompleteList = document.querySelector(".search__autocomplete-list");
const countryCardContainer = document.querySelector(".search__country-card-container");

async function getCountry(valueInput) {
    try {
        const { data } = await axios.get(`https://restcountries.com/v3.1/name/${valueInput}`);
        autocompletePush(data);   
    } catch (error) {
        console.error('Error fetching data:', error);
        showError();
        autocompletePush([]);
    }
}

function showError() {
    error({
        text: 'Unfortunately nothing was found 😔',
        delay: 3000,
    });
}
function showNotice() {
    notice({
        text: 'Too many matches found. Please enter a more specific query! 😬',
        delay: 3000,
    });
}

function onOffAutocomplet(status) {
    let onOffStatus = status;
    if (onOffStatus) {
        autocomplete.classList.add("activ");
    } else {
        autocomplete.classList.remove("activ");
    }
}
function onOffCardContainer(status) {
    let onOffStatus = status;
    if (onOffStatus) {
        countryCardContainer.classList.add("activ");
    } else {
        countryCardContainer.classList.remove("activ");
    }
}

function autocompletePush(countrys) {
    autocompleteList.innerHTML = " ";
    let countrysArr = [];
    if (countrys.length > 1) {
        onOffAutocomplet(true);
        onOffCardContainer(false);
    } else {
        onOffAutocomplet(false);
        onOffCardContainer(true)
    }

    if (countrys.length === 1) {
        const templateSource = document.getElementById('country-card-template').innerHTML.trim();
        const template = Handlebars.compile(templateSource);

        const cardContainer = document.querySelector('.search__country-card-container');
        cardContainer.innerHTML = " ";

        countrys.forEach(country => {
            const html = template(country);
            cardContainer.innerHTML += html;
        });
    }

    if (countrys.length <= 10) {
        countrysArr = countrys;
    } else {
        showNotice();
        countrysArr = countrys.slice(0, 10);
    }
    
    const markupName = countrysArr.map(country => {
        return `
            <li class="search__autocomplete-list-item">${country.name.common}</li>
        `;
    });
    autocompleteList.innerHTML = markupName.join("");
    
}

function searchCountry() {
    const userCountry = searchInput.value;
    if (userCountry.length >= 1) {
        getCountry(userCountry);
    } else {
        autocompletePush([]);
    }
}

searchInput.addEventListener("input", debounce(searchCountry, 200));

