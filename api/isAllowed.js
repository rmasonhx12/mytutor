const isAllowed = (email) => {
const friendsList = process.env.ALLOW_LIST.split(',');
return (friendsList.indexOf(email) >= 0);
}