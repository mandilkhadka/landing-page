window.addEventListener('DOMContentLoaded', () => {
  console.log('script.js loaded');

  // Only handle one particular tablist; if you have multiple tab
  // lists (might even be nested), you have to apply this code for each one
  const tabList = document.querySelector('[role="tablist"]');
  const tabs = tabList.querySelectorAll(':scope > [role="tab"]');

  // Add a click event handler to each tab
  tabs.forEach((tab) => {
    tab.addEventListener('click', changeTabs);
  });

  // Enable arrow navigation between tabs in the tab list
  let tabFocus = 0;

  tabList.addEventListener('keydown', (e) => {
    // Move right
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      tabs[tabFocus].setAttribute('tabindex', -1);
      if (e.key === 'ArrowRight') {
        tabFocus++;
        // If we're at the end, go to the start
        if (tabFocus >= tabs.length) {
          tabFocus = 0;
        }
        // Move left
      } else if (e.key === 'ArrowLeft') {
        tabFocus--;
        // If we're at the start, move to the end
        if (tabFocus < 0) {
          tabFocus = tabs.length - 1;
        }
      }

      tabs[tabFocus].setAttribute('tabindex', 0);
      tabs[tabFocus].focus();
    }
  });
});

function changeTabs(e) {
  const targetTab = e.target;
  const tabList = targetTab.parentNode;
  const tabGroup = tabList.parentNode;

  // Remove all current selected tabs
  tabList.querySelectorAll(':scope > [aria-selected="true"]').forEach((t) => t.setAttribute('aria-selected', false));

  // Set this tab as selected
  targetTab.setAttribute('aria-selected', true);

  // Hide all tab panels
  tabGroup.querySelectorAll(':scope > [role="tabpanel"]').forEach((p) => p.setAttribute('hidden', true));

  // Show the selected panel
  tabGroup.querySelector(`#${targetTab.getAttribute('aria-controls')}`).removeAttribute('hidden');
}

// scroll function
function scrollImages(button, direction) {
  // Find the nearest .image-scroll-horizontal section
  const container = button.closest('.image-scroll-horizontal').querySelector('.image-row');
  const scrollAmount = container.clientWidth * 0.8;

  if (direction === 'left') {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}


// Language toggle script (reads data-en / data-ja and data-aria-en / data-aria-ja)
(function () {
  let currentLang = 'en';

  // helper: set element content (preserve icons with innerHTML)
  function setElementLang(el, lang) {
    const htmlAttr = 'data-' + lang;
    if (el.hasAttribute(htmlAttr)) {
      el.innerHTML = el.getAttribute(htmlAttr);
    }
  }

  // update aria attributes if present
  function setAriaLang(el, lang) {
    const ariaAttr = 'data-aria-' + lang;
    if (el.hasAttribute(ariaAttr) && el.hasAttribute('aria-label')) {
      el.setAttribute('aria-label', el.getAttribute(ariaAttr));
    }
  }

  // initialize page language
  function initializeLanguage() {
    document.documentElement.lang = currentLang;

    const titleEl = document.querySelector('title');
    if (titleEl && titleEl.hasAttribute('data-en')) {
      titleEl.textContent = titleEl.getAttribute('data-en');
    }

    document.querySelectorAll('[data-en]').forEach(el => setElementLang(el, 'en'));
    document.querySelectorAll('[data-aria-en]').forEach(el => setAriaLang(el, 'en'));
  }

  // toggle language
  function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ja' : 'en';
    document.documentElement.lang = currentLang;

    const titleEl = document.querySelector('title');
    if (titleEl && titleEl.hasAttribute('data-' + currentLang)) {
      titleEl.textContent = titleEl.getAttribute('data-' + currentLang);
    }

    document.querySelectorAll('[data-en]').forEach(el => setElementLang(el, currentLang));
    document.querySelectorAll('[data-aria-en]').forEach(el => setAriaLang(el, currentLang));
  }

  document.addEventListener('DOMContentLoaded', function () {
    initializeLanguage();

    const btn = document.getElementById('lang-toggle');
    if (btn) {
      // always show toggle as "EN / 日本語" initially
      btn.innerHTML = 'EN / 日本語';

      btn.addEventListener('click', function () {
        toggleLanguage();
        // Update button label to reflect current language
        btn.innerHTML = currentLang === 'en' ?  'EN / 日本語' : '日本語 / EN';
      });
    }
  });
})();
