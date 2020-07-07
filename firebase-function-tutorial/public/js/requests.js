const notification = document.querySelector('.notification');
const showNotification = (message) => {
  notification.textContent = message;
  notification.classList.add('active');
	setTimeout(()=>{
		notification.classList.remove('active');
		notification.textContent = "";
	}, 3000)
}



var app = new Vue({
	el: '#app',
	data: {
		requests: []
	},
	methods: {
		upvoteRequest(id) {
			console.log(id);
			const upvote = firebase.functions().httpsCallable('upvote');
			upvote({id}).catch(err=>{
				console.log(err.message);
				showNotification(err.message);
			})
		}
	},
	mounted() {
		const ref = firebase.firestore().collection('requests');
		ref.onSnapshot(snapshot => {
			let requests = [];
			snapshot.docs.forEach(doc => {
				requests.push({...doc.data(), id: doc.id})
			});
			this.requests = requests;
		})
}})


//const ref = firebase.firestore().collection('requests')
//ref.onSnapshot(snapshot=>{
//	//console.log(snapshot.docs);
//	let requests = [];
//	snapshot.docs.forEach(doc => {
//		requests.push({...doc.data(), id: doc.id})
//	});
//	console.log(requests);
//	let html = '';
//	requests.forEach(request =>{
//		html += `<li>${request.text}</li>`
//	})
//	document.querySelector('ul').innerHTML = html;
//})
