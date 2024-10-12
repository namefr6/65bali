/* eslint-disable func-names */
/* eslint-disable no-var */
/** Load script file */
function loadScript(path, onComplete)
{
    var script = document.createElement('script');

    if (onComplete) script.onload = onComplete;
    script.src = path;
    document.head.appendChild(script);
}


/** Init app */
function initApp()
{
    // Set SDK debug mode
    if (window.PokiSDK && window.GAME_CONFIG && window.GAME_CONFIG.pokiSdkDebug !== undefined)
    {
        window.PokiSDK.setDebug(window.GAME_CONFIG.pokiSdkDebug);
    }

    loadScript('./js/dependencies.bundle.js');
    loadScript(window.MAIN ? window.MAIN : './js/index.js?v=2');
}

/** Prevent arrows and space from scrolling browser */
function preventDefaultKeyboardEvents()
{
    const keys = [
        ' ',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
    ];

    function onKey(e)
    {
        if (keys.indexOf(e.key) < 0) return;
        e.preventDefault();
    }

    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
}

function registerServiceWorker(onComplete)
{
    if (navigator.serviceWorker && !window.NOSW)
    {
        console.log('Service worker available');
        navigator.serviceWorker.register('./sw.js', { scope: './' })
            .then(function ()
            {
                console.log('Service worker registered');
                if (onComplete) onComplete();
            })
            .catch(function (error)
            {
                // eslint-disable-next-line prefer-template
                console.log('Service worker registration failed - ' + error);
                if (onComplete) onComplete();
            });
    }
    else if (onComplete)
    {
        onComplete();
    }
}

/** Prevent default keyboard events */
preventDefaultKeyboardEvents();

/** Register service worker if available */
registerServiceWorker(function ()
{
    initPokiSDK(function ()
    {
        initApp();
    });
});

