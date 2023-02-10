import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputEl = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputEl.addEventListener(
  'input',
  debounce(searchByContainLetters, DEBOUNCE_DELAY)
);

/**
 * by event searches for a country by the entered letter combination
 * @param {*} event Object
 * @returns the function terminates if the input is cleared
 */
function searchByContainLetters(event) {
  const name = event.target.value.trim();
  if (!name) {
    cleanMarkup();
    return;
  } else {
    fetchCountries(name).then(actsOnTheLengthOfTheArray).catch(onError);
  }
}

/**
 * performs different functions depending on the length of the resulting array
 * @param {*} arrCountries Object array of objects
 */
function actsOnTheLengthOfTheArray(arrCountries) {
  if (arrCountries.length > 10) {
    cleanMarkup();
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (arrCountries.length > 1 && arrCountries.length <= 10) {
    markupForManyCountries(arrCountries);
  } else if (arrCountries.length === 1) {
    markupForOneCountry(...arrCountries);
  } else {
    throw new Error('No data');
  }
}

/**
 *
 * @param {*} arr
 */
function markupForManyCountries(arr) {
  cleanMarkup();
  const markup = arr.reduce(
    (markup, country) => markup + createMarkup(country),
    ''
  );
  countryList.innerHTML = markup;

  console.log(markup);
}

/**
 *
 * @param {*} param0
 * @returns
 */
function createMarkup({ name, flag }) {
  return `
  <li>
    <img src="${flag}">
    <h2>${name}</h2>
  </li>
  `;
}

/**
 *
 * @param {*} param0
 */
function markupForOneCountry({ name, capital, population, flag, languages }) {
  cleanMarkup();
  countryInfo.innerHTML = `
  <div class="country-title"><img src="${flag}"><h2>${name}</h2></div><div class="country-property"><h3>Capital: </h3><p>${capital}</p></div><div class="country-property"><h3>Population: </h3><p>${population}</p></div><div class="country-property"><h3>Languages: </h3><p>${languages.map(
    language => ` ${language.name}`
  )}</p></div>
  `;
}

/**
 *
 * @param {*} err
 */
function onError(err) {
  console.error(err);
  cleanMarkup();
  Notiflix.Notify.failure(`Oops, there is no country with that name`);
}

/**
 *
 */
function cleanMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
