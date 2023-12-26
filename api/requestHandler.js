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