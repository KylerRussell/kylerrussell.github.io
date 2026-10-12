(function () {
  /* Theme toggle: flips between light and dark, remembered per browser */
  var root = document.documentElement;
  function current() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  });

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Archive: switch photos with the square dots (auto-cycles on hover) */
  document.querySelectorAll('.shot-media.multi').forEach(function (media) {
    var imgs = media.querySelectorAll('.shot-img');
    var dots = media.querySelectorAll('.dot');
    var i = 0, timer = null;
    function show(n) {
      i = (n + imgs.length) % imgs.length;
      imgs.forEach(function (el, j) { el.classList.toggle('is-active', j === i); });
      dots.forEach(function (el, j) { el.classList.toggle('is-active', j === i); });
    }
    dots.forEach(function (d, j) {
      d.addEventListener('click', function (e) { e.stopPropagation(); show(j); });
    });
    if (!reduce) {
      media.addEventListener('mouseenter', function () { timer = setInterval(function () { show(i + 1); }, 1400); });
      media.addEventListener('mouseleave', function () { clearInterval(timer); });
    }
  });

  /* Lightbox */
  var box = document.querySelector('.lightbox');
  if (box && typeof box.showModal === 'function') {
    var boxImg = box.querySelector('img');
    document.querySelectorAll('.shot-img, .thumb').forEach(function (b) {
      b.addEventListener('click', function () {
        var img = b.querySelector('img');
        boxImg.src = b.getAttribute('data-full');
        boxImg.alt = img ? img.alt : '';
        box.showModal();
      });
    });
    box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
  }
})();
