console.log('app.js');
fetch('./cats/all').then((response) => {
   return response.json();
}).then ((json) => {
    console.log(json);
    json.forEach((cat) => {
        // all cats from list
        document.querySelector('#cats').innerHTML += `<li>${cat.name}</li><br>`;
    });
});