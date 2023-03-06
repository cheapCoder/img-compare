const fs = require("fs/promises");
const { join } = require("path");

const from = "old_png";
const to = "new_png";

function transName(filename) {
	let [name, ext] = filename.split(".");

	if (!/(-filled|Filled|Outlined?)$/.test(name)) {
		// if (!name.endsWith("-filled") && !name.endsWith("Outlined")) {
		name += "-outlined";
	}
	if (/outline$/.test(name)) {
		name += "d";
	}

	name = name.replaceAll(/[\s-](\w)/g, (m, n) => n.toUpperCase());

	return `${name.replace(/^(\w)/g, n => n.toUpperCase())}.${ext}`;
}

(async function () {
	let [oldDir, newDir] = await Promise.all([
		fs.readdir(join(__dirname, `./${from}`)),
		fs.readdir(join(__dirname, `./${to}`)),
	]);

	// format name
	newDir.forEach((name, i) => {
		newDir[i] = transName(name);
		fs.rename(join(__dirname, `./${to}/${name}`), join(__dirname, `./${to}/NEW-${newDir[i]}`));
	});
	oldDir.forEach((name, i) => {
		oldDir[i] = transName(name);
		fs.rename(join(__dirname, `./${from}/${name}`), join(__dirname, `./${from}/OLD-${oldDir[i]}`));
	});
})();
