const cafeList = document.querySelector('#cafe-list');
const cafeForm = document.querySelector('#add-cafe-form')

function renderCafe(doc){

	let li   = document.createElement('li');
	let name = document.createElement('span');
	let city = document.createElement('span');
	let del  = document.createElement('div');

	li.setAttribute('data-id', doc.id);
	name.textContent = doc.data().name;
	city.textContent = doc.data().city;
	del.textContent = 'x'
	
	li.appendChild(name);
	li.appendChild(city);
	li.appendChild(del);

	cafeList.appendChild(li);
	
	del.addEventListener('click', (e)=>{
		e.stopPropagation();
		let id = e.target.parentElement.getAttribute('data-id');
		db.collection('cafes').doc(id).delete();
	})

}


// asynchronous request
//db.collection('cafes').get().then((snapshot) => {
//	snapshot.docs.forEach(doc =>{
//		console.log(doc.data());
//		renderCafe(doc);
//	})
//})

// saving data
cafeForm.addEventListener('submit', (e)=>{
	e.preventDefault();
	db.collection('cafes').add({
		name: cafeForm.name.value,
		city: cafeForm.city.value
	});
	cafeForm.name.value='';
	cafeForm.city.value='';
})

db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
	let changes = snapshot.docChanges();
	changes.forEach(change => {
		if (change.type == 'added') {
			renderCafe(change.doc);
		} else if (change.type == 'removed') {
			let ele = cafeList.querySelector(`[data-id=${change.doc.id}]`);
			cafeList.removeChild(ele);
		}
	})
})



