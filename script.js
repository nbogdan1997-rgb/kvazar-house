'use strict';

// ============================================================
// 1. МОБИЛЬНОЕ МЕНЮ (ГАМБУРГЕР)
// ============================================================

const burger = document.getElementById('burger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

function toggleMenu() {
  burger.classList.toggle('active');
  navMenu.classList.toggle('open');
  document.body.classList.toggle('no-scroll');
}

function closeMenu() {
  burger.classList.remove('active');
  navMenu.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

burger.addEventListener('click', toggleMenu);

// Закрыть меню при клике на ссылку
navLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Закрыть меню при клике вне его
document.addEventListener('click', function (e) {
  if (!burger.contains(e.target) && !navMenu.contains(e.target)) {
    closeMenu();
  }
});

// ============================================================
// 2. ПЛАВНАЯ ПРОКРУТКА К БЛОКАМ
// ============================================================

const scrollLinks = document.querySelectorAll('a[href^="#"]');

scrollLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================================
// 3. ФИКСИРОВАННАЯ ШАПКА ПРИ СКРОЛЛЕ
// ============================================================

const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', function () {
  const currentScroll = window.pageYOffset;

  // Добавляем/убираем тень
  if (currentScroll > 50) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }

  lastScroll = currentScroll;
});

// ============================================================
// 4. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
// ============================================================

const animItems = document.querySelectorAll('[data-anim]');

function isElementInViewport(el, offset = 100) {
  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top <= windowHeight - offset;
}

function handleScrollAnimation() {
  animItems.forEach(item => {
    if (isElementInViewport(item)) {
      item.classList.add('visible');
    }
  });
}

// Проверяем сразу при загрузке
window.addEventListener('load', handleScrollAnimation);
window.addEventListener('scroll', handleScrollAnimation);

// ============================================================
// 5. ВАЛИДАЦИЯ ФОРМЫ ЗАЯВКИ
// ============================================================

const forms = document.querySelectorAll('form');

