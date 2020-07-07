const authSwitchLinks = document.querySelectorAll('.switch');
const authModals = document.querySelectorAll('.auth .modal');
const authWrapper = document.querySelector('.auth');
const registerForm = document.querySelector('.register');
const loginForm = document.querySelector('.login');
const signout = document.querySelector('.sign-out');

authSwitchLinks.forEach(link=>{
	link.addEventListener('click', (e)=>{
		authModals.forEach(modal => {
			modal.classList.toggle('active');
		})
	})
})

// register new user
registerForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const email = registerForm.email.value;
	const password = registerForm.password.value;

	console.log(email, password);
	firebase.auth().createUserWithEmailAndPassword(email, password).then(cred =>{
		console.log(cred.user.uid)
		registerForm.reset();
	}).catch(err=>{
		registerForm.querySelector('.error').textContent=err.message;
		console.log(err.message)
	})

})


// login user
loginForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const email = loginForm.email.value;
	const password = loginForm.password.value;

	firebase.auth().signInWithEmailAndPassword(email, password)
		.then(user =>{
			console.log('logged in, ', user);
			loginForm.reset();
		}).catch(err=>{
			loginForm.querySelector('.error').textContent=err.message;
			console.log(err.message)
	})
});

// register auth listener
firebase.auth().onAuthStateChanged(user => {
	if (user) {
			authWrapper.classList.remove('open');
			authModals.forEach(modal=>modal.classList.remove('active'));
	} else {
			authWrapper.classList.add('open');
			authModals[0].classList.add('active');	
	}
})

signout.addEventListener('click', (e) => {
	firebase.auth().signOut().then(()=>{
			console.log('user signed out!')
		});
})


