/* Dot-matrix animated background.
   Renders a tilted 3D plane of dots with a traveling "stadium wave" scan line
   and a cursor-proximity glow onto a canvas injected behind section content.
   Applied to .hero and .projects-page-header sections.

   Colors are theme-aware via the --dot-matrix-dot / --dot-matrix-bg CSS vars
   defined in style.css (light + dark values). */
(function () {
  'use strict';

  var SETTINGS = {
    spacing: 12,      // px between dots
    baseSize: 1,      // resting dot radius (px)
    maxSize: 6,       // dot radius at full excitement (px)
    radius: 180,      // cursor falloff radius (px)
    tilt: -80,         // camera pitch in degrees: negative looks up from below, positive looks down from above
    yaw: 0,           // camera swing in degrees: negative views from the left, positive from the right
    autoRotate: true,// continuously spin the plane about the vertical axis
    rotSpeed: 0.12,   // auto-rotate speed (radians per second)
    perspective: 200, // focal length
    scanSpeed: 0.35,  // scan wave travel speed
    scanHeight: 120,  // how far the wave pushes dots toward camera (px)
    scanWidth: 170,   // gaussian width of the wave crest (px)
    drift: 0,         // ambient ripple amplitude (px), 0 = off
    waveSpeed: 3      // ambient ripple speed
  };

  var REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function hexToRgb(hex) {
    var m = hex.replace('#', '');
    if (m.length === 3) m = m.split('').map(function (x) { return x + x; }).join('');
    var n = parseInt(m, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function DotMatrix(section) {
    this.section = section;
    var canvas = document.createElement('canvas');
    canvas.className = 'dot-matrix-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    section.insertBefore(canvas, section.firstChild);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.mouse = { x: -9999, y: -9999, active: false };
    this.t0 = performance.now();
    this.lastT = 0;
    this.yaw = SETTINGS.yaw * Math.PI / 180; // accumulates when autoRotate is on
    this.visible = true;
    this.raf = null;

    this.readColors();
    this.resize();

    var self = this;

    if (typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(function () {
        self.resize();
        if (REDUCED_MOTION) self.renderFrame(0);
      });
      this.ro.observe(section);
    } else {
      window.addEventListener('resize', function () { self.resize(); });
    }

    if (!REDUCED_MOTION) {
      window.addEventListener('mousemove', function (e) {
        self.mouse.x = e.clientX;
        self.mouse.y = e.clientY;
        self.mouse.active = true;
      });
      window.addEventListener('mouseout', function () { self.mouse.active = false; });

      // Pause the animation while the section is offscreen.
      if (typeof IntersectionObserver !== 'undefined') {
        this.io = new IntersectionObserver(function (entries) {
          self.visible = entries[0].isIntersecting;
          if (self.visible && self.raf === null) self.loop();
        });
        this.io.observe(section);
      }
      this.loop();
    } else {
      this.renderFrame(0);
    }
  }

  DotMatrix.prototype.readColors = function () {
    this.dotRgb = hexToRgb(cssVar('--dot-matrix-dot', '#E2A68B'));
    this.bg = cssVar('--dot-matrix-bg', '#F2F2F2');
  };

  DotMatrix.prototype.resize = function () {
    var r = this.section.getBoundingClientRect();
    this.W = Math.max(1, Math.round(r.width));
    this.H = Math.max(1, Math.round(r.height));
    this.canvas.width = Math.round(this.W * this.dpr);
    this.canvas.height = Math.round(this.H * this.dpr);
  };

  DotMatrix.prototype.loop = function () {
    var self = this;
    if (!this.canvas.isConnected || !this.visible) { this.raf = null; return; }
    var t = (performance.now() - this.t0) / 1000;
    // dt is clamped so the rotation doesn't jump after the offscreen pause.
    var dt = Math.min(0.05, t - this.lastT);
    this.lastT = t;
    if (SETTINGS.autoRotate) this.yaw += SETTINGS.rotSpeed * dt;
    this.renderFrame(t);
    this.raf = requestAnimationFrame(function () { self.loop(); });
  };

  DotMatrix.prototype.renderFrame = function (t) {
    var ctx = this.ctx;
    var W = this.W, H = this.H;
    var s = SETTINGS;

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = this.bg;
    ctx.fillRect(0, 0, W, H);

    var dot = this.dotRgb;
    var sp = s.spacing;
    var R = s.radius;

    // Mouse position relative to this canvas.
    var rect = this.canvas.getBoundingClientRect();
    var mx = this.mouse.x - rect.left;
    var my = this.mouse.y - rect.top;
    var active = this.mouse.active;

    // Sheet in the XY plane facing the camera; the scan wave pushes dots
    // toward the camera (+Z) as the crest passes.
    var spanX = W * 1.35;
    var spanY = H * 1.35;
    var cols = Math.ceil(spanX / sp);
    var rows = Math.ceil(spanY / sp);
    var halfX = (cols * sp) / 2;
    var halfY = (rows * sp) / 2;

    var ax = s.tilt * Math.PI / 180;
    var cosX = Math.cos(ax), sinX = Math.sin(ax);
    var ay = this.yaw;
    var cosY = Math.cos(ay), sinY = Math.sin(ay);

    var focal = s.perspective;
    var camDist = focal * 1.6;
    var cx = W / 2, cy = H / 2;

    // The scan crest travels across the sheet and off the edge; a new crest
    // enters seamlessly from the other side. Margin lets the wake fully exit.
    var scanW = s.scanWidth;
    var margin = scanW * 3;
    var period = 2 * halfX + 2 * margin;
    var scanPos = ((t * s.scanSpeed * halfX) % period + period) % period - (halfX + margin);

    for (var iy = 0; iy < rows; iy++) {
      var wy = iy * sp - halfY;
      for (var ix = 0; ix < cols; ix++) {
        var wx = ix * sp - halfX;

        // Sum nearby crest copies so the wave wraps around the loop cleanly.
        var wave = 0, wz = 0;
        for (var k = -1; k <= 1; k++) {
          var cp = scanPos + k * period;
          var sd = (wx - cp) / scanW;
          var crest = Math.exp(-sd * sd);
          if (crest > wave) wave = crest;
          wz += crest * s.scanHeight;
          // Wake behind the crest: dots spring back and wobble to rest.
          if (sd < 0) {
            var b = -sd;
            wz += Math.sin(b * 3.0) * Math.exp(-b * 0.6) * s.scanHeight * 0.35 * (1 - crest);
          }
        }
        if (s.drift > 0) {
          wz += Math.sin(wy * 0.01 + t * s.waveSpeed) * s.drift;
        }

        // Yaw about the vertical axis, pitch about the horizontal axis,
        // then perspective-project.
        var X = wx * cosY + wz * sinY;
        var Z = -wx * sinY + wz * cosY;
        var Y = wy * cosX - Z * sinX;
        Z = wy * sinX + Z * cosX;

        var denom = camDist - Z;
        if (denom <= 1) continue;
        var persp = focal / denom;
        var px = cx + X * persp;
        var py = cy - Y * persp;
        if (px < -20 || px > W + 20 || py < -20 || py > H + 20) continue;

        var size = Math.max(0.6, s.baseSize * persp);
        // Brighter and slightly bigger right on the scan line.
        var alpha = 0.34 + 0.55 * wave;
        size += (s.maxSize - s.baseSize) * wave * 0.6 * persp;

        // Cursor falloff in screen space.
        if (active) {
          var ddx = px - mx, ddy = py - my;
          var d2 = ddx * ddx + ddy * ddy;
          if (d2 < R * R) {
            var f = 1 - Math.sqrt(d2) / R;
            var e = f * f * (3 - 2 * f);
            size += (s.maxSize - s.baseSize) * e * persp;
            alpha = alpha + (1 - alpha) * e;
          }
        }

        if (size < 0.2) continue;
        if (alpha > 1) alpha = 1;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + dot[0] + ',' + dot[1] + ',' + dot[2] + ',' + alpha + ')';
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  function init() {
    var sections = document.querySelectorAll('.hero, .projects-page-header');
    var instances = [];
    for (var i = 0; i < sections.length; i++) {
      instances.push(new DotMatrix(sections[i]));
    }

    // Re-read colors when the theme toggles.
    if (instances.length && typeof MutationObserver !== 'undefined') {
      new MutationObserver(function () {
        instances.forEach(function (inst) {
          inst.readColors();
          if (REDUCED_MOTION) inst.renderFrame(0);
        });
      }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
