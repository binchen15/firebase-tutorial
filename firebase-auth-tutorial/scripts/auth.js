
// retrieve data
db.collection('guides').get().then(snapshot=>{
	console.log(snapshot.docs);
})


// user==null if signed out
auth.onAuthStateChanged( user =>{
	console.log(user);
	if (user) {
		console.log('user logged in', user);
	} else {
		console.log('user logged out');
	}
})


const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const email = signupForm['signup-email'].value;
	const password = signupForm['signup-password'].value;
	console.log(email, password);

	// signup user (must be enabled first)
	auth.createUserWithEmailAndPassword(email,password).then(
		cred => {
			//console.log(cred.user);
			const modal = document.querySelector('#modal-signup');
			signupForm.reset(); 	
			M.modal.getInstance(modal).close();
		}).catch(error => {
			console.log(error.code);
			console.log(error.message);
		})

})

const logout = document.getElementById('logout');
logout.addEventListener('click', (e) => {
	e.preventDefault();
	auth.signOut().then(()=>{
		console.log('user signed out...')
	});
})

const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', (e) => {
	console.log('here');
	e.preventDefault();
	const email = loginForm['login-email'].value;
	const password = loginForm['login-password'].value;
	auth.signInWithEmailAndPassword(email, password).then( (cred) => {
		//console.log(cred.user);
		const modal = document.querySelector('#modal-login');
		M.Modal.getInstance(modal).close();
		loginForm.reset();
	})
})

