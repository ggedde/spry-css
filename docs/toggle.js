/**
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
    static toggle = function(toggleObject) {
        var elem = null;
        var hasElement = null;
        var action = 'toggle';
        var pressed = null;

        /**
         * Find which element and togglers are needed to take action.
         */
        if (typeof toggleObject === 'string') {
            elem = document.querySelector(toggleObject);
        } else if (toggleObject && toggleObject.el && toggleObject.togglers) {
            elem = toggleObject.el;
        } else if (toggleObject && toggleObject.target) {
            this.elements.forEach(toggleElement => {
                if (toggleElement.togglers) {
                    toggleElement.togglers.forEach(toggler => {
                        if (toggler.el === toggleObject.target) {
                            elem = toggleElement.el;
                            action = toggler.action ? toggler.action : 'toggle';
                        }
                    });
                }
            });
        } else if (toggleObject && toggleObject.tagName) {
            elem = toggleObject;
        }

        console.log([elem, action]);

        /**
         * Open the matching Element then go through each Togglers and update them if needed.
         */
        this.elements.forEach(toggleElement => {
            if (toggleElement.el === elem) {
                hasElement = true;

                var isSelf = toggleElement.togglers.length === 1 && toggleElement.togglers[0].el === toggleElement.el;
                
                pressed = action === 'toggle' ? (isSelf ? toggleElement.el.getAttribute('aria-pressed') !== 'true' : !toggleElement.el.classList.contains('open')) : (action === 'open' ? true : false);

                console.log(pressed);

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
        if (!event || docTarget || escPressed) {
            this.elements.forEach(toggleElement => {
                if ([null, 0, false, 'false'].includes(toggleElement.el.getAttribute('data-toggle-persistent')) && toggleElement.el.classList.contains('open') && (!docTarget || (docTarget && toggleElement.el !== docTarget && !toggleElement.el.contains(docTarget)))) {
                    var hasToggler = false;
                    toggleElement.togglers.forEach(toggler => {
                        if (toggler.el === docTarget || toggler.el.contains(docTarget)) {
                            hasToggler = true;
                        }
                    });
                    if (!hasToggler) {
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
            });
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
} else {
    document.addEventListener('DOMContentLoaded', Spry.loadToggles);
}
