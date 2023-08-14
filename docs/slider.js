/**
 * Spry Slider JS
 *
 * Version: 2.0
 * Author: gedde.dev
 * Github: https://github.com/ggedde/spry-css
 */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.slider').forEach(slider => {
        var autoplay = parseInt(slider.getAttribute('data-autoplay'));
        var loop = slider.hasAttribute('data-loop');
        var slides = slider.querySelector('.slider-slides');
        var slidesWidth = slides.scrollWidth;
        var block = slides.innerHTML;
        var scrollTimeout = null;
        slider.querySelector('.slider-prev').addEventListener('click', () => {
            slides.scrollBy(-(slides.offsetWidth), 0);
        });
        slider.querySelector('.slider-next').addEventListener('click', () => {
            slides.scrollBy(slider.offsetWidth, 0);
        });
        slides.addEventListener('scroll', () => {
            slider.setAttribute('data-sliding', '');
            slider.removeAttribute('data-position');
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function(){
                slider.removeAttribute('data-sliding');
                if (loop) {
                    var blockWidth = (slides.scrollWidth/3);
                    if (slides.scrollLeft < blockWidth) {
                        var offset = blockWidth - slides.scrollLeft;
                        slides.scrollTo({left: (((blockWidth*2) - offset)), behavior: 'instant'});
                    }
                    if (slides.scrollLeft >= (blockWidth*2)) {
                        var offset = slides.scrollLeft - (blockWidth*2);
                        slides.scrollTo({left: blockWidth + offset, behavior: 'instant'});
                    }

                } else {
                    if(!slides.scrollLeft) {
                        slider.setAttribute('data-position', 'start');
                    } else if (slides.scrollLeft + slider.offsetWidth >= (slides.scrollWidth - 2)) {
                        slider.setAttribute('data-position', 'end');
                    }
                }
                slider.querySelectorAll('.slider-slides > *').forEach(element => {
                    element.removeAttribute('data-first');
                    element.removeAttribute('data-last');
                    const rect = element.getBoundingClientRect();
                    element.toggleAttribute('data-showing', (rect.left >= 0 && rect.right <= (window.innerWidth || document.documentElement.clientWidth)));
                });
                var showing = slider.querySelectorAll('[data-showing]');
                if (showing.length) {
                    showing[0].setAttribute('data-first', '');
                    showing[showing.length-1].setAttribute('data-last', '');
                    var preLoadImages = function(elem, type, total) {
                        var i = 0;
                        var imageSrcs = [];
                        while (elem = (type === 'next' ? elem.nextSibling : elem.previousSibling)) {
                            if (i >= total || !elem.nodeType || elem.nodeType === 3) continue; // text node
                            if (elem.tagName === 'IMG' && elem.getAttribute('loading').toLowerCase() === 'lazy' ) {
                                imageSrcs.push(elem.src);
                            } else {
                                elem.querySelectorAll('img[loading="lazy"]').forEach(img => {
                                    imageSrcs.push(img.src);
                                });
                            } 
                            i++;
                        }
                        imageSrcs.forEach(imageSrc => {
                            var newImg = new Image();
                            newImg.src = imageSrc;
                        });
                    }
                    preLoadImages(slider.querySelector('[data-last]'), 'next', showing.length);
                    preLoadImages(slider.querySelector('[data-last]'), 'prev', showing.length);
                }
            },100);
        });
        if (loop) {
            slides.innerHTML += block + block;
            slides.scrollTo({left: slidesWidth, behavior: 'instant'});
        } else {
            slides.dispatchEvent(new CustomEvent('scroll'));
            slider.setAttribute('data-position', 'start');
        }
        if (autoplay) {
            setInterval(() => {
                if (!slider.matches(':hover')) {
                    slider.querySelector('.slider-next').click();
                }
            }, autoplay);
        }
    });
});