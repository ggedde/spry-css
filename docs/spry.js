/**!
 * Spry Toggle JS
 *
 * Version: 1.0.0
 * Author: gedde.dev
 * Github: https://github.com/ggedde/spry-css
 */

class Spry {

    /**
     * Store a list lf all Toggable Elements along with their togglers
     */
    static elements = [];

    /**
     * Toggles an element Open or Closed.
     * This will also update all Togglers that are linked to the toggle element.
     * 
     * @param string|object toggleObject - Can be an Dom Element or a Selector.
     * 
     * @returns void
     */
    static toggle = function(toggleObjectOrEvent) {
        var elem = null;
        var hasElement = null;
        var action = 'toggle';
        var pressed = null;
        var isSelf = null;
        var downPressed = null;

        if (toggleObjectOrEvent && toggleObjectOrEvent.type && (toggleObjectOrEvent.type === 'keyup' || toggleObjectOrEvent.type === 'keydown')) {
            if(toggleObjectOrEvent.type === 'keydown' && [40,13,32].includes(toggleObjectOrEvent.keyCode)) {
                toggleObjectOrEvent.preventDefault();
            }
            if((toggleObjectOrEvent.type === 'keyup' && toggleObjectOrEvent.keyCode === 40) || (toggleObjectOrEvent.type === 'keydown' && toggleObjectOrEvent.keyCode !== 40) || ![40,13,32].includes(toggleObjectOrEvent.keyCode)) {
                return;
            }
            if(toggleObjectOrEvent.keyCode === 40) {
                downPressed = true;
            }
        }

        /**
         * Find which element and togglers are needed to take action.
         */
        if (typeof toggleObjectOrEvent === 'string') {
            elem = document.querySelector(toggleObjectOrEvent);
        } else if (toggleObjectOrEvent && toggleObjectOrEvent.el && toggleObjectOrEvent.togglers) {
            elem = toggleObjectOrEvent.el;
        } else if (toggleObjectOrEvent && toggleObjectOrEvent.target) {
            this.elements.forEach(toggleElement => {
                if (toggleElement.togglers) {
                    toggleElement.togglers.forEach(toggler => {
                        isSelf = false;
                        if (toggler.el === toggleObjectOrEvent.target) {
                            elem = toggleElement.el;
                            action = toggler.action ? toggler.action : 'toggle';
                            if (toggler.el === toggleElement.el) {
                                isSelf = true;
                            }
                        }
                    });
                }
            });
        } else if (toggleObjectOrEvent && toggleObjectOrEvent.tagName) {
            elem = toggleObjectOrEvent;
        }

        if (downPressed && elem.classList.contains('open')) {
            var first = elem.querySelector('a, button, input, .button, label');
            if (first) {
                first.focus();
            }
            return;
        }

        /**
         * Open the matching Element then go through each Togglers and update them if needed.
         */
        this.elements.forEach(toggleElement => {
            if (toggleElement.el === elem) {
                
                hasElement = true;
                pressed = action === 'toggle' ? (isSelf ? toggleElement.el.getAttribute('aria-pressed') !== 'true' : !toggleElement.el.classList.contains('open')) : (action === 'open' ? true : false);

                if (isSelf) {
                    toggleElement.el.setAttribute('aria-pressed', pressed);
                } else {
                    toggleElement.el.classList.toggle('open', pressed);
                    toggleElement.togglers.forEach(toggler => {
                        toggler.el.setAttribute('aria-pressed', pressed);
                    });
                }
            }
        });

        if (!hasElement && elem) {
            elem.classList.toggle('open');
        }
    };

    /**
     * Closes a Toggle. Must be ran from inside a container that contains the "open" class.
     * 
     * @returns void
     */
    static closeToggle = function() {
        var hasElement = false;    
        var closestToggle = event.target.closest('.open');

        if (closestToggle) {
            this.elements.forEach(toggleElement => {
                if (toggleElement.el === closestToggle) {
                    hasElement = true;
                    this.toggle(toggleElement);
                }
            });

            if (!hasElement) {
                this.toggle(closestToggle);
            }
        }
    }

