const projects = [
    {
        title: 'Karang Taruna 05',
        badge: 'HTML & CSS • Redesign',
        desc: 'Redesigned the homepage using CSS to improve the user interface and experience.',
        img: 'assets/img/slide/karang-taruna-ss-1.png',
        link: 'https://jajangnurrizqi.github.io/karang-taruna/'
    },
    {
        title: 'Warung Sehat',
        badge: 'HTML & CSS • Layout Design',
        desc: 'Making css layout for Workshop project for web shopping.',
        img: 'assets/img/slide/warung-sehat-ss-1.png',
        link: 'https://jajangnurrizqi.github.io/warung-sehat/'
    },
    {
        title: 'Penulis Catatan',
        badge: 'HTML & Javascript',
        desc: 'Web App for taking notes and save it to localstorage.',
        img: 'assets/img/slide/catatan.png',
        link: 'https://jajangnurrizqi.github.io/Catatan/'
    }
];

(function () {
    const root = document.getElementById('carousel');
    if (!root || !projects.length) return;

    const slidesEl = root.querySelector('.carousel-slides');
    const descsEl = root.querySelector('.description-slides');
    const thumbsEl = root.querySelector('.thumbnail-strip');
    const prevBtn = root.querySelector('.nav-arrow.prev');
    const nextBtn = root.querySelector('.nav-arrow.next');
    const total = projects.length;
    const INTERVAL = 4000;
    let index = 0;
    let timer = null;

    root.style.setProperty('--total-slides', total);

    projects.forEach((p, i) => {
        slidesEl.insertAdjacentHTML('beforeend',
            `<div class="carousel-slide">
                    <span class="imgCarousel" style="background-image:url('${p.img}')"></span>
                </div>`);

        descsEl.insertAdjacentHTML('beforeend',
            `<div class="description-slide">
                    <a href="${p.link}" target="_blank" rel="noopener">
                        <div class="slide-header">
                            <span class="slide-title">${i + 1}. ${p.title}</span>
                            <span class="slide-badge">${p.badge}</span>
                        </div>
                        <div class="slide-desc">${p.desc}</div>
                    </a>
                </div>`);

        thumbsEl.insertAdjacentHTML('beforeend',
            `<button type="button" class="thumb-label" data-i="${i}" title="${p.title}">
                    <img src="${p.img}" alt="${p.title}">
                </button>`);
    });

    const thumbs = thumbsEl.querySelectorAll('.thumb-label');

    function goTo(i) {
        index = (i + total) % total;   // looping: dari slide terakhir kembali ke pertama
        root.style.setProperty('--index', index);
        thumbs.forEach((t, n) => t.classList.toggle('active', n === index));
    }

    function startAuto() {
        stopAuto();
        if (total < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        timer = setInterval(() => goTo(index + 1), INTERVAL);
    }

    function stopAuto() {
        clearInterval(timer);
    }

    prevBtn.addEventListener('click', () => { goTo(index - 1); startAuto(); });
    nextBtn.addEventListener('click', () => { goTo(index + 1); startAuto(); });
    thumbsEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.thumb-label');
        if (btn) { goTo(Number(btn.dataset.i)); startAuto(); }
    });

    // Berhenti saat kursor di atas carousel atau tombol difokus
    root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') stopAuto(); });
    root.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') startAuto(); });
    root.addEventListener('focusin', stopAuto);
    root.addEventListener('focusout', startAuto);

    if (total < 2) {
        prevBtn.hidden = true;
        nextBtn.hidden = true;
        thumbsEl.hidden = true;
    }

    const viewport = root.querySelector('.carousel-viewport');
    let startX = null;

    viewport.addEventListener('pointerdown', (e) => { startX = e.clientX; });
    viewport.addEventListener('pointercancel', () => { startX = null; });
    viewport.addEventListener('pointerup', (e) => {
        if (startX === null) return;
        const dx = e.clientX - startX;
        startX = null;
        if (Math.abs(dx) > 40) {
            goTo(index + (dx < 0 ? 1 : -1));
            startAuto();
        }
    });
    goTo(0);
    const a = thumbs[index].getBoundingClientRect();
    const s = thumbsEl.getBoundingClientRect();
    thumbsEl.scrollBy({ left: a.left - s.left - (s.width - a.width) / 2, behavior: 'smooth' });
    startAuto();
})();
