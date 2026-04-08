/* ================================================================
   PREMIUM PAGE TRANSITIONS & SVG LOADING ANIMATION
   ================================================================ */

document.addEventListener("DOMContentLoaded", () => {
    // Inject premium SVG loader HTML
    const loaderHTML = `
      <div id="page-loader" class="page-loader">
        <div class="loader-content">
          <svg class="loader-svg" width="120" height="120" viewBox="0 0 100 100">
             <defs>
                 <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stop-color="#D4AF37" />
                     <stop offset="100%" stop-color="#B8960C" />
                 </linearGradient>
             </defs>
             <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2"/>
             <circle class="svg-path" cx="50" cy="50" r="45" fill="none" stroke="url(#gold-grad)" stroke-width="2" stroke-linecap="round"/>
             <path d="M35,35 L65,35 L65,65 L35,65 Z" fill="none" stroke="rgba(212,175,55,0.4)" stroke-width="1" transform="rotate(45 50 50)"/>
          </svg>
          <div class="loader-logo">IBREU</div>
        </div>
      </div>
      <style>
        .loader-svg { margin-bottom: -10px; }
        .svg-path {
           stroke-dasharray: 283;
           stroke-dashoffset: 283;
           animation: dash 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes dash {
           0% { stroke-dashoffset: 283; transform: rotate(0deg); transform-origin: center; }
           50% { stroke-dashoffset: 0; transform: rotate(180deg); transform-origin: center; }
           100% { stroke-dashoffset: 283; transform: rotate(360deg); transform-origin: center; }
        }
      </style>
    `;
    document.body.insertAdjacentHTML('afterbegin', loaderHTML);

    const loader = document.getElementById('page-loader');

    // Remove loader when page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('loader-hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 600); // Matches CSS transition duration
        }, 150); // Small delay for smooth feel
    });

    // Intercept link clicks for smooth exit animation
    const links = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not(.no-transition)');
    
    links.forEach(link => {
        link.addEventListener('click', e => {
            if (link.href === window.location.href) return;
            
            try {
                const url = new URL(link.href);
                if (url.origin === window.location.origin) {
                    e.preventDefault();
                    
                    loader.style.display = 'flex';
                    loader.offsetHeight;
                    loader.classList.remove('loader-hidden');
                    
                    setTimeout(() => {
                        window.location = link.href;
                    }, 450); // Wait for transition out
                }
            } catch(err) {}
        });
    });
});