    /**
     * Checks and Loads the Toggles on the Page and Adds the Event listeners to the Togglers.
     * This can be loaded as many times as need as it does not add duplicate toggles or event listeners.
     * 
     * @returns void
     */
    static closeAllToggles = function() {
        var docTarget = event && event.type && event.type === 'click' ? event.target : null;
        var escPressed = event && event.type && event.type === 'keyup' && event.keyCode && event.keyCode === 27;
        var togglerClicked = null;
        var togglerHasPersistent = null;
        if (!event || docTarget || escPressed) {
            this.elements.forEach(toggleElement => {
                if ([null, 0, false, 'false'].includes(toggleElement.el.getAttribute('data-toggle-persistent')) && toggleElement.el.classList.contains('open') && (!docTarget || (docTarget && toggleElement.el !== docTarget && !toggleElement.el.contains(docTarget)))) {
                    togglerClicked = false;
                    togglerHasPersistent = false;
                    toggleElement.togglers.forEach(toggler => {
                        if (toggler.el === docTarget || toggler.el.contains(docTarget)) {
                            togglerClicked = true;
                        }
                        if (![null, 0, false, 'false'].includes(toggler.el.getAttribute('data-toggle-persistent'))) {
                            togglerHasPersistent = true;
                        }
                    });
                    if (!togglerClicked && !togglerHasPersistent) {
                        this.toggle(toggleElement);
                    }
                }
            });
        }
    }

    /**
     * Checks and Loads the Toggles on the Page and Adds the Event listeners to the Togglers.
     * This can be loaded as many times as need as it does not add duplicate toggles or event listeners.
     * 
     * @returns void
     */
    static loadToggles = function() {
        document.querySelectorAll('[data-toggle]').forEach(toggle => {
    
            var selector = toggle.getAttribute('data-toggle');
            var targets = [];

            var dataToggleAction = toggle.getAttribute('data-toggle-action');
            var action = dataToggleAction && ['open', 'close', 'toggle'].includes(dataToggleAction) ? dataToggleAction : 'toggle';
    
            if (!selector) {
                targets = [toggle];
            } else if (selector === 'next') {
                targets = [toggle.nextElementSibling];
            } else if (selector === 'close') {
                targets = ['close'];
            } else if (selector === 'hover') {
                return;
            } else {
                targets = document.querySelectorAll(selector);
            }
            
            if (!targets.length) return;
            targets.forEach(target => {
    
                var hasElement = false;
                var hasToggler = false;
                this.elements.forEach(toggleElement => {
                    if (toggleElement.el === target) {
                        hasElement = true;
                        hasToggler = false;
                        toggleElement.togglers.forEach(toggler => {
                            if (toggler.el === toggle) {
                                hasToggler = true;
                            }
                        });
                        if (!hasToggler) {
                            toggleElement.togglers.push({
                                el: toggle,
                                action: action
                            });
                        }
                    }
                });
    
                if (!hasElement && target !== 'close') {
                    this.elements.push({
                        el: target,
                        togglers: [{
                            el: toggle,
                            action: action
                        }]
                    });
                }
            });
        });

        /**
         * Listen for all Document Clicks and Close Toggles if needed.
         */
        document.addEventListener('click', this.closeAllTogglesBound);
        document.addEventListener('keyup', this.closeAllTogglesBound);
        
        /**
         * Listen to All Close Togglers and close the closest Open Element.
         */
        document.querySelectorAll('[data-toggle=close]').forEach(toggle => {
            toggle.removeEventListener('click', this.closeToggleBound);
            toggle.addEventListener('click', this.closeToggleBound);
        });
        
        /**
         * Listen to All Other Togglers and take action on the Elements.
         */
        this.elements.forEach(toggleElement => {
            toggleElement.togglers.forEach(toggler => {
                toggler.el.removeEventListener('click', this.toggleBound);
                toggler.el.addEventListener('click', this.toggleBound);

                toggler.el.removeEventListener('keyup', this.toggleBound);
                toggler.el.addEventListener('keyup', (this.toggleBound));

                toggler.el.removeEventListener('keydown', this.toggleBound);
                toggler.el.addEventListener('keydown', (this.toggleBound));
            });
        });
    }

