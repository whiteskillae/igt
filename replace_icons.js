const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const replacements = [
    { from: /<link rel="stylesheet" href="https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/font-awesome\/6.5.0\/css\/all.min.css">/g, to: '<script src="https://unpkg.com/lucide@latest"></script>' },
    // Trust section updates
    { from: /<i class="fa-solid fa-check-circle"><\/i>/g, to: '<i data-lucide="check-circle" stroke-width="2.5"></i>' },
    // Nav / Sidebar
    { from: /<i class="fa-solid fa-house"><\/i>/g, to: '<i data-lucide="home"></i>' },
    { from: /<i class="fa-solid fa-circle-info"><\/i>/g, to: '<i data-lucide="info"></i>' },
    { from: /<i class="fa-solid fa-handshake"><\/i>/g, to: '<i data-lucide="briefcase"></i>' },
    { from: /<i class="fa-solid fa-user-nurse"><\/i>/g, to: '<i data-lucide="heart-pulse"></i>' },
    { from: /<i class="fa-solid fa-child-reaching"><\/i>/g, to: '<i data-lucide="users"></i>' },
    { from: /<i class="fa-solid fa-hospital-user"><\/i>/g, to: '<i data-lucide="building-2"></i>' },
    { from: /<i class="fa-solid fa-graduation-cap"><\/i>/g, to: '<i data-lucide="graduation-cap"></i>' },
    { from: /<i class="fa-solid fa-envelope"><\/i>/g, to: '<i data-lucide="mail"></i>' },
    // Benefits / general
    { from: /<i class="fa-solid fa-circle-check"><\/i>/g, to: '<i data-lucide="check-circle-2"></i>' },
    { from: /<i class="fa-brands fa-whatsapp"><\/i>/g, to: '<i data-lucide="message-circle" stroke-width="2.5"></i>' },
    // Service icons
    { from: /<i class="fa-solid fa-globe"><\/i>/g, to: '<i data-lucide="globe-2"></i>' },
    { from: /<i class="fa-solid fa-user-doctor"><\/i>/g, to: '<i data-lucide="stethoscope"></i>' },
    { from: /<i class="fa-solid fa-passport"><\/i>/g, to: '<i data-lucide="file-check-2"></i>' },
    { from: /<i class="fa-solid fa-file-contract"><\/i>/g, to: '<i data-lucide="file-signature"></i>' },
    { from: /<i class="fa-solid fa-plane-departure"><\/i>/g, to: '<i data-lucide="plane"></i>' },
    { from: /<i class="fa-solid fa-hand-holding-heart"><\/i>/g, to: '<i data-lucide="heart-handshake"></i>' },
    // Footer / Contacts
    { from: /<i class="fa-solid fa-location-dot"><\/i>/g, to: '<i data-lucide="map-pin"></i>' },
    { from: /<i class="fa-solid fa-phone"><\/i>/g, to: '<i data-lucide="phone"></i>' },
    // Emojis mapping
    { from: /🇦🇪/g, to: '<i data-lucide="map-pin"></i>' },
    { from: /🇶🇦/g, to: '<i data-lucide="map-pin"></i>' },
    { from: /🇦🇺/g, to: '<i data-lucide="map-pin"></i>' },
    { from: /🇩🇪/g, to: '<i data-lucide="map-pin"></i>' },
    { from: /🇬🇪/g, to: '<i data-lucide="map-pin"></i>' },
    // Generic fallback for any remaining FA icons
    { from: /<i class="fa-[a-z]+ fa-([^"]+)"><\/i>/g, to: '<i data-lucide="$1"></i>' }
];

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Auto-fix the glassmorphism classes while we're looping through
    content = content.replace(/class="([^"]*service-card[^"]*)"/g, 'class="$1 glass-light"');
    content = content.replace(/class="([^"]*value-card[^"]*)"/g, 'class="$1 glass-light"');
    content = content.replace(/class="([^"]*country-card[^"]*)"/g, 'class="$1 glass-dark"');
    content = content.replace(/class="([^"]*stat-card[^"]*)"/g, 'class="$1 glass-dark"');
    
    // Replace icons
    replacements.forEach(r => {
        content = content.replace(r.from, r.to);
    });

    fs.writeFileSync(path.join(dir, file), content, 'utf8');
});

console.log('Successfully completed typography and icon SVG mapping!');
