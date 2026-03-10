(function () {
  "use strict";

  // Mobile menu toggle
  var menuToggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("is-open");
      nav.classList.toggle("is-open", !isOpen);
      menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    });
  }

  // Smooth scroll for anchor links (already have scroll-behavior: smooth on html, this handles offset for fixed header)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = this.getAttribute("href");
      if (id === "#") return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (nav) nav.classList.remove("is-open");
      }
    });
  });

  // Join form submit (demo — no backend)
  var form = document.querySelector(".join-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var place = form.querySelector("#place");
      if (place && place.value.trim()) {
        alert("Thanks! We got your suggestion for \u201c" + place.value.trim() + "\u201d. The map is community-run — we\u2019ll add it soon.");
        form.reset();
      } else {
        alert("Please enter a place or neighborhood to add.");
      }
    });
  }
})();
