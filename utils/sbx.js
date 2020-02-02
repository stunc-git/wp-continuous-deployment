#!/usr/bin/env node

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
	console.log("err", err);
});

const arrify = require("arrify");
const axios = require("axios");
const getUrls = require("get-urls");
const fs = require("fs");
const path = require("path");
const download = require("download");
const dest = path.resolve(__dirname, "./../.wordpress-org/");

(async (slug = "jetpack") => {
	const url = `https://plugins.svn.wordpress.org/${slug}/assets/`;
	const res = await axios.get(url);
	const urlData = res.data.replace(
		/href="/g,
		`href="https://plugins.svn.wordpress.org/jetpack/assets/`
	);

	const getLinks = arrify(getUrls(urlData));
	// Remove the first and last.
	const buildLinks = getLinks.slice(1, getLinks.length - 1);
	// Remove the languages link.
	const links = buildLinks.filter(
		link =>
			link !== `https://plugins.svn.wordpress.org/${slug}/assets/languages`
	);

	const [errDown, down] = await to(
		Promise.all(links.map(link => download(link, dest)))
	);
})();
