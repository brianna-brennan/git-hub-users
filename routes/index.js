var express = require('express');
var router = express.Router();

// require the node-fetch library
const fetch = require('node-fetch');

const token = process.env.GITHUB_TOKEN;

const rootURL = 'https://api.github.com';

let userData;

/* GET home page. */
router.get('/', function (req, res, next) {
	const username = req.query.username;
	// if no username, render index page
	if (!username) return res.render('index', { userData: null });

	const options = {
		headers: {
			Authorization: `token ${token}`,
		},
	};

	// if there is a username, we will make a request!
	fetch(`${rootURL}/users/${username}`, options)
		.then((res) => res.json())
		.then((user) => {
			userData = user;
			return fetch(user.repos_url);
		})
		.then((res) => res.json())
		.then((repos) => {
			console.log(repos[0]);
			userData.repos = repos;
			res.render('index', { userData });
		});
});

module.exports = router;
