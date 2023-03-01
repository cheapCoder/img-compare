
const imageDiffr = require('image-diffr');
const image1Path = './new/AddProductFilled.png';
const image2Path = './new/AddProductFilled.png';
// const image2Path = './old/AddProductFilled.png';
imageDiffr
    .exec(image1Path, image2Path, {
        threshold: 0.3,
        output: './.tmp/diffedresult.jpg'
    })
    .then(diff => {
        console.log(diff);
        // console.log(diff.image);
    })
    .catch(err => {
        // handle error
    });