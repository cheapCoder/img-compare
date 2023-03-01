const fs = require("fs/promises");
const { createReadStream } = require("fs");

const deepai = require("deepai"); // OR include deepai.min.js as a script tag in your HTML

deepai.setApiKey("quickstart-QUdJIGlzIGNvbWluZy4uLi4K");

function transName(filename) {
	let [name, ext] = filename.split(".");

	if (!/(-filled|Filled|Outlined)$/.test(name)) {
		// if (!name.endsWith("-filled") && !name.endsWith("Outlined")) {
		name += "-outlined";
	}

	name = name.replaceAll(/[\s-](\w)/g, (m, n) => n.toUpperCase());

	return `${name.replace(/^(\w)/g, n => n.toUpperCase())}.${ext}`;
}
// console.log(transName("Corporate-filled.png"));
// console.log(transName("Credit card cancel.png"));

const getDistance = async (path1, path2) => {
	return deepai.callStandardApi("image-similarity", {
		image1: createReadStream(path1),
		image2: createReadStream(path2),
	});
};

getDistance('./new/AddProductFilled.png', './old/AddProductFilled.png').then(res => {
	console.log(Object.keys(res));
})

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
// 		sameName: [],
// 		multiple: {},
// 		single: {},
// 		delete: [],
// 		missSize: [],
// 	};
// 	const record = {};

// 	const newSet = new Set(newDir);
// 	oldDir = oldDir.filter(name => {
// 		const include = newSet.has(name);
// 		if (include) {
// 			res.sameName.push(name);
// 		}
// 		return !include;
// 	});

// 	try {
// 		for (let i = 0; i < oldDir.length; i++) {
// 			const oldname = oldDir[i];

// 			const matches = [];
// 			for (let j = 0; j < newDir.length; j++) {
// 				const newname = newDir[j];
// 				const distance = await getDistance(`./old/${oldname}`, `./new/${newname}`);

// 				if (!record[oldname]) {
// 					record[oldname] = {};
// 				}
// 				record[oldname][newname] = distance;

// 				if (distance < 5) {
// 					matches.push(newDir[j]);
// 				}
// 			}

// 			if (matches.length === 0) {
// 				res.delete.push(oldname);
// 			} else if (matches.length > 1) {
// 				res.multiple[oldname] = matches;
// 			} else {
// 				res.single[oldname] = matches[0];
// 			}
// 		}
// 	} catch (error) {
// 		console.log(error.response);
// 	} finally {
// 		// console.log(res);

// 		fs.writeFile("res.json", JSON.stringify(res, null, 2), { encoding: "utf-8" });
// 		fs.writeFile("distance.json", JSON.stringify(record, null, 2), { encoding: "utf-8" });
// 	}
// })();
