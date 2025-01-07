/**!
 * Spry Docs JS
 *
 * Version: 1.0.0
 * Author: gedde.dev
 * Github: https://github.com/ggedde/spry-css
 */

let _currentPanel = null;

let _panelContents = [];

function toggleTheme(element) {
    element.classList.toggle('scheme-toggle');
    if (element === document.documentElement) {
        document.documentElement.querySelectorAll('.scheme-toggle').forEach(elem => {
            elem.classList.remove('scheme-toggle');
        });
    }
}

function cleanContent(html) {
    html = html.replaceAll(' class="bg-faint r-1 p-2"', '');
    html = html.replaceAll('bg-faint r-1 p-2 ', '');
    html = html.replaceAll(' bg-faint r-1 p-2', '');
    html = html.replaceAll('<div class="code-resize-handle"></div>', '');
    var firsTag = html.indexOf('&lt');
    if (firsTag === -1) {
        firsTag = html.indexOf('<');
    }
    
    var firstSpaces = html.slice(0, firsTag);
    html = html.replaceAll(firstSpaces, "\n").trim();
    var infoTxt = [
        'col',
        'fixed',
        'auto',
        'md-w-300',
        'col A',
        'col B',
        'col C',
        '.span-6',
        '.span-3',
        '.md-span-3',
        '.md-span-4',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitrsed diam nonumy.',
        'Lorem ipsum dolor sit amet, consetetur sadipscing ut labore et dolore magna aliquyam erat.',
        '.span-6 .md-span-3 .lg-span-3',
        'auto fill with larger content'
    ];

    infoTxt.forEach((item) => {
        html = html.replaceAll("\n        " + item + "\n    ", '');
        html = html.replaceAll("\n            " + item + "\n        ", '');
        html = html.replaceAll("\n                " + item + "\n            ", '');
    });

    html = html.replaceAll('data-loop=""', 'data-loop');
    html = html.replaceAll('data-snap=""', 'data-snap');
    html = html.replaceAll('data-over=""', 'data-over');
    html = html.replaceAll('data-wait=""', 'data-wait');
    html = html.replaceAll('data-toggle=""', 'data-toggle');
    html = html.replaceAll('data-toggle-close=""', 'data-toggle-close');
    html = html.replaceAll('data-scheme-dark=""', 'data-scheme-dark');
    html = html.replaceAll('data-toggle-escapable=""', 'data-toggle-escapable');
    html = html.replaceAll('data-toggle-dismissible=""', 'data-toggle-dismissible');
    html = html.replaceAll('@click.stop=""', '@click.stop');
    html = html.replaceAll(' data-v-app=""', '');
    html = html.replaceAll('defer=""', 'defer');
    html = html.replaceAll('popover=""', 'popover');
    html = html.replaceAll(' data-enpassusermodified="yes"', '');

    html = html.replaceAll('&ltdiv class="code-resize-handle"&gt&lt/div&gt', '###');
    html = html.replace(/\&gt\n.*\#\#\#/, '&gt');
    html = html.replace('<!-- AlpineJsScript -->', '&ltscript src="//unpkg.com/alpinejs" defer&gt&lt/script&gt');

    return html.trim();
}

function getContent(el) {
    var elem = el.closest('.code-content-container');
    var html = _panelContents[elem.getAttribute('id')];
    var languageSelector = elem.querySelector('.language-selector');
    if (languageSelector && languageSelector.value) {
        var html = document.createElement("div");
        html.innerHTML = _panelContents[elem.getAttribute('id')];
        html = html.querySelector('.language-select[data-language='+languageSelector.value+']').innerHTML;
    }
    
    html = cleanContent(html);

    return html;
}

function copyCode(event) {
    var code = getContent(event.target);
    code = code.replace('&ltscript src="//unpkg.com/alpinejs" defer&gt&lt/script&gt', '<script src="//unpkg.com/alpinejs" defer></script>');
    navigator.clipboard.writeText(code).then(function() {
        document.getElementById('copy-code-modal').classList.add('open');
        setTimeout(() => {
            document.getElementById('copy-code-modal').classList.remove('open');
        }, 2000);
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

function resizePanel(e){
    e.preventDefault();
    var rect = _currentPanel.getBoundingClientRect();
    const dx = (e.x - rect.x) + 3;
    if (_currentPanel && dx && dx > 0) {
        _currentPanel.style.width = parseInt(dx) + "px";
    }
}

function loadCodeContainer(el) {

    var elem = el.closest('.code-content-container');
    var codeDiv = elem.querySelector('.code-preview-container');

    var html = getContent(el);
    html = html.replaceAll('<', '&lt').replaceAll('>', '&gt');

    var codeDivContents = '<code class="language-html block w auto bg-surface p-4 bb-1 border/5 sm'+(elem.classList.contains('with-wrap')?' pre-wrap':'')+'">' + html + '</code>';

    codeDiv.innerHTML = codeDivContents;
    Prism.highlightElement(codeDiv.querySelector('.language-html'));

    elem.querySelector('.collapse').classList.toggle('open');
}

document.querySelectorAll('.show-code').forEach((elem, index) => {
    var toggleId = Math.random().toString().replace('.', '');
    var badge = (elem.hasAttribute('data-badge') ? '<'+(elem.hasAttribute('data-badge-link') ? 'a title="Link to '+elem.getAttribute('data-badge-link')+'" aria-label="'+elem.getAttribute('data-badge')+'" href="'+elem.getAttribute('data-badge-link')+'"' : 'span')+' class="badge dense gray outline xs ml-1 align-text-bottom">'+elem.getAttribute('data-badge')+(elem.hasAttribute('data-badge-link') ? '</a>' : '</span>') : '');
    var tooltipWarning = (elem.hasAttribute('data-tooltip-warning') ? '<span class="sm"><i class="icon color-secondary shy"><svg viewBox="0 0 24 24"><path d="M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2v6z" /></svg></i><span class="tooltip sm center-x outset-top">'+elem.getAttribute('data-tooltip-warning')+'</span></span>' : '');
    var note = (elem.hasAttribute('data-note') ? '<p>'+elem.getAttribute('data-note')+'</p>' : '');
    var warning = (elem.hasAttribute('data-warning') ? '<p class="color-warning">'+elem.getAttribute('data-warning')+'</p>' : '');
    var footerNote = (elem.hasAttribute('data-footer-note') ? '<p>'+elem.getAttribute('data-footer-note')+'</p>' : '');
    var codeDiv = '<div class="collapse"><div class="code-preview-container hidden"></div></div>';

    var innerContents = elem.innerHTML;
    _panelContents['code-container-'+index] = innerContents+'';

    var languages = elem.querySelectorAll('.language-select');

    var languageSelector = '';
    var headerNote = warning || note ? '<div class="note bg-faint bb-1 py-2 mt-0">' + warning + note + '</div>' : '';
    var footerNote = footerNote ? '<footer class="bg-faint py-2">' + footerNote + '</footer>' : '';

    var headerNotes = headerNote;
    var footerNotes = footerNote;

    var languageNames = {
        html: 'HTML',
        js: 'JS',
        spryJs: 'SpryJS', 
        petiteVue: 'Petite Vue',
        vueJs: 'Vue.js',
        alpineJs: 'Alpine.js',
    };

    var languageKey = '';
    var languageNote = '';
    var languageWarning = '';
    var languageFooterNote = '';

    if (languages && languages.length) {    
        languageSelector += '<div class="items-center flex mr-1"><select class="language-selector dense pr-4 border/20" onchange="loadCodeContainer(this)">';
        languages.forEach(language => {
            languageKey = language.getAttribute('data-language');
            languageSelector += '<option value="'+languageKey+'">'+languageNames[languageKey]+'</option>';
            languageNote = (language.hasAttribute('data-note') ? '<p>'+language.getAttribute('data-note')+'</p>' : '');
            languageWarning = (language.hasAttribute('data-warning') ? '<p class="color-warning">'+language.getAttribute('data-warning')+'</p>' : '');
            languageFooterNote = (language.hasAttribute('data-footer-note') ? '<footer class="language-'+languageKey+' note p-2 bg-faint mt-0">'+language.getAttribute('data-footer-note')+'</footer>' : '');

            headerNotes += languageNote || languageWarning ? '<div class="language-'+languageKey+' note bg-faint bb-1 py-2 mt-0">' + languageNote + languageWarning + '</div>' : '';
            footerNotes = languageFooterNote + footerNotes;
        });
        languageSelector += '</select></div>';
    }

    var innerContents = elem.innerHTML;

    elem.outerHTML = '<article class="outline code-content-container bg-theme" id="code-container-'+index+'"><header class="block md:flex"><h4>'+elem.getAttribute('data-title')+' '+badge+tooltipWarning+'</h4><div class="flex content-end mt-2 md:mt-0">'+languageSelector+'<button class="shy icon link" title="Toggle Theme" onclick="toggleTheme(this.parentElement.parentElement.parentElement);"><svg viewBox="0 0 24 24"><path d="M12,18V6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z" /></svg></button><button onclick="loadCodeContainer(this)" class="shy icon link" title="Show HTML code"><svg class="lg" viewBox="0 0 24 24"><path d="m14.6 16.6 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4m-5.2 0L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4z" /></svg></button><button class="shy icon link f:swap" title="Copy HTML to Clipboard" onclick="copyCode(event); setTimeout(() => {this.classList.remove(\'open\'); this.classList.remove(\'active\'); this.setAttribute(\'aria-pressed\', false)}, 2000)"><svg viewBox="0 0 24 24"><path d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1z" /></svg><svg viewBox="0 0 24 24"><path d="M21 7 9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59 21 7z" /></svg></button></div></header>'+headerNotes+'<div class="p-0 mt-0"><div id="code-'+toggleId+'" class="code-container">'+codeDiv+'</div></div><div class="code-content relative p-3 md:p-4">'+innerContents+'<div class="code-resize-handle"></div></div>'+footerNotes+'</article>';
});

document.querySelectorAll('.code-resize-handle').forEach((elem) => {
    elem.addEventListener("mousedown", function(e){
        elem.classList.add('moving');
        document.body.style.cursor = 'ew-resize';
        e.preventDefault();
        _currentPanel = elem.closest('.code-content-container');
        document.addEventListener("mousemove", resizePanel, false);
    }, false);
});

document.addEventListener("mouseup", function(){
    _currentPanel = null;
    document.removeEventListener("mousemove", resizePanel, false);
    document.querySelectorAll('.code-resize-handle.moving').forEach((elem) => {
        elem.classList.remove('moving');
        document.body.style.cursor = 'default';
    });
}, false);

document.querySelectorAll('[href="#"]').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        return false;
    });
});