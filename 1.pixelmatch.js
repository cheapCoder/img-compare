const fs = require("fs/promises");
const { readFileSync } = require("fs");
const PNG = require("pngjs").PNG;
const pixelmatch = require("pixelmatch");

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
	let [newDir, oldDir] = await Promise.all([fs.readdir("./new"), fs.readdir("./old")]);

	// format name
	newDir.forEach((name, i) => {
		newDir[i] = transName(name);
		fs.rename(`./new/${name}`, `./new/${newDir[i]}`);
	});
	oldDir.forEach((name, i) => {
		oldDir[i] = transName(name);
		fs.rename(`./old/${name}`, `./old/${oldDir[i]}`);
	});

	// --------------------------------------------------

	const res = {
		sameName: [],
		multiple: {},
		single: {},
		delete: [],
		missSize: [],
	};

	const newSet = new Set(newDir);
	oldDir = oldDir.filter(name => {
		const include = newSet.has(name);
		if (include) {
			res.sameName.push(name);
		}
		return !include;
	});

	const newPics = Object.fromEntries(
		newDir.map(name => [name, PNG.sync.read(readFileSync(`./new/${name}`))])
	);

	oldDir.forEach(oldName => {
		const old = PNG.sync.read(readFileSync(`./old/${oldName}`));

		const matchs = [];
		newDir.forEach((newName, i) => {
			const pic = newPics[newName];
			if (old.width != pic.width || old.data.length != pic.data.length) {
				res.missSize.push([oldName, newName]);
			} else if (pixelmatch(pic.data, old.data, null, pic.width, pic.height, { threshold: 0.1 }) <= 1) {
				matchs.push(newDir[i]);
			}
		});

		if (matchs.length === 0) {
			res.delete.push(oldName);
		} else if (matchs.length > 1) {
			res.multiple[oldName] = matchs;
		} else {
			res.single[oldName] = matchs[0];
		}
	});

	console.log(res);

	fs.writeFile("res.json", JSON.stringify(res, null, 2), { encoding: "utf-8" });
})();
