/**
 * Spry Toggle JS
 *
 * Version: 1.0.0
 * Author: gedde.dev
 * Github: https://github.com/ggedde/spry-css
 */

var toggleElements = [];

function spryToggle(toggleObject) {

    var elem = null;
    var hasElement = null;

    if (typeof toggleObject === 'string') {
        elem = document.querySelector(toggleObject);
    } else if (toggleObject && toggleObject.element && toggleObject.togglers) {
        elem = toggleObject.element;
    } else if (toggleObject && toggleObject.target) {
        toggleElements.forEach(toggleElement => {
            if (toggleElement.togglers) {
                toggleElement.togglers.forEach(toggler => {
                    if (toggler === toggleObject.target) {
                        elem = toggleElement.element;
                    }
                });
            }
        });
    } else if (toggleObject && toggleObject.tagName) {
        elem = toggleObject;
    }

    toggleElements.forEach(toggleElement => {
        if (toggleElement.element === elem) {
            hasElement = true;
            if (toggleElement.togglers.length === 1 && toggleElement.togglers[0] === toggleElement.element) {
                toggleElement.element.setAttribute('aria-pressed', toggleElement.element.getAttribute('aria-pressed') !== 'true');
            } else {
                toggleElement.element.classList.toggle('open');
                toggleElement.togglers.forEach(toggler => {
                    toggler.setAttribute('aria-pressed', toggleElement.element.classList.contains('open'));
                });
            }
        }
    });

    if (!hasElement && elem) {
        elem.classList.toggle('open');
    }
}

function spryJsLoadToggles() {
    document.querySelectorAll('[data-toggle]').forEach(toggle => {

        var selector = toggle.getAttribute('data-toggle');

        if (!selector || selector === 'next') {
            targets = [toggle.nextElementSibling];
        } else if (selector === 'null') {
            targets = [toggle];
        } else if (selector === 'close') {
            targets = ['open'];
        } else if (selector === 'hover') {
            return;
        } else {
            targets = document.querySelectorAll(selector);
        }
        
        if (!targets.length) return;
        targets.forEach(target => {

            var hasElement = false;
            var hasToggler = false;
            toggleElements.forEach(toggleElement => {
                if (toggleElement.element === target) {
                    hasElement = true;
                    hasToggler = false;
                    toggleElement.togglers.forEach(toggler => {
                        if (toggler === toggle) {
                            hasToggler = true;
                        }
                    });
                    if (!hasToggler) {
                        toggleElement.togglers.push(toggle);
                    }
                }
            });

            if (!hasElement && target !== 'open') {
                toggleElements.push({
                    element: target,
                    togglers: [toggle]
                });
            }
        });
    });

    document.querySelectorAll('[data-toggle=close]').forEach(toggle => {
        toggle.addEventListener('click', event => {
            var hasElement = false;    
            var t = toggle.closest('.open');
    
            if (t) {
                toggleElements.forEach(toggleElement => {
                    if (toggleElement.element === t) {
                        hasElement = true;
                        spryToggle(toggleElement);
                    }
                });

                if (!hasElement) {
                    spryToggle(t);
                }
            }
        });
    });
    
    toggleElements.forEach(toggleElement => {
        toggleElement.togglers.forEach(toggler => {
            toggler.removeEventListener('click', spryToggle);
            toggler.addEventListener('click', spryToggle);
        })
    });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    spryJsLoadToggles();
} else {
    document.addEventListener('DOMContentLoaded', spryJsLoadToggles);
}