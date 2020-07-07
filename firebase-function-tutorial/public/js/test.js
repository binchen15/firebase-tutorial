const but = document.querySelector('.callable');

but.addEventListener('click', (e) => {
    const sayHi = firebase.functions().httpsCallable('sayHi');
    //console.log(sayHi);
    sayHi().then(result => {
      console.log(result.data)
    });
});

