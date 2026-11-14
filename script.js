
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
    ".contact-details, .contact-form-wrap, .statement-content, " +
    ".showcase-header, .subgroup-header, .diagram-card, .diagram-center, " +
    ".product-rich-card, .spec-table-wrap, .tree-product-header, " +
    ".tree-spec-card, .tree-center-visual, .category-divider, " +
    ".subfleet-header"
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

  // Catalog sticky navigation active pill highlight on scroll
  const catalogPills = document.querySelectorAll(".catalog-pill");
  const trackedSections = Array.from(catalogPills)
    .map(pill => {
      const href = pill.getAttribute("href");
      return href && href.startsWith("#") ? document.getElementById(href.slice(1)) : null;
    })
    .filter(Boolean);

  if (catalogPills.length && trackedSections.length) {
    function updateActiveCatalogPill() {
      const scrollPosition = window.scrollY + 140;
      let activeId = "";

      for (let i = 0; i < trackedSections.length; i++) {
        const sec = trackedSections[i];
        if (sec.offsetTop <= scrollPosition) {
          activeId = sec.id;
        }
      }

      catalogPills.forEach(pill => {
        const targetHref = pill.getAttribute("href");
        if (targetHref === `#${activeId}`) {
          pill.classList.add("active");
        } else {
          pill.classList.remove("active");
        }
      });
    }

    window.addEventListener("scroll", updateActiveCatalogPill, { passive: true });
    updateActiveCatalogPill();

    // Smooth scroll offset adjustment for sticky navigation bar
    catalogPills.forEach(pill => {
      pill.addEventListener("click", e => {
        const href = pill.getAttribute("href");
        if (href && href.startsWith("#")) {
          const target = document.getElementById(href.slice(1));
          if (target) {
            e.preventDefault();
            const navBar = document.querySelector(".catalog-nav");
            const navHeight = navBar ? navBar.offsetHeight : 60;
            const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
            window.scrollTo({ top: targetPos, behavior: "smooth" });
          }
        }
      });
    });
  }

  // Mobile touch interaction for tree diagram specification cards
  const treeCards = document.querySelectorAll(".tree-spec-card");
  treeCards.forEach(card => {
    card.addEventListener("click", () => {
      const parentWrap = card.closest(".tree-diagram-wrap");
      const wasActive = card.classList.contains("is-active");

      if (parentWrap) {
        parentWrap.querySelectorAll(".tree-spec-card").forEach(c => c.classList.remove("is-active"));
      }

      if (!wasActive) {
        card.classList.add("is-active");
      }
    });
  });

  // ==========================================
  // Product Tree Media Carousel (Images + Videos Loop)
  // ==========================================
  const carousels = document.querySelectorAll("[data-carousel]");

  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll(".carousel-slide");
    const prevBtn = carousel.querySelector(".carousel-btn.prev");
    const nextBtn = carousel.querySelector(".carousel-btn.next");
    const dotsContainer = carousel.querySelector(".carousel-dots");

    // Single media fallback: if only 1 slide, render as static image or single looping video
    if (slides.length <= 1) {
      carousel.classList.add("has-single-media");
      if (slides.length === 1) {
        slides[0].classList.add("active");
        const singleVid = slides[0].querySelector("video");
        if (singleVid) {
          singleVid.muted = true;
          singleVid.playsInline = true;
          singleVid.loop = true;
          singleVid.setAttribute("playsinline", "");
          singleVid.setAttribute("muted", "");
          singleVid.setAttribute("autoplay", "");
          if (singleVid.readyState === 0) singleVid.load();
          singleVid.play().catch(e => console.warn("Single video play error:", e));
        }
      }
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
      if (dotsContainer) dotsContainer.style.display = "none";
      return;
    }

    carousel.classList.remove("has-single-media");
    let currentIndex = 0;
    let slideTimer = null;
    let activeVideoHandler = null;

    // Dynamically build pagination dots
    if (dotsContainer) {
      dotsContainer.innerHTML = "";
      slides.forEach((_, idx) => {
        const dot = document.createElement("button");
        dot.className = `carousel-dot${idx === 0 ? " active" : ""}`;
        dot.setAttribute("type", "button");
        dot.setAttribute("aria-label", `Slide ${idx + 1}`);
        dot.addEventListener("click", e => {
          e.stopPropagation();
          goToSlide(idx);
        });
        dotsContainer.appendChild(dot);
      });
    }

    function clearTimers() {
      if (slideTimer) {
        clearTimeout(slideTimer);
        slideTimer = null;
      }
      const curSlide = slides[currentIndex];
      if (curSlide) {
        const vid = curSlide.querySelector("video");
        if (vid && activeVideoHandler) {
          vid.removeEventListener("ended", activeVideoHandler);
          activeVideoHandler = null;
        }
      }
    }

    function goToSlide(targetIndex) {
      clearTimers();

      // Pause and rewind current slide video if leaving it
      const prevSlide = slides[currentIndex];
      if (prevSlide) {
        prevSlide.classList.remove("active");
        const prevVideo = prevSlide.querySelector("video");
        if (prevVideo) {
          try {
            prevVideo.pause();
            prevVideo.currentTime = 0;
          } catch (err) {
            /* ignore */
          }
        }
      }

      // Wrap target index safely
      currentIndex = (targetIndex + slides.length) % slides.length;
      const nextSlide = slides[currentIndex];
      nextSlide.classList.add("active");

      // Update active dot
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll(".carousel-dot");
        dots.forEach((dot, dIdx) => {
          dot.classList.toggle("active", dIdx === currentIndex);
        });
      }

      // Check media type of the newly activated slide
      const video = nextSlide.querySelector("video");
      if (video) {
        // VIDEO SLIDE: Autoplay muted and listen for completion
        video.muted = true;
        video.playsInline = true;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        if (video.readyState === 0) {
          video.load();
        }
        video.currentTime = 0;

        activeVideoHandler = () => {
          const isFs = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
          if (isFs) {
            if (document.exitFullscreen) {
              document.exitFullscreen().catch(() => {});
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            }
          }
          goToSlide(currentIndex + 1);
        };
        video.addEventListener("ended", activeVideoHandler, { once: true });

        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.warn("Autoplay promise rejected:", err);
            // Autoplay safety fallback if browser restricts
            slideTimer = setTimeout(() => {
              const isFs = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
              if (!isFs) {
                goToSlide(currentIndex + 1);
              }
            }, 6000);
          });
        }
      } else {
        // IMAGE SLIDE: Display for designated duration (default 4000ms) then advance
        const duration = parseInt(nextSlide.dataset.duration || "4000", 10);
        slideTimer = setTimeout(() => {
          goToSlide(currentIndex + 1);
        }, duration);
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", e => {
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", e => {
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    // Start with the first slide
    goToSlide(0);
  });

  // ==========================================
  // Cinematic Fullscreen Product Media Lightbox
  // ==========================================
  const lightbox = document.getElementById("productLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxVideo = document.getElementById("lightboxVideo");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxFsToggle = document.getElementById("lightboxFsToggle");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let currentCarousel = null;
  let currentCarouselSlides = [];
  let currentSlideIndex = 0;

  function updateLightboxMedia() {
    if (!currentCarouselSlides.length) return;
    const slide = currentCarouselSlides[currentSlideIndex];
    if (!slide) return;

    // Update Counter
    if (lightboxCounter) {
      lightboxCounter.textContent = `Slide ${currentSlideIndex + 1} of ${currentCarouselSlides.length}`;
    }

    // Toggle Prev/Next in Lightbox
    if (lightboxPrev && lightboxNext) {
      const showNav = currentCarouselSlides.length > 1;
      lightboxPrev.style.display = showNav ? "flex" : "none";
      lightboxNext.style.display = showNav ? "flex" : "none";
    }

    const vid = slide.querySelector("video");
    const img = slide.querySelector("img");

    if (vid) {
      // Show Video in Fullscreen Lightbox
      if (lightboxImg) lightboxImg.style.display = "none";
      if (lightboxVideo) {
        lightboxVideo.style.display = "block";
        const src = vid.currentSrc || vid.src || (vid.querySelector("source") ? vid.querySelector("source").src : "");
        if (lightboxVideo.src !== src) {
          lightboxVideo.src = src;
        }
        lightboxVideo.muted = false;
        lightboxVideo.controls = true;
        lightboxVideo.currentTime = vid.currentTime || 0;
        lightboxVideo.play().catch(() => {});
      }
    } else if (img) {
      // Show Image in Fullscreen Lightbox
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.style.display = "none";
      }
      if (lightboxImg) {
        lightboxImg.style.display = "block";
        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt || "Product Fullscreen View";
      }
    }
  }

  function openLightbox(carouselEl, initialSlideIndex = 0) {
    if (!lightbox) return;
    currentCarousel = carouselEl;
    currentCarouselSlides = Array.from(carouselEl.querySelectorAll(".carousel-slide"));
    currentSlideIndex = initialSlideIndex >= 0 ? initialSlideIndex : 0;

    // Get product title
    const block = carouselEl.closest(".tree-product-block");
    const titleEl = block ? block.querySelector(".tree-product-title") : null;
    if (lightboxTitle && titleEl) {
      lightboxTitle.textContent = titleEl.textContent.trim();
    }

    // Pause any playing videos in the background carousel
    currentCarouselSlides.forEach(s => {
      const v = s.querySelector("video");
      if (v) v.pause();
    });

    updateLightboxMedia();

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    if (!lightbox) return;
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.currentTime = 0;
    }
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    // Exit browser fullscreen if it was toggled via lightbox
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }

    // Resume background carousel
    if (currentCarousel) {
      const activeSlide = currentCarousel.querySelectorAll(".carousel-slide")[currentSlideIndex];
      if (activeSlide) {
        const vid = activeSlide.querySelector("video");
        if (vid) {
          vid.muted = true;
          vid.play().catch(() => {});
        }
      }
    }
  }

  // Click ANYWHERE on the image container / carousel to view in full screen
  document.querySelectorAll(".tree-image-container").forEach(container => {
    container.addEventListener("click", e => {
      // Don't open if user clicked carousel navigation arrows or dots
      if (e.target.closest(".carousel-btn") || e.target.closest(".carousel-dots") || e.target.closest(".carousel-dot")) {
        return;
      }

      const carousel = container.querySelector("[data-carousel]") || container;
      const slides = carousel.querySelectorAll(".carousel-slide");
      let activeIndex = 0;
      slides.forEach((s, idx) => {
        if (s.classList.contains("active")) activeIndex = idx;
      });

      openLightbox(carousel, activeIndex);
    });
  });

  // Lightbox Close Events
  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", e => {
      // Click on background or empty padding closes lightbox
      if (e.target === lightbox || e.target.classList.contains("lightbox-content") || e.target.classList.contains("lightbox-media-wrapper")) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", e => {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      if (currentCarouselSlides.length > 1) {
        currentSlideIndex = (currentSlideIndex - 1 + currentCarouselSlides.length) % currentCarouselSlides.length;
        updateLightboxMedia();
      }
    } else if (e.key === "ArrowRight") {
      if (currentCarouselSlides.length > 1) {
        currentSlideIndex = (currentSlideIndex + 1) % currentCarouselSlides.length;
        updateLightboxMedia();
      }
    }
  });

  // Lightbox Next/Prev Buttons
  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", e => {
      e.stopPropagation();
      if (currentCarouselSlides.length > 1) {
        currentSlideIndex = (currentSlideIndex - 1 + currentCarouselSlides.length) % currentCarouselSlides.length;
        updateLightboxMedia();
      }
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", e => {
      e.stopPropagation();
      if (currentCarouselSlides.length > 1) {
        currentSlideIndex = (currentSlideIndex + 1) % currentCarouselSlides.length;
        updateLightboxMedia();
      }
    });
  }

  // Toggle Browser Fullscreen Button inside Lightbox
  if (lightboxFsToggle) {
    lightboxFsToggle.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      }
    });
  }

});
