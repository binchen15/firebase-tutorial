
// add admin cloud functions to user of email
const adminForm = document.querySelector('.admin-actions')
adminForm.addEventListener('submit', e=>{
	e.preventDefault();
	const email = adminForm['admin-email'].value;
	console.log(email);
	const addAdminRole = functions.httpsCallable('addAdminRole');
	addAdminRole({email:email}).then(result=>{
		console.log(result);
	});
})


// user==null if signed out
auth.onAuthStateChanged( user => {
	if (user) {
		user.getIdTokenResult().then(idTokenResult =>{
			console.log(idTokenResult.claims.admin);
			user.admin = idTokenResult.claims.admin;
			setupUI(user);
		})
		console.log('user logged in', user);
		// retrieve data
		db.collection('guides').onSnapshot(snapshot => {
			console.log(snapshot.docs);
			setupGuides(snapshot.docs);
		})
	} else {
			console.log('user logged out');
			setupGuides([]);
			setupUI(user);
	}
})


const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const email = signupForm['signup-email'].value;
	const password = signupForm['signup-password'].value;

	// signup user (must be enabled first)
	auth.createUserWithEmailAndPassword(email,password).then(cred => {
			//console.log(cred.user);
			return db.collection('users').doc(cred.user.uid).set({
				bio: signupForm['signup-bio'].value
			});
		}).then( () => {
			const modal = document.querySelector('#modal-signup');
			signupForm.reset(); 	
			signupForm.querySelector('.error').innerHTML = "";
			M.Modal.getInstance(modal).close();
		}).catch( error => {
			console.log(error.message);
			signupForm.querySelector('.error').innerHTML = error.message;
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
		loginForm.querySelector('.error').innerHTML = "";
	}).catch(error => {
		loginForm.querySelector('.error').innerHTML = error.message;
	})
})

const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e)=>{
	e.preventDefault();
	const title = createForm['title'].value;
	const content = createForm['content'].value;
	db.collection('guides').add({
		title:title,
		content:content
	}).then( () => {
		createForm.reset();
		const modal = document.querySelector('#modal-create');
		M.Modal.getInstance(modal).close();
	}).catch(error=>{
		console.log(error.message);
	});
})