forms.forEach(form => {
  const nameInput = form.querySelector('input[type="text"]');
  const phoneInput = form.querySelector('input[type="tel"]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const formSuccess = form.querySelector('.form-success');

  // Находим все поля с ошибками внутри формы
  const nameError = form.querySelector('.error-name');
  const phoneError = form.querySelector('.error-phone');

  function validateName(value) {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      return 'Имя должно содержать минимум 2 символа';
    }
    if (!/^[а-яА-ЯёЁa-zA-Z\s\-]+$/.test(trimmed)) {
      return 'Имя может содержать только буквы, пробел и дефис';
    }
    return '';
  }

  function validatePhone(value) {
    const cleaned = value.replace(/[\s\-\(\)]/g, '');
    if (cleaned.length < 10) {
      return 'Введите номер телефона полностью';
    }
    if (!/^(\+7|8|7)?\d{10,11}$/.test(cleaned)) {
      return 'Некорректный формат номера';
    }
    return '';
  }

  // Очищаем ошибки при вводе
  if (nameInput) {
    nameInput.addEventListener('input', function () {
      const err = validateName(this.value);
      if (nameError) {
        nameError.textContent = '';
        nameError.style.display = 'none';
      }
    });
  }

  if (phoneInput) {
    // Маска для телефона: +7 (XXX) XXX-XX-XX
    phoneInput.addEventListener('input', function () {
      let value = this.value.replace(/\D/g, '');
      if (value.length === 0) {
        this.value = '';
        return;
      }
      if (value[0] === '7' || value[0] === '8') {
        value = value.substring(1);
      }
      let formatted = '+7';
      if (value.length > 0) {
        formatted += ' (' + value.substring(0, 3);
      }
      if (value.length >= 4) {
        formatted += ') ' + value.substring(3, 6);
      }
      if (value.length >= 7) {
        formatted += '-' + value.substring(6, 8);
      }
      if (value.length >= 9) {
        formatted += '-' + value.substring(8, 10);
      }
      this.value = formatted;

      if (phoneError) {
        phoneError.textContent = '';
        phoneError.style.display = 'none';
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', function (e) {
      e.preventDefault();

      let hasError = false;

      // Валидация имени
      if (nameInput) {
        const nameErr = validateName(nameInput.value);
        if (nameErr) {
          hasError = true;
          if (nameError) {
            nameError.textContent = nameErr;
            nameError.style.display = 'block';
          }
        }
      }

      // Валидация телефона
      if (phoneInput) {
        const phoneErr = validatePhone(phoneInput.value);
        if (phoneErr) {
          hasError = true;
          if (phoneError) {
            phoneError.textContent = phoneErr;
            phoneError.style.display = 'block';
          }
        }
      }

      if (hasError) return;

      // Успешная отправка
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Здесь можно отправить данные на сервер
      console.log('Данные формы:', data);

      // Показываем сообщение об успехе
      if (formSuccess) {
        formSuccess.style.display = 'block';
        formSuccess.classList.add('form-success--visible');
      }

      // Сбрасываем форму
      form.reset();

      // Скрываем сообщение через 5 секунд
      setTimeout(() => {
        if (formSuccess) {
          formSuccess.style.display = 'none';
          formSuccess.classList.remove('form-success--visible');
        }
      }, 5000);
    });
  }
});

// ============================================================
// 6. СЧЁТЧИК ЦИФР (АНИМАЦИЯ СТАТИСТИКИ)
// ============================================================

function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

// Запускаем анимацию при появлении блока со статистикой
const statsSection = document.querySelector('.stats');
const counters = document.querySelectorAll('.stat-number');

if (statsSection && counters.length > 0) {
  let countersAnimated = false;

  function checkCounters() {
    if (!countersAnimated && isElementInViewport(statsSection, 150)) {
      countersAnimated = true;
      const targets = [];
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        targets.push(target);
        animateCounter(counter, target);
      });
    }
  }

  window.addEventListener('load', checkCounters);
  window.addEventListener('scroll', checkCounters);
}

// ============================================================
// 7. ТАБЫ В ПОРТФОЛИО / ПРОЕКТАХ (если есть)
// ============================================================

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (tabBtns.length > 0 && tabContents.length > 0) {
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const target = this.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('tab-btn--active'));
      this.classList.add('tab-btn--active');

      tabContents.forEach(content => {
        content.classList.remove('tab-content--active');
        if (content.getAttribute('data-content') === target) {
          content.classList.add('tab-content--active');
        }
      });
    });
  });
}

// ============================================================
// 8. ОБРАБОТКА КНОПОК "ПОЛУЧИТЬ РАСЧЁТ" И "ОСТАВИТЬ ЗАЯВКУ"
// ============================================================

const calcBtns = document.querySelectorAll('.scroll-to-form');
calcBtns.forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const formSection = document.getElementById('form');
    if (formSection) {
      const headerHeight = header.offsetHeight;
      const targetPosition = formSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================================
// 9. ОБРАБОТКА КЛИКА ПО КАРТОЧКАМ ПРОЕКТОВ (FAQ)
// ============================================================

const faqItems = document.querySelectorAll('.faq-item');
if (faqItems.length > 0) {
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('faq-item--open');

      // Закрываем все
      faqItems.forEach(el => {
        el.classList.remove('faq-item--open');
      });

      // Если был закрыт — открываем
      if (!isOpen) {
        item.classList.add('faq-item--open');
      }
    });
  });
}

// ============================================================
// 10. КНОПКА "НАВЕРХ"
// ============================================================

const scrollTopBtn = document.getElementById('scroll-top');

if (scrollTopBtn) {
  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 500) {
      scrollTopBtn.classList.add('scroll-top--visible');
    } else {
      scrollTopBtn.classList.remove('scroll-top--visible');
    }
  });

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

console.log('Сайт строительной компании «Квазар-Хаус» загружен и готов к работе!');
