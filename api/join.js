var jsonwebtoken = require('jsonwebtoken');
var uuid = require('uuid-random');
var crypto = require('crypto');

// Helper function to generate an avatar with the help of Gravatar
const generateAvatar = (email) => {
	const hash = crypto.createHash('md5').update(email).digest("hex");
	return 'https://www.gravatar.com/avatar/' + hash;
}

// Our super secure Access Management System :)
const isAllowed = (email) => {
	const friendsList = process.env.ALLOW_LIST.split(',');
	return (friendsList.indexOf(email) >= 0);
}

// Generate a Room Name
const generateRoomName = () => {
	return process.env.JAAS_APP_ID + '/' + process.env.JAAS_ROOM_NAME;
}

// JWT Generator -- Takes user's name and email address
const generateJWT = (name, email, roomName) => {

	// Configure the JWT Header
	const key = process.env.JAAS_KEY_ID;
	const header = { algorithm: 'RS256', keyid: key };
	
	// Get the current time and set the time boundaries of the JWT
	const now = new Date();
	const expiration = Math.round(now.setHours(now.getHours() + 3) / 1000);
	const notBefore = (Math.round((new Date).getTime() / 1000) - 10);
	
	// Build the JWT Payload
	const avatar = generateAvatar(email);
	const id = uuid();
	const payload = {
		aud: 'jitsi',
		context: {
			user: { 
				id, 
				name, 
				avatar, 
				email: email, 
				moderator: 'true' 
			},
			features: {
				livestreaming: 'true',
				recording: 'true',
				transcription: 'true',
				"outbound-call": 'true'
			}
		},
		iss: 'chat',
		room: '*',
		sub: process.env.JAAS_APP_ID,
		exp: expiration,
		nbf: notBefore
	};

	// Load and decode the Private Key from the ENV
	let buff = Buffer.from(process.env.JAAS_PRIVATE_KEY, 'base64');
	const privateKey = buff.toString('ascii')

	// Finally, sign the JWT
	return jsonwebtoken.sign(
		payload, 
		privateKey, 
		header
	);
}

// Request Handler
export default async (req, res) => {

	// Parse the JSON request
	const { body } = req;
	const email = body.email.trim().toLowerCase();
	const roomName = generateRoomName();

	// Construct our default response payload
	res.statusCode = 403;
	const payload = { 
		email:  body.email,
		success: false
	};

	// Check to see if the user is allowed, if so make them a JWT.
	if (isAllowed(body.email)) {
		payload.key = generateJWT(email, email, roomName);
		payload.room = roomName;
		payload.success = true;
		res.statusCode = 200;
	}
	
	// Construct Response
	res.setHeader("Content-Type", "application/json");
	res.send(JSON.stringify(payload));
}
