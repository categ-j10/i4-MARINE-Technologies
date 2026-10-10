
document.addEventListener("DOMContentLoaded", () => {

  // Update copyright year automatically
  document.querySelectorAll("[data-year]").forEach(element => {
    element.textContent = new Date().getFullYear();
  });

  // Mobile navigation
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");

  if (menuButton && navigation) {
    function closeMenu() {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("open");
      document.body.classList.remove("menu-open");
    }

    menuButton.addEventListener("click", () => {
      const isOpening =
        menuButton.getAttribute("aria-expanded") !== "true";

      menuButton.setAttribute("aria-expanded", String(isOpening));
      menuButton.setAttribute(
        "aria-label",
        isOpening ? "Close navigation" : "Open navigation"
      );

      navigation.classList.toggle("open", isOpening);
      document.body.classList.toggle("menu-open", isOpening);
    });

    navigation.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
  }

  // Scroll reveal animations
  const animatedElements = document.querySelectorAll(
    ".section-kicker, .intro-layout, .metrics, " +
    ".feature-panel, .program-row, .programs-heading, " +
    ".about-big-grid, .values-content, .expertise-card, " +
    ".support-section h2, .support-copy, .support-note, " +
    ".product-feature-grid, .capability-card, " +
    ".contact-details, .contact-form-wrap, .statement-content"
  );

  animatedElements.forEach(element => {
    element.classList.add("reveal");
  });

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    });

    animatedElements.forEach(element => observer.observe(element));
  } else {
    animatedElements.forEach(element => {
      element.classList.add("is-visible");
    });
  }

  // Contact form: prepare an email for the visitor
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const formData = new FormData(contactForm);

      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const interest = String(formData.get("interest") || "").trim();
      const message = String(formData.get("message") || "").trim();

      const subject = encodeURIComponent(
        `Website enquiry from ${name}` +
        (interest ? ` - ${interest}` : "")
      );

      const body = encodeURIComponent(
        `Hello i4-Marine Technologies,\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone || "Not provided"}\n` +
        `Area of interest: ${interest || "Not specified"}\n\n` +
        `Project details:\n${message}\n\n` +
        `Sent from the i4-Marine Technologies website.`
      );

      const status = contactForm.querySelector(".form-status");

      if (status) {
        status.textContent =
          "Opening your email application. Please review the enquiry and press Send.";
      }

      window.location.href =
        `mailto:contact@i4-marine.com?subject=${subject}&body=${body}`;
    });
  }

});
