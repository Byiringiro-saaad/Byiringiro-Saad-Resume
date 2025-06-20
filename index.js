// Loading screen
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loading").classList.add("fade-out");
    setTimeout(() => {
      document.getElementById("loading").style.display = "none";
    }, 500);
  }, 800);
});

// Custom minimal cursor
const cursor = document.getElementById("cursor");
const cursorRing = document.getElementById("cursor-ring");

let mouseX = 0,
  mouseY = 0;
let ringX = 0,
  ringY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;

  cursorRing.style.left = ringX + "px";
  cursorRing.style.top = ringY + "px";

  requestAnimationFrame(animateRing);
}
animateRing();

// Cursor hover effects
document.addEventListener("mouseenter", (e) => {
  if (e.target.matches("a, button, .btn, .project-card, .timeline-content")) {
    cursor.style.transform = "scale(1.5)";
    cursorRing.style.transform = "scale(1.5)";
    cursorRing.style.opacity = "0.6";
  }
});

document.addEventListener("mouseleave", (e) => {
  if (e.target.matches("a, button, .btn, .project-card, .timeline-content")) {
    cursor.style.transform = "scale(1)";
    cursorRing.style.transform = "scale(1)";
    cursorRing.style.opacity = "0.3";
  }
});

// Smooth scrolling navigation
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    targetSection.scrollIntoView({
      behavior: "smooth",
    });

    // Update active nav link
    document.querySelectorAll(".nav-link").forEach((navLink) => {
      navLink.classList.remove("active");
    });
    link.classList.add("active");
  });
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains("fade-in")) {
        entry.target.classList.add("animate");
      } else if (entry.target.classList.contains("skill-item")) {
        setTimeout(() => {
          entry.target.classList.add("animate");
        }, Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100);
      } else if (entry.target.classList.contains("project-card")) {
        setTimeout(() => {
          entry.target.classList.add("animate");
        }, Array.from(entry.target.parentNode.children).indexOf(entry.target) * 150);
      } else if (entry.target.classList.contains("timeline-item")) {
        setTimeout(() => {
          entry.target.classList.add("animate");
        }, Array.from(entry.target.parentNode.children).indexOf(entry.target) * 200);
      }
    }
  });
}, observerOptions);

// Observe elements for animation
document
  .querySelectorAll(".fade-in, .skill-item, .project-card, .timeline-item")
  .forEach((el) => {
    observer.observe(el);
  });

// Active section highlighting
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentSection = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
          }
        });
      }
    });
  },
  {
    threshold: 0.3,
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

// Form validation and submission
const contactForm = document.getElementById("contact-form");
const formInputs = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  subject: document.getElementById("subject"),
  message: document.getElementById("message"),
};

const formErrors = {
  name: document.getElementById("name-error"),
  email: document.getElementById("email-error"),
  subject: document.getElementById("subject-error"),
  message: document.getElementById("message-error"),
};

// Real-time validation
Object.keys(formInputs).forEach((key) => {
  const input = formInputs[key];
  const error = formErrors[key];

  input.addEventListener("blur", () => validateField(key));
  input.addEventListener("input", () => {
    if (error.style.display === "block") {
      validateField(key);
    }
  });
});

function validateField(fieldName) {
  const input = formInputs[fieldName];
  const error = formErrors[fieldName];
  let isValid = true;

  // Reset styles
  input.style.borderColor = "var(--gray-300)";
  error.style.display = "none";

  // Validation logic
  if (!input.value.trim()) {
    showError(input, error, `Please enter your ${fieldName}`);
    isValid = false;
  } else if (fieldName === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value)) {
      showError(input, error, "Please enter a valid email address");
      isValid = false;
    }
  } else if (fieldName === "message" && input.value.trim().length < 10) {
    showError(input, error, "Message must be at least 10 characters long");
    isValid = false;
  }

  return isValid;
}

