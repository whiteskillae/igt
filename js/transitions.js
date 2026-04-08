/* ================================================================
   PAGE TRANSITIONS & LOADING ANIMATION
   ================================================================ */

document.addEventListener("DOMContentLoaded", () => {
    // Inject page loader HTML
    const loaderHTML = `
      <div id="page-loader" class="page-loader">
        <div class="loader-content">
          <div class="loader-logo">IBREU</div>
          <div class="loader-spinner"></div>
        </div>
      </div>
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
        }, 300); // Small delay for smooth feel
    });

    // Intercept link clicks for smooth exit animation
    const links = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])');
    
    links.forEach(link => {
        link.addEventListener('click', e => {
            // Check if it's the current page, if so, don't do transition
            if (link.href === window.location.href) return;
            
            // Check if it's a valid internal page link
            try {
                const url = new URL(link.href);
                if (url.origin === window.location.origin) {
                    e.preventDefault();
                    
                    // Show loader for exit transition
                    loader.style.display = 'flex';
                    // Force reflow
                    loader.offsetHeight;
                    loader.classList.remove('loader-hidden');
                    
                    setTimeout(() => {
                        window.location = link.href;
                    }, 400); // Wait for transition before navigating
                }
            } catch(err) {
                // Ignore invalid URLs
            }
        });
    });
});
