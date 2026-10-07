(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // Sticky nav + mobile menu
  var nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  function toggleMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { toggleMenu(!menu.classList.contains('open')); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { toggleMenu(false); }); });

  // Menu tabs
  $$('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      $$('.tab').forEach(function (x) { x.classList.remove('active'); });
      $$('.panel').forEach(function (p) { p.classList.remove('active'); });
      t.classList.add('active');
      $('#' + t.dataset.tab).classList.add('active');
    });
  });

  // Reveal on scroll
  var items = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Testimonials carousel
  var qs = $$('#quotes blockquote'), dots = $('#dots'), cur = 0, timer;
  qs.forEach(function (_, i) {
    var b = document.createElement('button');
    b.setAttribute('aria-label', 'Opinión ' + (i + 1));
    b.addEventListener('click', function () { show(i); start(); });
    dots.appendChild(b);
  });
  function show(i) {
    cur = i;
    qs.forEach(function (q, j) { q.classList.toggle('show', j === i); });
    $$('button', dots).forEach(function (d, j) { d.classList.toggle('on', j === i); });
  }
  function start() { clearInterval(timer); timer = setInterval(function () { show((cur + 1) % qs.length); }, 6000); }
  show(0); start();

  // Reservation form
  var fecha = $('#fecha');
  var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  fecha.min = today.toISOString().slice(0, 10);
  $('#form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, ok = true, msg = $('#msg');
    $$('[required]', f).forEach(function (el) {
      var bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
      el.classList.toggle('err', bad);
      if (bad) ok = false;
    });
    if (ok) {
      var d = new Date(f.fecha.value + 'T12:00');
      if (d.getDay() === 0 || d.getDay() === 1) {
        f.fecha.classList.add('err');
        msg.style.color = '#b3382c';
        msg.textContent = 'Cerramos domingos y lunes. Elija otra fecha.';
        return;
      }
      msg.style.color = '';
      msg.textContent = 'Gracias, ' + f.nombre.value.split(' ')[0] + '. Hemos recibido su solicitud y le confirmaremos por email en menos de 24 h.';
      f.reset();
    } else {
      msg.style.color = '#b3382c';
      msg.textContent = 'Revise los campos marcados.';
    }
  });

  $('#year').textContent = new Date().getFullYear();
})();
