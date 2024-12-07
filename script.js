'use strict';

////// Elements selection
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnLearnMore = document.querySelector('.btn--scroll-to');
const sectionOne = document.querySelector('#section--1');
const sectionAll = document.querySelectorAll('.section');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const lazyImages = document.querySelectorAll('img[data-src]');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const slides = document.querySelectorAll('.slide');

////// Helper functions
function openModal() {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
}

////// Event listeners
// Open account modal
btnsOpenModal.forEach(element => element.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Learn more button
btnLearnMore.addEventListener('click', function () {
  sectionOne.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const sectionId = e.target.getAttribute('href');
    document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // Guard clause
  if (!clicked) return;
  // Active tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  // Activate content area
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
function navOpacity(e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
    siblings.forEach(function (element) {
      if (element !== e.target) {
        element.style.opacity = opacity;
      }
    });
  }
}
nav.addEventListener('mouseover', e => navOpacity(e, 0.5));
nav.addEventListener('mouseout', e => navOpacity(e, 1));

// Sticky navigation
const navHeight = nav.getBoundingClientRect().height;
function stickyNav(entries) {
  const [headerEntry] = entries;
  if (!headerEntry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Revealing elements on scroll
function revealSection(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  sectionObserver.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sectionAll.forEach(function (section) {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Lazy loading images
function loadImages(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  // Wait for image to load before removing filter
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );
  imgObserver.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // To load the image without the user noticing
});

lazyImages.forEach(element => imgObserver.observe(element));

// Slider component
const maxSlides = 3;
let curSlide = 0;

function goToSlide(s = 0) {
  slides.forEach(
    (slide, i) => (slide.style.transform = `translateX(${100 * (i - s)}%)`)
  );
}

function nextSlide() {
  if (curSlide === maxSlides - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
}

function prevSlide() {
  if (curSlide === 0) {
    curSlide = maxSlides - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
}

goToSlide(0);

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
