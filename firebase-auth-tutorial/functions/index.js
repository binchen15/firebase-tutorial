const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
//

exports.addAdminRole = functions.https.onCall( (data, context) => {

	if (context.auth.token.admin !== true) {
		return {error: 'only admin can add other admins!'}
	}

	return admin.auth().getUserByEmail(data.email).then(user => {
		return admin.auth().setCustomUserClaims(user.uid, {
			admin:true
		}).then(()=>{
			return {
				message: `Success! user ${data.email} has been added as admin`
			}
		}).catch(err=>{
			return err;
		})
	})

})
