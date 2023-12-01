/**
 * Spry Docs JS
 *
 * Version: 1.0.0
 * Author: gedde.dev
 * Github: https://github.com/ggedde/spry-css
 */

function toggleTheme(parent) {
    if (parent !== document.documentElement) {
        var theme = parent.hasAttribute('data-theme') ? ( parent.getAttribute('data-theme') === 'dark' ? 'light' : 'dark') : ( document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        parent.setAttribute('data-theme', theme );
        var child = parent.querySelector('[data-theme]');
        if (child) {
            child.setAttribute('data-theme', theme);
            var codeVals = parent.querySelectorAll('.attr-value');
            if (codeVals) {
                codeVals.forEach(val => {
                    if (val.innerHTML && (val.innerHTML.indexOf('dark') || val.innerHTML.indexOf('light'))) {
                        val.innerHTML = val.innerHTML.replace('dark', theme);
                        val.innerHTML = val.innerHTML.replace('light', theme);
                    }
                });
            }
            var codeTitle = parent.querySelector('article header h4');
            if (codeTitle.innerHTML && (codeTitle.innerHTML.indexOf('Dark Theme') > -1 || codeTitle.innerHTML.indexOf('Light Theme') > -1)) {
                codeTitle.innerHTML = codeTitle.innerHTML.replace('Dark', theme.charAt(0).toUpperCase() + theme.slice(1));
                codeTitle.innerHTML = codeTitle.innerHTML.replace('Light', theme.charAt(0).toUpperCase() + theme.slice(1));
            }
        }
    } else {
        parent.setAttribute('data-theme', parent.getAttribute('data-theme') === 'dark' ? '' : 'dark');
    }
} 

function cleanContent(html) {
    html = html.replaceAll(' class="bg-faint rounded p-1"', '');
    html = html.replaceAll('bg-faint rounded p-1 ', '');
    html = html.replaceAll(' bg-faint rounded p-1', '');
    var firsTag = html.indexOf('&');
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
        html = html.replaceAll('data-loop=""', 'data-loop');
        html = html.replaceAll('data-snap=""', 'data-snap');
        html = html.replaceAll('data-over=""', 'data-over');
        html = html.replaceAll('data-wait=""', 'data-wait');
        html = html.replaceAll('data-toggle=""', 'data-toggle');
        html = html.replaceAll('data-theme-dark=""', 'data-theme-dark');
    });

    return html;
}

function copyCode(event) {
    var html = event.target.parentElement.parentElement.parentElement.querySelector('.code-content').innerHTML;
    console.log(cleanContent(html));
    navigator.clipboard.writeText(cleanContent(html)).then(function() {
        Spry.toggle('#copy-code-modal');
        setTimeout(() => {
            Spry.toggle('#copy-code-modal', 'close');
        }, 2000);
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

document.querySelectorAll('.show-code').forEach((elem) => {
    var id = 'toggle-' + Math.random();
    var html = elem.innerHTML.replaceAll('<', '&lt').replaceAll('>', '&gt');
    html = cleanContent(html);

    var toggleId = Math.random().toString().replace('.', '');
    elem.innerHTML = '<article class="mb-3"><header class="pr-1 sm md-md"><h4>'+elem.getAttribute('data-title')+' '+(elem.hasAttribute('data-badge') ? '<span class="badge base outline xs ml-1">'+elem.getAttribute('data-badge')+'</span>' : '')+(elem.hasAttribute('data-tooltip-warning') ? '<span class="sm"><i class="icon color-secondary shy"><svg viewBox="0 0 24 24"><path d="M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2v6z" /></svg></i><span class="tooltip sm center-x outset-top">'+elem.getAttribute('data-tooltip-warning')+'</span></span>' : '')+(elem.hasAttribute('data-title-note') ? '<div class="note xs my-1 color-base">'+elem.getAttribute('data-title-note')+'</div>' : '')+'</h4><div class="no-wrap"><button class="shy icon link contrast" title="Toggle Theme" onclick="toggleTheme(this.parentElement.parentElement.parentElement.parentElement);"><svg viewBox="0 0 24 24"><path d="M12,18V6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z" /></svg></button><button data-toggle="#code-'+toggleId+'" class="shy icon link contrast" title="Show HTML code"><svg class="lg" viewBox="0 0 24 24"><path d="m14.6 16.6 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4m-5.2 0L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4z" /></svg></button><button class="shy icon link contrast" title="Copy HTML to Clipboard" onclick="copyCode(event); setTimeout(() => {this.classList.remove(\'open\'); this.setAttribute(\'aria-pressed\', false)}, 2000)" data-toggle><svg viewBox="0 0 24 24"><path d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1z" /></svg><svg viewBox="0 0 24 24"><path d="M21 7 9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59 21 7z" /></svg></button></div></header><div class="p-0"><div id="code-'+toggleId+'" class="code-container closed"><pre class="mb-0"><code class="language-html'+(elem.classList.contains('with-wrap')?' pre-wrap':'')+'">' + html + '</code></pre></div></div><div class="p-2 code-content">'+elem.innerHTML+'</div>'+(elem.hasAttribute('data-note') ? '<div class="note mt-1 mb-2 color-base">'+elem.getAttribute('data-note')+'</div>' : '')+'</article>';
});

document.querySelectorAll('[href="#"]').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        return false;
    });
});

// document.querySelectorAll('input:not([type=checkbox],[type=radio]), textarea, select').forEach(elem => {
//     elem.addEventListener('blur', event => {
//         elem.classList.toggle('active', elem.value !== '');
//     });
// });