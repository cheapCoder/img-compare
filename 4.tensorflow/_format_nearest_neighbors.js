const { readdir, writeFile } = require("fs/promises");
const { join, parse } = require("path");

async function run() {
	const files = await readdir(join(__dirname, "./nearest_neighbors"), { encoding: "utf-8" });

	const res = [];
	const same = [];
	files.forEach(file => {
		if (!file.startsWith("OLD-")) return;
		const jsonPath = join(__dirname, "./nearest_neighbors", file);
		const name = parse(jsonPath).name;

		const oldPath = join("./images_svg", `${name}.svg`);
		const oldName = name.replace("OLD-", "");
		const similarList = require(jsonPath)
			.filter(({ filename }) => filename.startsWith("NEW-"))
			.slice(0, 5);

		if (["Rectangle38Outlined", "Type1Outlined", "TypeOutlined"].includes(oldName)) return;

		if (oldName === similarList[0].filename.replace("NEW-", "")) {
			same.push({
				name: oldName,
				similarity: similarList[0].similarity,
				oldPath: join("./images_svg", `OLD-${oldName}.svg`),
				newPath:join("./images_svg", `NEW-${oldName}.svg`),
			});
			return;
		}

		const list = similarList.map(item => {
			const newPath = join("./images_svg", item.filename + ".svg");
			const newName = item.filename.replace("NEW-", "");

			return { newPath, newName, similarity: item.similarity };
		});

		res.push({ oldPath, oldName, list });
	});

	await writeFile(join(__dirname, "./same.json"), JSON.stringify(same), { encoding: "utf-8" });

	await writeFile(join(__dirname, "./res.json"), JSON.stringify(res), { encoding: "utf-8" });
}

run();
