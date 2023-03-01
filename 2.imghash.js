// const fs = require("fs/promises");
// const { readFileSync } = require("fs");
// const imghash = require("imghash");
// const leven = require("./leven");

// // NOTE:not work
// function transName(filename) {
// 	let [name, ext] = filename.split(".");

// 	if (!/(-filled|Filled|Outlined)$/.test) {
// 		// if (!name.endsWith("-filled") && !name.endsWith("Outlined")) {
// 		name += "-outlined";
// 	}

// 	name = name.replaceAll(/[\s-](\w)/g, (m, n) => n.toUpperCase());

// 	return `${name.replace(/^(\w)/g, n => n.toUpperCase())}.${ext}`;
// }

// // console.log(transName("Corporate-filled.png"));
// // console.log(transName("Credit card cancel.png"));

// (async function () {
// 	let [newDir, oldDir] = await Promise.all([fs.readdir("./new"), fs.readdir("./old")]);

// 	// format name
// 	newDir.forEach((name, i) => {
// 		newDir[i] = transName(name);
// 		fs.rename(`./new/${name}`, `./new/${newDir[i]}`);
// 	});
// 	oldDir.forEach((name, i) => {
// 		oldDir[i] = transName(name);
// 		fs.rename(`./old/${name}`, `./old/${oldDir[i]}`);
// 	});

// 	// --------------------------------------------------
// 	const res = {
// 		multiple: {},
// 		single: {},
// 		delete: [],
// 		sameName: [],
// 	};

// 	const newSet = new Set(newDir);
// 	oldDir = oldDir.filter(name => {
// 		const include = newSet.has(name);
// 		if (include) {
// 			res.sameName.push(name);
// 		}
// 		return !include;
// 	});

// 	const newHashes = await Promise.all(newDir.map(name => imghash.hash(`./new/${name}`)));

// 	const newPics = Object.fromEntries(newDir.map((name, i) => [name, newHashes[i]]));

// 	for (let i = 0; i < oldDir.length; i++) {
// 		const oldName = oldDir[i];
// 		const oldHash = await imghash.hash(`./old/${oldName}`);

// 		const matches = [];

// 		newDir.forEach((newName, i) => {
// 			const newHash = newPics[newName];

// 			const distance = leven(newHash, oldHash);
// 			console.log(`Distance: ${distance}`);
// 			if (distance <= 3) {
// 				matches.push(newDir[i]);
// 			}
// 		});

// 		if (matches.length === 0) {
// 			res.delete.push(oldName);
// 		} else if (matches.length > 1) {
// 			res.multiple[oldName] = matches;
// 		} else {
// 			res.single[oldName] = matches[0];
// 		}
// 	}

// 	// console.log(res);

// 	fs.writeFile("res.json", JSON.stringify(res), { encoding: "utf-8" });
// })();
