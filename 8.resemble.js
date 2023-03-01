const compareImages = require("resemblejs/compareImages");
const fs = require("fs/promises");

const THRESHOLD = 5;

async function getDiff(path1, path2) {
	const options = {
		// output: {
		// 	errorColor: {
		// 		red: 255,
		// 		green: 0,
		// 		blue: 255,
		// 	},
		// 	errorType: "movement",
		// 	transparency: 0.3,
		// 	largeImageThreshold: 1200,
		// 	useCrossOrigin: false,
		// 	outputDiff: true,
		// },
		scaleToSameSize: true,
		ignore: "antialiasing",
	};

	const data = await compareImages(await fs.readFile(path1), await fs.readFile(path2), options);

	console.log(data);
	return data.rawMisMatchPercentage;

	// await fs.writeFile("./output.png", data.getBuffer());
}

getDiff("./old_svg/WaitingOutlined.svg", "./new_svg/CirclePlusOutlineOutlined.svg").then(res => {
	console.log(res); 
});

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

async function run() {
	let [newDir, oldDir] = await Promise.all([fs.readdir("./new_svg"), fs.readdir("./old_svg")]);

	// format name
	newDir.forEach((name, i) => {
		newDir[i] = transName(name);
		fs.rename(`./new_svg/${name}`, `./new_svg/${newDir[i]}`);
	});
	oldDir.forEach((name, i) => {
		oldDir[i] = transName(name);
		fs.rename(`./old_svg/${name}`, `./old_svg/${oldDir[i]}`);
	});

	// --------------------------------------------------

	const res = {
		sameName: [],
		multiple: {},
		single: {},
		delete: [],
		missSize: [],
	};
	const record = {};

	const newSet = new Set(newDir);
	oldDir = oldDir.filter(name => {
		const include = newSet.has(name);
		if (include) {
			res.sameName.push(name);
		}
		return !include;
	});

	try {
		for (let i = 0; i < oldDir.length; i++) {
			const oldname = oldDir[i];

			const matches = [];
			for (let j = 0; j < newDir.length; j++) {
				const newname = newDir[j];
				const distance = await getDiff(`./old_svg/${oldname}`, `./new_svg/${newname}`);

				if (!record[oldname]) {
					record[oldname] = {};
				}
				record[oldname][newname] = distance;

				if (distance < THRESHOLD) {
					matches.push(newDir[j]);
				}
			}

			if (matches.length === 0) {
				res.delete.push(oldname);
			} else if (matches.length > 1) {
				res.multiple[oldname] = matches;
			} else {
				res.single[oldname] = matches[0];
			}
		}
	} catch (error) {
		console.log(error);
	} finally {
		// console.log(res);

		fs.writeFile("res.json", JSON.stringify(res, null, 2), { encoding: "utf-8" });
		fs.writeFile("distance.json", JSON.stringify(record, null, 2), { encoding: "utf-8" });
	}
}

// run();