    static loadSliders = function() {
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
    
            if (!next && !prev && !loop && !stop && !play) {
                return;
            }
    
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
            if (pagination && !pagination.childNodes.length && slides && slideCount ) {
                for (let index = 0; index < slideCount; index++) {
                    let btn = document.createElement("button");
                    if (index === 0) btn.classList.add('active');
                    btn.onclick = () => {
                        goTo(index);
                        pagination.childNodes.forEach(pagination => {
                            pagination.classList.remove('active');
                        });
                        btn.classList.add('active');
                    }
                    pagination.append(btn);
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

    static navigateList = function(event) {

        var list = event.target.closest('.list');
        if (!list) {
            return;
        }
        if([37,38,39,40,13,32,27].includes(event.keyCode)) {
            var selected = list.querySelector('li:focus-within');
            if (!selected) {
                selected = list.querySelector(':focus');
            }
            if (selected) {
                if(event.keyCode === 27) {
                    event.target.blur();
                } else if([13].includes(event.keyCode) && ['LABEL','INPUT'].includes(event.target.tagName)) {
                    event.preventDefault();
                    event.target.click();
                } else if ([37,38,39,40].includes(event.keyCode)) {
                    event.preventDefault();
                    var children = list.children[0].tagName === 'UL' ? list.children[0].children : list.children;
                    var index = [...children].indexOf(selected);
                    if (index > -1) {
                        var newIndex = ([39,40].includes(event.keyCode) ? index+1 : index-1);
                        var sibling = children[newIndex];
                        if (sibling && sibling.children && sibling.children[0]) {
                            sibling = sibling.children[0];
                            if (!['A','BUTTON','LABEL','INPUT'].includes(sibling.tagName)) {
                                if ([39,40].includes(event.keyCode)) {
                                    newIndex++;
                                } else {
                                    newIndex--;
                                }
                                var sibling = children[newIndex];
                                if (sibling && sibling.children && sibling.children[0]) {
                                    sibling = sibling.children[0];
                                }
                            }
                        }
                        if (sibling) {
                            sibling.focus();
                        }
                    }
                }
            }
        }
    }

    static loadLists = function() {
        document.querySelectorAll('.list').forEach(list => {
            list.removeEventListener('keydown', this.navigateList);
            list.addEventListener('keydown', this.navigateList);
        })
    }

    static navigateTabs = function(event) {
        console.log(event);
        var tablist = event.target.closest('.list');
        var children = tablist.children[0].tagName === 'UL' ? tablist.children[0].children : tablist.children;
        
        var tabs = [...children];
        var tabpanels = [...tablist.parentElement.querySelector('.list + *').children];
        var index = tabs.indexOf(event.target);
        if (index === -1) {
            tabs.forEach((tab, tabIndex) => {
                if (event.target === tab || tab.contains(event.target)) {
                    index = tabIndex;
                }
            })
        }
        tablist.querySelectorAll('.active').forEach(activeElement => {
            activeElement.classList.remove('active');
        });
        event.target.classList.add('active');
        tabpanels.forEach(tabpanel => {
            tabpanel.classList.remove('open');
        });
        tabpanels[index].classList.add('open');
    }
    
    static loadTabs = function() {
        document.querySelectorAll('.tabs .list :is(.button,button)').forEach(elem => {
            elem.removeEventListener('click', this.navigateTabs);
            elem.addEventListener('click', this.navigateTabs);
        });
    }

    /**
     * Bind Class Reference to methods to allow for removal of Events to ensure there are no duplicate events.
     */
    static closeToggleBound = this.closeToggle.bind(this);
    static closeAllTogglesBound = this.closeAllToggles.bind(this);
    static toggleBound = this.toggle.bind(this);
}

/**
 * Initiate the Components
 */
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    Spry.loadToggles();
    Spry.loadSliders();
    Spry.loadLists();
    Spry.loadTabs();
} else {
    document.addEventListener('DOMContentLoaded', Spry.loadToggles);
    document.addEventListener('DOMContentLoaded', Spry.loadSliders);
    document.addEventListener('DOMContentLoaded', Spry.loadLists);
    document.addEventListener('DOMContentLoaded', Spry.loadTabs);
}
