import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputEl = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
console.log(countryList);
const countryInfo = document.querySelector('.country-info');

inputEl.addEventListener(
  'input',
  debounce(searchByContainLetters, DEBOUNCE_DELAY)
);

/**
 *
 * @param {*} event
 * @returns
 */
function searchByContainLetters(event) {
  const name = event.target.value.trim();
  console.log(name);
  console.log(!name);
  if (!name) {
    countryList.innerHTML = '';
    return;
  } else {
    fetchCountries(name).then(actsOnTheLengthOfTheArray).catch(onError);
  }
}

function actsOnTheLengthOfTheArray(arrCountries) {
  if (arrCountries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (arrCountries.length > 1 && arrCountries.length <= 10) {
    console.log(arrCountries);
    console.log(arrCountries[1].languages.map(language => language.name));
    console.log(arrCountries[0].flag);
    console.log(arrCountries[0].name);
    markupForManyCountries(arrCountries);
  } else if (arrCountries.length === 1) {
    // console.log(...arrCountries[1].languages.map(language => language.name));
    markupForOneCountry(...arrCountries);
  } else {
    throw new Error('No data');
  }
}

function markupForManyCountries(arr) {
  const markup = arr.reduce(
    (markup, country) => markup + createMarkup(country),
    ''
  );
  countryList.innerHTML = markup;

  console.log(markup);
}

function createMarkup({ name, flag }) {
  return `
  <li>
    <img src="${flag}">
    <h2>${name}</h2>
  </li>
  `;
}

function markupForOneCountry({ name, capital, population, flag, languages }) {
  countryList.innerHTML = '';
  countryInfo.innerHTML = `
  <div class="country-title"><img src="${flag}"><h2>${name}</h2></div><div class="country-property"><h3>Capital: </h3><p>${capital}</p></div><div class="country-property"><h3>Population: </h3><p>${population}</p></div><div class="country-property"><h3>Languages: </h3><p>${languages.map(
    language => ` ${language.name}`
  )}</p></div>
  `;
}

function onError(err) {
  console.error(err);
  Notiflix.Notify.failure(`Oops, there is no country with that name`);
}
