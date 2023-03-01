const imgSSIM = require("img-ssim");

imgSSIM("./old/AddProductFilled.png", "./new/AddProductFilled.png", (err, similarity) => {
	console.log({ err, similarity });
	// => 0.7683075604309328
});
