// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;

let settings = document.querySelector('header > img');
let heading = document.querySelector('header > h1');

// Make sure you register your service worker here too

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js').then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://cse110lab6.herokuapp.com/entries')
    .then(response => response.json())
    .then(entries => {
      let entryCounter = 1;
      
      // looping through entries
      entries.forEach(entry => {
        let entryID = entryCounter;

        let newPost = document.createElement('journal-entry');
        newPost.entry = entry;
        document.querySelector('main').appendChild(newPost);
        newPost.addEventListener('click', () => {
          setState('entry', entryID, newPost.entry);
        });
        entryCounter++;
      });
      
    });
    
});

settings.addEventListener('click', () => {
  if(history.state == null || history.state.page != 'settings')
    setState('settings');
});

heading.addEventListener('click', () => {
  if (history.state != null && history.state.page != 'home')
    setState('home');
})

window.onpopstate = (event) => {
  if (event.state == null) {
    setState('home', 0, null, false);
  } else {
    if('entryNum' in event.state && 'entry' in event.state) {
      setState(event.state.page, event.state.entryNum, event.state.entry, false);
    }
    else {
      setState(event.state.page, 0, null, false);
    }
  }
}