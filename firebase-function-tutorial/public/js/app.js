const requestModal = document.querySelector('.new-request');
const requestLink = document.querySelector('.add-request');
const requestForm = document.querySelector('.new-request form');
const but = document.querySelector('.call');
//const notification = document.querySelector('.notification');

but.addEventListener('click', (e) => {
    const sayHi = firebase.functions().httpsCallable('sayHi');
    //console.log(sayHi);
    sayHi({name:"Bin"}).then(result => {
      console.log(result.data)
    });
});

// add new request
requestForm.addEventListener('submit', e => {
	e.preventDefault();
	const addRequest = firebase.functions().httpsCallable('addRequest');
	addRequest({text: requestForm.request.value}).then(() => {
		requestForm.reset();
		requestForm.querySelector('.error').textContent = "";
		requestModal.classList.remove('open');
	}).catch(err=>{
		requestForm.querySelector('.error').textContent = err.message;
	})

})


// open request modal
requestLink.addEventListener('click', (e) => {
	console.log('here');
  requestModal.classList.add('open');
});

// close request modal
requestModal.addEventListener('click', (e) => {
  if (e.target.classList.contains('new-request')) {
    requestModal.classList.remove('open');
  }
});

//const showNotification = (message) => {
//	notification.textContent = message;
//	notification.classList.add('active');
//}
