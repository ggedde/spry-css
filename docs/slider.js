/**
 * Spry Slider JS
 *
 * Version: 2.1.0
 * Author: gedde.dev
 * Github: https://github.com/ggedde/spry-css
 */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.slider').forEach(slider => {
        var play = parseInt(slider.getAttribute('data-play'));
        var loop = slider.hasAttribute('data-loop');
        var stop = slider.getAttribute('data-stop');
        var slides = slider.querySelector('.slider-slides');
        var pagination = slider.querySelector('.slider-pagination');
        var slidesWidth = slides.scrollWidth;
        var block = slides.innerHTML;
        var scrollTimer = null;
        var playTimer = null;
        var isSelecting = false;
        var resetPlay = () => {
            if (playTimer) {
                clearInterval(playTimer);
                playTimer = null;
            }
            if (play) {
                playTimer = setInterval(() => {
                    var hasAction = stop === 'action' && (slider.querySelector('a:hover') || slider.querySelector('button:hover'));
                    var hasHover = stop === 'hover' && slider.matches(':hover');
                    if (!hasAction && !hasHover) {
                        slider.querySelector('.slider-next').click();
                    }
                }, play);
            }
        }
        slider.querySelector('.slider-prev').addEventListener('click', () => {
            slides.scrollBy(-(slides.offsetWidth), 0);
        });
        slider.querySelector('.slider-next').addEventListener('click', () => {
            slides.scrollBy(slider.offsetWidth, 0);
        });
        if ( pagination && slides && slides.childElementCount ) {
            var offsetSlides = loop ? slides.childElementCount : 0;
            for (let index = 0; index < slides.childElementCount; index++) {
                let div = document.createElement("div");
                div.onclick = () => {
                    slides.scrollTo(slides.querySelector(':nth-child('+(index+1+offsetSlides)+')').offsetLeft, 0);
                    pagination.childNodes.forEach(pagination => {
                        pagination.classList.remove('active');
                    });
                    div.classList.add('active');
                }
                pagination.append(div);
            }
        }
        slides.addEventListener('scroll', () => {
            slider.setAttribute('data-sliding', '');
            slider.removeAttribute('data-position');
            if (scrollTimer) clearTimeout(scrollTimer);
            if (playTimer) {
                clearInterval(playTimer);
                playTimer = null;
            }
            scrollTimer = setTimeout(function(){
                slider.removeAttribute('data-sliding');
                resetPlay();
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
        resetPlay();
        if (play) {
            if (stop === 'hover') {
                slider.addEventListener('mouseout', () => {
                    resetPlay();
                });
                slider.addEventListener('mouseover', () => {
                    if (playTimer) {
                        clearInterval(playTimer);
                        playTimer = null;
                    }
                });
            }
            if (stop === 'action') {
                document.addEventListener('selectionchange', () => {
                    if (isSelecting && document.getSelection().toString()) {
                        if (playTimer) {
                            clearInterval(playTimer);
                            playTimer = null;
                        }
                    }
                    if (!isSelecting && !document.getSelection().toString() && !playTimer) {
                        resetPlay();
                    }
                });
                slider.addEventListener('selectstart', () => {
                    isSelecting = true;
                });
                slider.addEventListener('mouseup', () => {
                    isSelecting = false;
                });
            }
        }
    });
});