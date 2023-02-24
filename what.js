const fs = require("fs/promises");
const { readFileSync } = require("fs");
const PNG = require("pngjs").PNG;
const pixelmatch = require("pixelmatch");

function transName(filename) {
	let [name, ext] = filename.split(".");

	if (!name.endsWith("-filled") && !name.endsWith("Outlined")) {
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

	// 过滤重名的key
	const newSet = new Set(newDir);
	oldDir = oldDir.filter(name => !newSet.has(name));

	const newPics = Object.fromEntries(
		newDir.map(name => [name, PNG.sync.read(readFileSync(`./new/${name}`))])
	);

	const res = {
		multiple: {},
		single: {},
		empty: [],
	};
	oldDir.forEach(oldName => {
		const old = PNG.sync.read(readFileSync(`./old/${oldName}`));

		const matchs = [];
		newDir.forEach((newName, i) => {
			const pic = newPics[newName];
			if (
				old.width == pic.width &&
				old.data.length == pic.data.length &&
				pixelmatch(pic.data, old.data, null, pic.width, pic.height, { threshold: 0.1 }) <= 1
			) {
				matchs.push(newDir[i]);
			}
		});

		if (matchs.length === 0) {
			res.empty.push(oldName);
		} else if (matchs.length > 1) {
			res.multiple[oldName] = matchs;
		} else {
			res.single[oldName] = matchs[0];
		}
	});

	console.log(res);

	fs.writeFile("res.json", JSON.stringify(res), { encoding: "utf-8" });
})();
