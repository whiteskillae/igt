/* ================================================================
   PREMIUM UAE FLAG PAGE TRANSITIONS — ULTIMATE SMOOTH VERSION
   ================================================================ */

(function() {
    // 1. IMMEDIATE CSS INJECTION
    const styleId = 'igt-loader-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            #page-loader {
                position: fixed; inset: 0; z-index: 9999999;
                background: #020617; display: none; flex-direction: column;
                align-items: center; justify-content: center;
                transition: opacity 0.5s ease, visibility 0.5s;
                overflow: hidden; pointer-events: all;
            }
            #page-loader.active { display: flex; }
            #page-loader.loader-hidden { opacity: 0; visibility: hidden; pointer-events: none; }
            .loader-bg-effects { position: absolute; inset: 0; overflow: hidden; }
            .glow-center {
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 600px; height: 600px;
                background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
                filter: blur(80px); pointer-events: none;
            }
            .uae-flag-box {
                position: relative; width: 180px; height: 180px;
                border-radius: 24px; overflow: hidden;
                box-shadow: 0 25px 60px rgba(0,0,0,0.5);
                border: 1px solid rgba(255,255,255,0.1);
                margin-bottom: 40px;
                animation: flag-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .uae-flag-inner { display: flex; width: 100%; height: 100%; }
            .flag-red { width: 32%; height: 100%; background: #EE1C25; z-index: 2; }
            .flag-right { flex: 1; display: flex; flex-direction: column; }
            .flag-green { height: 33.33%; background: #009739; }
            .flag-white { height: 33.33%; background: #FFFFFF; }
            .flag-black { height: 33.33%; background: #000000; }
            .flag-shimmer {
                position: absolute; inset: 0;
                background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%);
                background-size: 200% 200%;
                animation: shimmer-anim 3s infinite;
            }
            .loader-text-wrap { text-align: center; color: white; animation: text-fade-up 0.8s ease-out 0.2s both; }
            .stand-with-uae { font-size: 1.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.3em; margin-bottom: 15px; }
            .text-red { color: #EE1C25; }
            .loader-divider { width: 80px; height: 4px; background: #009739; margin: 0 auto 25px; border-radius: 10px; }
            .brand-identity { display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 25px; }
            .brand-identity p { font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.6em; margin: 0; }
            .text-blue { color: #3b82f6; }
            .side-line { height: 1px; width: 40px; background: rgba(255,255,255,0.2); }
            .loading-dots { display: flex; justify-content: center; gap: 8px; }
            .loading-dots span { width: 6px; height: 6px; background: #3b82f6; border-radius: 50%; animation: dot-pulse 1.2s infinite; }
            .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
            .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes flag-pop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            @keyframes shimmer-anim { 0% { background-position: -200% -200%; } 100% { background-position: 200% 200%; } }
            @keyframes text-fade-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes dot-pulse { 0%, 100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(1.4); opacity: 1; } }
            .stars-container { position: absolute; width: 100%; height: 100%; background: transparent; }
        `;
        document.head.appendChild(style);
    }

    // 2. LOADER INJECTION
    function injectLoader() {
        if (document.getElementById('page-loader')) return;
        const loaderHTML = `
            <div id="page-loader">
                <div class="loader-bg-effects"><div class="stars-container"></div><div class="glow-center"></div></div>
                <div class="loader-content">
                    <div class="uae-flag-box">
                        <div class="uae-flag-inner">
                            <div class="flag-red"></div>
                            <div class="flag-right"><div class="flag-green"></div><div class="flag-white"></div><div class="flag-black"></div></div>
                        </div>
                        <div class="flag-shimmer"></div>
                    </div>
                    <div class="loader-text-wrap">
                        <h2 class="stand-with-uae">We Stand with <span class="text-red">UAE</span></h2>
                        <div class="loader-divider"></div>
                        <div class="brand-identity"><span class="side-line"></span><p>IGT <span class="text-blue">Global Talent</span></p><span class="side-line"></span></div>
                        <div class="loading-dots"><span></span><span></span><span></span></div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', loaderHTML);
    }

    // 3. LOGIC — THE "ONE TIME" FIX
    const isFirstVisit = !sessionStorage.getItem('igt_intro_done');
    
    // Check for first visit ONLY. Subsequent pages load naturally (snappy).
    if (isFirstVisit) {
        injectLoader();
        const loader = document.getElementById('page-loader');
        loader.classList.add('active');
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('loader-hidden');
                sessionStorage.setItem('igt_intro_done', 'true');
                setTimeout(() => { loader.style.display = 'none'; }, 600);
            }, 2500);
        });
        
        setTimeout(() => { if(loader) loader.classList.add('loader-hidden'); }, 5000);
    }

    // Intercept link clicks — ONLY show loader on the SOURCE page
    document.addEventListener('click', e => {
        const link = e.target.closest('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not(.no-transition)');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || href === '#' || href.includes('javascript:')) return;

        try {
            const url = new URL(link.href);
            if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
                e.preventDefault();
                
                injectLoader();
                const loader = document.getElementById('page-loader');
                loader.style.display = 'flex';
                loader.classList.add('active');
                loader.classList.remove('loader-hidden');
                
                // Navigate after a short delay to let the animation play
                setTimeout(() => { window.location.href = link.href; }, 600);
            }
        } catch(err) {}
    });

    // Back button support
    window.addEventListener('pageshow', (e) => {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.classList.add('loader-hidden');
            setTimeout(() => { loader.style.display = 'none'; }, 600);
        }
    });

})();

