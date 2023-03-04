const fs = require("fs/promises");

const from = "old_png";
const to = "new_png";

function transName(filename) {
	let [name, ext] = filename.split(".");

	if (!/(-filled|Filled|Outlined)$/.test) {
		// if (!name.endsWith("-filled") && !name.endsWith("Outlined")) {
		name += "-outlined";
	}

	name = name.replaceAll(/[\s-](\w)/g, (m, n) => n.toUpperCase());

	return `${name.replace(/^(\w)/g, n => n.toUpperCase())}.${ext}`;
}

// console.log(transName("Corporate-filled.png"));
// console.log(transName("Credit card cancel.png"));

(async function () {
	let [oldDir, newDir] = await Promise.all([fs.readdir(`./${from}`), fs.readdir(`./${to}`)]);

	// format name
	newDir.forEach((name, i) => {
		newDir[i] = transName(name);
		fs.rename(`./${to}/${name}`, `./${to}/NEW-${newDir[i]}`);
	});
	oldDir.forEach((name, i) => {
		oldDir[i] = transName(name);
		fs.rename(`./${from}/${name}`, `./${from}/OLD-${oldDir[i]}`);
	});
})();
