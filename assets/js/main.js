(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active') && !navmenu.classList.contains('toggle-dropdown')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

/**
 * Custom Pagination Isotope for Portofolio (6 Items per page)
 */
document.addEventListener('DOMContentLoaded', () => {
  // Kita pastikan skrip ini berjalan sedikit lebih akhir agar tidak tabrakan dengan inisiasi template asli
  window.addEventListener('load', () => {
    const grid = document.querySelector('.academics .isotope-container');
    if (!grid) return;

    // Ambil Isotope instance yang digenerate oleh file main.js bawaan
    let iso = Isotope.data(grid);
    if (!iso) {
      iso = new Isotope(grid, {
        itemSelector: '.isotope-item',
        layoutMode: 'masonry'
      });
    }

    const itemsPerPage = 6;
    let currentPage = 1;
    let currentFilter = '*';
    const items = Array.from(grid.querySelectorAll('.isotope-item'));
    const paginationList = document.getElementById('portfolio-pagination');
    const filterBtns = document.querySelectorAll('.academics .isotope-filters li');

    // Fungsi Render Halaman
    function updatePagination() {
      // Filter data sesuai Kategori
      let matchedItems = items.filter(item => {
        if (currentFilter === '*') return true;
        let classToFind = currentFilter.replace('.', '');
        return item.classList.contains(classToFind);
      });

      // Hitung halaman
      let totalPages = Math.ceil(matchedItems.length / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

      // Render Pagination Buttons
      paginationList.innerHTML = '';
      if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
          let li = document.createElement('li');
          let btn = document.createElement('button');
          btn.innerText = i;
          if (i === currentPage) btn.classList.add('active');
          
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            updatePagination();
            // Scroll ke atas dengan halus saat ganti halaman
            document.getElementById('academics').scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
          
          li.appendChild(btn);
          paginationList.appendChild(li);
        }
      }

      // Menghitung index item yang harus tampil
      let start = (currentPage - 1) * itemsPerPage;
      let end = start + itemsPerPage;

      // Tambah kelas khusus 'page-visible' untuk item di halaman ini
      items.forEach(item => item.classList.remove('page-visible'));
      matchedItems.slice(start, end).forEach(item => item.classList.add('page-visible'));

      // Filter via Isotope Native menggunakan '.page-visible'
      iso.arrange({
        filter: function(itemElem) {
          return itemElem.classList.contains('page-visible');
        }
      });
    }

    // Modifikasi fungsi klik filter bawaan
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation(); // Block main.js bawaan agar fungsi kita jalan
        
        filterBtns.forEach(b => b.classList.remove('filter-active'));
        this.classList.add('filter-active');

        currentFilter = this.getAttribute('data-filter');
        currentPage = 1; // Kembali ke hal 1 saat filter diganti
        updatePagination();
      }, true); // Event capturing
    });

    // Jalankan kalkulasi saat halaman selesai dimuat
    updatePagination();
  });
});