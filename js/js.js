const gallerySlideMain = document.querySelector('.gallery__slide-main'),
    gallerySlideMainImgs = document.querySelectorAll('.gallery__slide-main img'),
    gallerySlideMainPrewImgs = document.querySelectorAll('.gallery__slide-prew img'),
    gallerySlider = document.querySelector('.gallery-slider'),
    buttonPrew = document.querySelector('.button-prew'),
    buttonNext = document.querySelector('.button-next');
let count = 0,
    width;

function init() {

    width = gallerySlideMain.offsetWidth;
    gallerySlideMain.style.width = width * gallerySlideMainImgs.length + 'px;'
    gallerySlideMainImgs.forEach(item => {
        item.style.width = width + "px";
        item.style.height = "auto";

    });

    offsetElements();

};
init();


window.addEventListener('resize', init);

buttonNext.addEventListener('click', () => {
    count++;
    if (count >= gallerySlideMainImgs.length) {
        count = 0;
    }
    offsetElements();
});

buttonPrew.addEventListener('click', () => {
    count--;
    if (count < 0) {
        count = gallerySlideMainImgs.length - 1;
    }
    offsetElements();
});

function offsetElements() {
    gallerySlideMain.style.transform = 'translate(-' + count * width + 'px)';
};

gallerySlideMainPrewImgs.forEach((item, indexImg) => {
    item.addEventListener('click', () => {
        console.log(indexImg);
        indexImg = 0;


    })
})




// function init() {
//     console.log('resize');
//     width = gallerySlideMain.offsetWidth;
//     gallery__slide-main.style.width = width * images.length + 'px';
//     images.forEach(item => {
//         item.style.width = width + 'px';
//         item.style.height = 'auto';
//     });
//     rollSlider();
// }

// init();
// window.addEventListener('resize', init);

// document.querySelector('.slider-next').addEventListener('click', function() {
//     count++;
//     if (count >= images.length) {
//         count = 0;
//     }
//     rollSlider();
// });

// document.querySelector('.slider-prev').addEventListener('click', function() {
//     count--;
//     if (count < 0) {
//         count = images.length - 1;
//     }
//     rollSlider();
// });

// function rollSlider() {
//     sliderLine.style.transform = 'translate(-' + count * width + 'px)';

// }