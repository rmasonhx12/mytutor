    const generateAvatar = (email) => {
	const hash = crypto.createHash('md5').update(email).digest("hex");
	return 'https://www.gravatar.com/avatar/' + hash;
}