function showError(input, error, message) {
  input.style.borderColor = "#ef4444";
  error.textContent = message;
  error.style.display = "block";
}

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let isFormValid = true;
  Object.keys(formInputs).forEach((key) => {
    if (!validateField(key)) {
      isFormValid = false;
    }
  });

  if (isFormValid) {
    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.7";

    setTimeout(() => {
      alert(
        "Awesome! Your message has been sent. I'll get back to you faster than you can say 'responsive design' ⚡"
      );
      contactForm.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
    }, 2000);
  }
});

// Parallax effect for hero section
let ticking = false;

function updateParallax() {
  const scrolled = window.pageYOffset;
  const heroImage = document.querySelector(".hero-image");

  if (heroImage && scrolled < window.innerHeight) {
    heroImage.style.transform = `translateY(${scrolled * 0.3}px) rotate(${
      scrolled * 0.1
    }deg)`;
  }

  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
});

// Add subtle hover animations to nav links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("mouseenter", () => {
    link.style.transform = "translateY(-2px)";
  });

  link.addEventListener("mouseleave", () => {
    link.style.transform = "translateY(0)";
  });
});

// Add magnetic effect to buttons
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform = `translate(${x * 0.1}px, ${
      y * 0.1
    }px) translateY(-2px)`;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0, 0)";
  });
});

// Dynamic text animation for hero title
function animateText() {
  const title = document.querySelector(".hero-content h1");
  if (title) {
    const text = title.textContent;
    title.innerHTML = "";

    [...text].forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.opacity = "0";
      span.style.transform = "translateY(20px)";
      span.style.display = "inline-block";
      span.style.transition = "all 0.3s ease";
      span.style.transitionDelay = `${0.02 * i}s`;
      title.appendChild(span);

      setTimeout(() => {
        span.style.opacity = "1";
        span.style.transform = "translateY(0)";
      }, 200 + i * 20);
    });
  }
}

// Initialize text animation after loading
setTimeout(animateText, 1000);

// Add smooth reveal for project cards with stagger
function revealProjects() {
  const projects = document.querySelectorAll(".project-card");
  projects.forEach((project, index) => {
    setTimeout(() => {
      project.style.opacity = "1";
      project.style.transform = "translateY(0)";
    }, index * 200);
  });
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    const sections = Array.from(document.querySelectorAll(".section"));
    const currentSection = sections.find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 100 && rect.bottom > 100;
    });

    if (currentSection) {
      const currentIndex = sections.indexOf(currentSection);
      let targetIndex;

      if (e.key === "ArrowDown") {
        targetIndex = Math.min(currentIndex + 1, sections.length - 1);
      } else {
        targetIndex = Math.max(currentIndex - 1, 0);
      }

      sections[targetIndex].scrollIntoView({ behavior: "smooth" });
    }
  }
});

// Add scroll progress indicator
function createScrollProgress() {
  const progressBar = document.createElement("div");
  progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 2px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const scrolled =
      (window.pageYOffset /
        (document.documentElement.scrollHeight - window.innerHeight)) *
      100;
    progressBar.style.width = scrolled + "%";
  });
}
createScrollProgress();

// Performance optimization
const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
if (mediaQuery.matches) {
  // Disable animations for users who prefer reduced motion
  document.documentElement.style.setProperty("--animation-duration", "0s");
}

// Add easter egg - Click logo 5 times
let logoClicks = 0;
document.querySelector(".logo").addEventListener("click", (e) => {
  e.preventDefault();
  logoClicks++;

  if (logoClicks === 5) {
    document.body.style.animation = "hue-rotate 2s infinite linear";
    setTimeout(() => {
      document.body.style.animation = "";
      logoClicks = 0;
    }, 3000);
  }
});

// Add hue-rotate animation
const easterEggStyle = document.createElement("style");
easterEggStyle.textContent = `
        @keyframes hue-rotate {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
document.head.appendChild(easterEggStyle);
