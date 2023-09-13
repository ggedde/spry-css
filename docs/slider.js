/**
 * Spry Slider JS
 *
 * Version: 2.1.5
 * Author: gedde.dev
 * Github: https://github.com/ggedde/spry-css
 */
function spryJsLoadSliders() {
    document.querySelectorAll('.slider').forEach(slider => {
        if(slider.hasAttribute('data-loaded')) return;
        var play = parseInt(slider.getAttribute('data-play'));
        var loop = slider.hasAttribute('data-loop');
        var stop = slider.getAttribute('data-stop');
        var slides = slider.querySelector('.slider-slides');
        var slideCount = slides.childElementCount;
        var next = slider.querySelector('.slider-next');
        var prev = slider.querySelector('.slider-prev');
        var pagination = slider.querySelector('.slider-pagination');
        var slidesWidth = slides.scrollWidth;
        var block = slides.innerHTML;
        var scrollTimer = null;
        var playTimer = null;
        var isSelecting = false;
        var goTo = (to, instant) => {
            var offsetSlides = loop ? slideCount : 0;
            if (to === 'next') {
                slides.scrollBy(slider.offsetWidth, 0);
            } else if (to === 'prev') {
                slides.scrollBy(-(slides.offsetWidth), 0);
            } else {
                slides.scrollTo({left: slides.children[(to+offsetSlides)].offsetLeft, behavior: instant ? 'instant' : 'smooth'});
            }
        };
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
                        goTo('next');
                    }
                }, play);
            }
        }
        if(next) {
            next.addEventListener('click', () => {
                goTo('next');
            });
        }
        if(prev) {
            prev.addEventListener('click', () => {
                goTo('prev');
            });
        }
        if ( pagination && slides && slideCount ) {
            for (let index = 0; index < slideCount; index++) {
                let div = document.createElement("div");
                if (index === 0) div.classList.add('active');
                div.onclick = () => {
                    goTo(index);
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
                    var left = Math.round(element.getBoundingClientRect().left - slider.getBoundingClientRect().left);
                    element.toggleAttribute('data-showing', (left >= 0 && left < slider.clientWidth));
                });
                var showing = slider.querySelectorAll('[data-showing]');
                if (showing.length) {
                    if (pagination) {
                        pagination.querySelectorAll('.active').forEach(active => {
                            active.classList.remove('active');
                        });
                        var childIndex = Array.from(slides.children).indexOf(showing[0]);
                        if (loop) {
                            childIndex = (childIndex === slideCount*2) ? 0 : (childIndex - slideCount); 
                        }
                        if (childIndex !== undefined) {
                            pagination.children[childIndex].classList.add('active');
                        }
                    }
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
        slider.setAttribute('data-loaded', '');
    });
}
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    spryJsLoadSliders();
} else {
    document.addEventListener('DOMContentLoaded', spryJsLoadSliders);
}