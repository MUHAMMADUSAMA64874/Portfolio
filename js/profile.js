document.addEventListener('DOMContentLoaded', () => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!window.location.hash) window.scrollTo(0, 0);
  const track = document.querySelector('.logo-track');
  if (track) track.innerHTML += track.innerHTML;
  const companiesTrack = document.querySelector('.companies-track');
  if (companiesTrack) companiesTrack.innerHTML += companiesTrack.innerHTML;

  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .13 });
  reveals.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(element);
  });

  const modal = document.getElementById('contact-modal');
  const animationPanel = document.getElementById('channel-animation');
  let redirectTimer;
  const openModal = () => {
    window.clearTimeout(redirectTimer);
    animationPanel.className = 'channel-animation';
    animationPanel.innerHTML = '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  };
  const closeModal = () => {
    window.clearTimeout(redirectTimer);
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('[data-open-contact]').forEach(button => button.addEventListener('click', openModal));
  document.querySelectorAll('[data-close-contact]').forEach(button => button.addEventListener('click', closeModal));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

  const animateChannel = (channel) => {
    const icons = {
      whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2a9.84 9.84 0 0 0-8.43 14.91L2.05 22l5.2-1.51A9.95 9.95 0 1 0 12.04 2Zm0 17.9a8 8 0 0 1-4.08-1.12l-.29-.17-3.09.9.92-3-.19-.3a7.93 7.93 0 1 1 6.73 3.69Zm4.37-5.94c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.19-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"/></svg>',
      email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M2 5.5v13h4V9.4L12 14l6-4.6v9.1h4v-13l-10 7.6Z"/><path fill="#34A853" d="M2 5.5 6 8.6v9.9H2Z"/><path fill="#FBBC04" d="M22 5.5 18 8.6v9.9h4Z"/><path fill="#EA4335" d="M2 5.5V4.8C2 3.8 3.2 3.2 4 3.8l8 6.1 8-6.1c.8-.6 2 .0 2 1v.7l-10 7.6Z"/></svg>',
      phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.62 10.79a15.46 15.46 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02Z"/></svg>'
    };
    const content = {
      whatsapp: { logo: icons.whatsapp, title: 'Opening WhatsApp Web…', text: 'Preparing a quick hello for Muhammad.', url: 'https://web.whatsapp.com/send?phone=923207101485&text=Hi%20Muhammad%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.' },
      email: { logo: icons.email, title: 'Opening Gmail…', text: 'Getting a project email ready for you.', url: 'https://mail.google.com/mail/?view=cm&fs=1&to=tahir12721@gmail.com&su=Project%20inquiry%20from%20your%20portfolio' },
      phone: { logo: icons.phone, title: 'Plot twist! 😅', text: 'My phone number is also my WhatsApp number. I’m much faster there — tap WhatsApp instead!' }
    }[channel];
    animationPanel.className = `channel-animation active ${channel}`;
    animationPanel.innerHTML = `<div class="motion-logo">${content.logo}</div><h3>${content.title}</h3><p>${content.text}</p>${content.url ? '<div class="loader"></div>' : ''}`;
    if (content.url) {
      redirectTimer = window.setTimeout(() => window.location.href = content.url, 1900);
    } else {
      redirectTimer = window.setTimeout(closeModal, 2600);
    }
  };
  document.querySelectorAll('[data-channel]').forEach(button => {
    button.addEventListener('click', () => animateChannel(button.dataset.channel));
  });
});
