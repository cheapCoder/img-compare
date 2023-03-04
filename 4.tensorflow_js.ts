import * as tf from "@tensorflow/tfjs";
import * as fs from "fs";

// Define a function to get feature vectors
async function getFeatureVector(image) {
	// Load the MobileNet model
	const mobilenet = await tf.loadLayersModel(
		"https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json"
	);

	// Resize the image to 224 x 224
	const resizedImage = tf.image.resizeBilinear(image, [224, 224]);

	// Subtract the mean RGB values from each pixel
	const meanImageNetRGB = tf.tensor1d([123.68, 116.779, 103.939]);
	const processedImage = resizedImage.sub(meanImageNetRGB);

	// Pass the preprocessed image through MobileNet
	const featureVector = mobilenet.predict(processedImage);

	// Dispose of intermediate tensors
	resizedImage.dispose();
	processedImage.dispose();

	return featureVector;
}

// Define a function to calculate similarity
async function calculateSimilarity(image1, image2) {
	// Get the feature vectors of the two images
	const featureVector1 = await getFeatureVector(image1);
	const featureVector2 = await getFeatureVector(image2);

	// Calculate the cosine similarity between the feature vectors
	const similarity = 1 - tf.losses.cosineDistance(featureVector1, featureVector2);

	// Dispose of intermediate tensors
	featureVector1.dispose();
	featureVector2.dispose();

	return similarity;
}

function loadImage(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const image = new Image();
			image.onload = () => resolve(image);
			image.onerror = reject;
			image.src = reader.result;
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

async function run() {
	// Load and preprocess the images
	const image1Url = "./new_svg/CircleRightFilled.svg";
	const image2Url = "./new_svg/CircleRightFilled.svg";
	const image1 = await loadImage(image1Url);
	const image2 = await loadImage(image2Url);
	const tensorImage1 = tf.browser.fromPixels(image1);
	const tensorImage2 = tf.browser.fromPixels(image2);

	// Call the calculateSimilarity function
	const similarity = await calculateSimilarity(tensorImage1, tensorImage2);
	console.log(`The similarity is: ${similarity}`);

	// Dispose of intermediate tensors
	tensorImage1.dispose();
	tensorImage2.dispose();
}

run();
