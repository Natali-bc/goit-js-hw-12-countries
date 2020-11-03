import css from './css/style.css';
import debounce from '../node_modules/lodash.debounce/index.js';
import { error, defaultModules } from '../node_modules/@pnotify/core';
import * as PNotifyDesktop from '../node_modules/@pnotify/desktop';
import '../node_modules/@pnotify/core/dist/BrightTheme.css';
import '../node_modules/@pnotify/core/dist/PNotify.css';

const inputContainer = document.querySelector('.inputContainer');
const countryUl = document.querySelector('.country-ul');
const clearBtn = document.querySelector('.clearBtn');
const resultSearch = document.querySelector('.result');

defaultModules.set(PNotifyDesktop, {});
resultSearch.innerHTML = localStorage.getItem('countryDiv') || '';
inputContainer.value = '';

const inputFunction = function () {
  if (inputContainer.value == '') {
    countryUl.innerHTML = '';
  }
  fetch(`https://restcountries.eu/rest/v2/name/${inputContainer.value}`)
    .then(data => data.json())
    .then(data => {
      countryUl.innerHTML = '';
      if (data.length > 10) {
        const errNotice2 = error({
          title: 'Too many matches found',
          text: 'Please try again',
          delay: 2000,
          modules: new Map([...defaultModules, [PNotifyDesktop, {}]]),
        });
        return;
      }
      data.forEach(element => {
        if (data.length === 1) {
          resultSearch.innerHTML = '';
          resultSearch.insertAdjacentHTML(
            'beforeend',
            `
      <h2>${element.name}</h2>
      <img width="200" src="${element.flag}">
      <ul>
      <li>Capital: ${element.capital}</li>
      <li>Population: ${element.population}</li>
      <li>Languages:
        <ul class="languages-list"></ul>      
      </li>
      </ul>
      `,
          );

          element.languages.forEach(({ name }) => {
            document
              .querySelector('.languages-list')
              .insertAdjacentHTML('beforeend', `<li>${name}</li>`);
          });
          localStorage.setItem('countryDiv', resultSearch.innerHTML);
        }
        if (data.length > 1 && data.length < 10) {
          countryUl.insertAdjacentHTML(
            'afterbegin',
            `<li class="countryList">${element.name}</li>`,
          );
          document
            .querySelector('.countryList')
            .addEventListener('click', () => {
              resultSearch.innerHTML = '';
              resultSearch.insertAdjacentHTML(
                'beforeend',
                `
        <h2>${element.name}</h2>
         <img width="200" src="${element.flag}">
         <ul>
         <li>Capital: ${element.capital}</li>
         <li>Population: ${element.population}</li>
         <li>Languages: 
           <ul class="languages-list"></ul>         
         </li>
         </ul>
         `,
              );

              element.languages.forEach(({ name }) => {
                document
                  .querySelector('.languages-list')
                  .insertAdjacentHTML('beforeend', `<li>${name}</li>`);
              });
              localStorage.setItem('countryDiv', resultSearch.innerHTML);
            });
        }
      });
    })
    .catch(err => {
      const errNotice = error({
        title: 'Enter correctly',
        text: 'Please try again',
        delay: 2000,
        modules: new Map([...defaultModules, [PNotifyDesktop, {}]]),
      });
    });
};
inputContainer.addEventListener('input', debounce(inputFunction, 500));
const cleaner = function () {
  inputContainer.value = '';
};

clearBtn.addEventListener('click', cleaner);
