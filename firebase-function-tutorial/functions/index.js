const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
//

// endpoint request
exports.randomInt = functions.https.onRequest((request, response) =>{
	const n = Math.round(Math.random()* 100)
	response.send(n.toString());
})

exports.toGoogle = functions.https.onRequest((request, response) =>{
	response.redirect("https://www.google.com");
})

// callables
exports.sayHi = functions.https.onCall((data, context)=>{
	return `Hello, ${data.name}!`;
})

// add request via callable
exports.addRequest = functions.https.onCall((data, context) => {
	if (!context.auth) {
		throw new functions.https.HttpsError('unauthenticated', 
			"only authenticated user can add request")
	};
	if (data.text.length > 30) {
		throw new functions.https.HttpsError('invalid-argument',
			"no more than 30 chars")
	};
	return admin.firestore().collection('requests').add({
		text: data.text,
		upvotes: 0
	});
	
})

// upvote callable
exports.upvote = functions.https.onCall((data, context)=>{
	if (!context.auth) {
		throw new functions.https.HttpsError('unauthenticated', 
			"only authenticated user can add request")
	}
	const user = admin.firestore().collection('users').doc(context.auth.uid);
	const req  = admin.firestore().collection('requests').doc(data.id);
	
	return user.get().then( doc => {
		if (doc.data().upvotedOn.includes(data.id)) {
			throw new functions.https.HttpsError('failed-precondition', 
				"You can vote only once")
		} 
		return user.update({upvotedOn: [...doc.data().upvotedOn, data.id]})
			.then(()=>{
				return req.update({upvotes: admin.firestore.FieldValue.increment(1)})
			})
	})

})


// auth trigger
exports.newUserSignup = functions.auth.user().onCreate(user => {
	console.log('new user created ', user.email, user.uid)
	return admin.firestore().collection('users').doc(user.uid).set({
		email: user.email,
		upvotedOn: []
	})
})
exports.userDeleted = functions.auth.user().onDelete(user => {
	console.log('user deleted ', user.email, user.uid)
	const doc = admin.firestore().collection('users').doc(user.uid)
	return doc.delete();	
})

// firestore trigger for tracking activity
exports.logActivities = functions.firestore.document('/{collection}/{id}')
  .onCreate((snap, context) => {
    console.log(snap.data());

    const activities = admin.firestore().collection('activities');
    const collection = context.params.collection;

    if (collection === 'requests') {
      return activities.add({ text: 'a new tutorial request was added' });
    }
    if (collection === 'users') {
      return activities.add({ text: 'a new user signed up'});
    }

    return null;
});


