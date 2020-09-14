const path = require("path");
//const ROOT_DIR = process.cwd();
const ROOT_DIR = "http://localhost:8080";
const SITE_URL = "http://localhost:8080";

//const ROOT_DIR = process.cwd();
const SRC = "src/";
const ASSETS = "assets/";
const DIST = "dist/";
const CONFIG = "config/";

module.exports = {
	root: ROOT_DIR,
	src: path.resolve(ROOT_DIR, SRC),
	srcAssets: path.resolve(ROOT_DIR, SRC, ASSETS),
	dist: path.resolve(ROOT_DIR, DIST),
	config: path.resolve(ROOT_DIR, CONFIG),
};
