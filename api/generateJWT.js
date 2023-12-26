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
view raw