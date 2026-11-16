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

  /* Grid guides: one faint line down the middle of every gutter, faded out wherever
     text would sit on top of it. Boxes with their own background already cover the
     guides, so text inside them is ignored and the line runs up to the box edge. */
  var lines = document.querySelector('.grid-lines');
  var lineFrame = lines && lines.querySelector('.frame');
  if (lineFrame) {
    var FADE = 14, PAD_X = 8, PAD_Y = 5, JOIN = 72;
    var SOLID = '.site-header, .finding, .radar, .rl-diagram, .spec, .venture, .work-card, .lightbox, .year-num';
    var probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;height:0;width:var(--gut)';
    lines.appendChild(probe);
    var guides = [];

    var drawGuides = function () {
      var cs = getComputedStyle(lineFrame);
      var box = lineFrame.getBoundingClientRect();
      var gut = probe.getBoundingClientRect().width;
      var cols = parseInt(getComputedStyle(root).getPropertyValue('--cols'), 10) || 12;
      var left = box.left + parseFloat(cs.paddingLeft) + window.scrollX;
      var step = (box.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) + gut) / cols;
      var xs = [];
      for (var k = 1; k < cols; k++) xs.push(left + k * step - gut / 2);

      /* every rendered line of text, in page coordinates */
      var spans = xs.map(function () { return []; });
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      var range = document.createRange(), node;
      while ((node = walker.nextNode())) {
        if (!node.nodeValue.trim() || !node.parentElement || node.parentElement.closest(SOLID)) continue;
        range.selectNodeContents(node);
        var rects = range.getClientRects();
        for (var r = 0; r < rects.length; r++) {
          var rc = rects[r];
          if (!rc.width || !rc.height) continue;
          var l = rc.left + window.scrollX - PAD_X, rt = rc.right + window.scrollX + PAD_X;
          for (var i = 0; i < xs.length; i++) {
            if (xs[i] > l && xs[i] < rt) spans[i].push([rc.top + window.scrollY - PAD_Y, rc.bottom + window.scrollY + PAD_Y]);
          }
        }
      }

      xs.forEach(function (x, i) {
        var el = guides[i];
        if (!el) { el = guides[i] = document.createElement('div'); el.className = 'guide'; lines.appendChild(el); }
        el.style.display = '';
        el.style.left = x + 'px';
        /* merge text lines into blocks, so the guide does not reappear as short stubs between them */
        var merged = [];
        spans[i].sort(function (a, b) { return a[0] - b[0]; }).forEach(function (sp) {
          var last = merged[merged.length - 1];
          if (last && sp[0] - last[1] < JOIN) last[1] = Math.max(last[1], sp[1]);
          else merged.push([sp[0], sp[1]]);
        });
        var stops = ['var(--guide) 0'];
        merged.forEach(function (m) {
          stops.push('var(--guide) ' + Math.max(0, m[0] - FADE) + 'px', 'transparent ' + Math.max(0, m[0]) + 'px',
                     'transparent ' + m[1] + 'px', 'var(--guide) ' + (m[1] + FADE) + 'px');
        });
        el.style.background = 'linear-gradient(to bottom, ' + stops.join(', ') + ')';
      });
      for (var g = xs.length; g < guides.length; g++) guides[g].style.display = 'none';
      lines.classList.add('is-drawn');
    };

    var queued = false;
    var queueGuides = function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; drawGuides(); });
    };
    drawGuides();
    window.addEventListener('resize', queueGuides);
    window.addEventListener('load', queueGuides);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueGuides);
    if (window.ResizeObserver) new ResizeObserver(queueGuides).observe(document.body);
  }

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
