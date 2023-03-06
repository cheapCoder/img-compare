const fs = require("fs/promises");

const from = "old_svg";
const to = "new_svg";

function transName(filename) {
	let [name, ext] = filename.split(".");

	if (!/(-filled|Filled|Outlined)$/.test(name)) {
		// if (!name.endsWith("-filled") && !name.endsWith("Outlined")) {
		name += "-outlined";
	}
	if (/outline$/.test(name)) {
		name += "d";
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
		fs.rename(`./${to}/${name}`, `./${to}/${newDir[i]}`);
	});
	oldDir.forEach((name, i) => {
		oldDir[i] = transName(name);
		fs.rename(`./${from}/${name}`, `./${from}/${oldDir[i]}`);
	});
})();
