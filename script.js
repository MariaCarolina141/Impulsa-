/* =========================
   DEFAULT CONFIGURATION
========================= */
const defaultConfig = {
  background_color: '#ffffff',
  surface_color: '#f0f5fa',
  text_color: '#003B73',
  primary_action_color: '#22c55e',
  secondary_action_color: '#64748b',
  font_family: 'Plus Jakarta Sans',
  font_size: 16,
  hero_title: 'Impulso para o seu <span style="color: #22c55e;">negócio</span> crescer',
  hero_subtitle: 'Conectamos empreendedores a soluções, capacitação e tecnologia para fortalecer pequenos negócios em todo o Brasil.',
  services_title: 'Nossos Serviços',
  support_title: 'Estamos ao seu lado em cada passo',
  projects_title: 'Projetos Sociais',
  tech_title: 'Tecnologia & Inovação',
  cta_button_text: 'Comece Agora'
};

/* =========================
   MOBILE MENU
========================= */
let isMobileMenuOpen = false;
function toggleMobile() {
  const menu = document.getElementById("mobile-menu");
  if (!menu) return;
  if (menu.classList.contains("hidden")) {
    menu.classList.remove("hidden");
    menu.classList.remove("mobile-closing");
    menu.classList.add("mobile-opening");
    document.body.classList.add('mobile-menu-active');
    isMobileMenuOpen = true;
    setTimeout(() => menu.classList.remove('mobile-opening'), 280);
  } else {
    menu.classList.add("mobile-closing");
    menu.classList.remove("mobile-opening");
    setTimeout(() => {
      menu.classList.add("hidden");
      menu.classList.remove("mobile-closing");
      document.body.classList.remove('mobile-menu-active');
      isMobileMenuOpen = false;
    }, 260);
  }
}

function closeMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  if (!menu || menu.classList.contains("hidden")) return;
  menu.classList.add("mobile-closing");
  menu.classList.remove("mobile-opening");
  setTimeout(() => {
    menu.classList.add("hidden");
    menu.classList.remove("mobile-closing");
    document.body.classList.remove('mobile-menu-active');
    isMobileMenuOpen = false;
  }, 260);
}

/* =========================
   TOAST HELPERS
========================= */
function ensureToastContainer() {
  let c = document.getElementById('toast-container');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toast-container';
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  return c;
}

function showToast(type = 'info', title = '', message = '') {
  const container = ensureToastContainer();
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const content = document.createElement('div');
  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  const ttl = document.createElement('div');
  ttl.className = 'title';
  ttl.textContent = title;
  const msg = document.createElement('div');
  msg.className = 'message';
  msg.textContent = message;
  content.appendChild(ttl);
  content.appendChild(msg);
  t.appendChild(content);
  container.appendChild(t);
  // Force reflow for transition
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 4000);
}

/* =========================
   FORM HANDLERS
========================= */
function enviarFormulario(event) {
  event.preventDefault();
  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const nome = nomeInput ? nomeInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";

  if (!nome || !email) {
    showToast('error', 'Erro', 'Por favor, preencha nome e e-mail.');
    return;
  }

  // Optionally save cadastro to localStorage
  try {
    const users = JSON.parse(localStorage.getItem('impulsa_signups') || '[]');
    users.push({ nome, email, date: new Date().toISOString() });
    localStorage.setItem('impulsa_signups', JSON.stringify(users));
  } catch (e) {
    console.error('Erro ao salvar cadastro:', e);
  }

  showToast('success', 'Cadastro realizado', `Obrigado, ${nome}. Seu cadastro foi recebido.`);
}

function inscrever(curso) {
  showToast('success', 'Inscrição', `Inscrição confirmada: ${curso}`);
}

function renderAIAdvice(message) {
  const output = document.getElementById('ai-suggestion');
  if (output) output.textContent = message;
}

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/\n/g, '<br>');
}

/* =========================
   AI LOGIC
========================= */
function askAIFallback(question) {
  const q = question.toLowerCase();
  if (!q) return 'Por favor, escreva sua dúvida para receber orientação.';
  const answers = [
    { keywords: ['marketing', 'mídia', 'instagram', 'facebook', 'digital', 'campanha'], text: 'Comece definindo um público-alvo específico e teste mensagens diferentes. Use métricas para identificar o canal mais eficaz.' },
    { keywords: ['vendas', 'cliente', 'clientes'], text: 'Melhore o atendimento, ofereça condições claras e acompanhe o pós-venda. Clientes satisfeitos retornam e indicam sua marca.' },
    { keywords: ['financeiro', 'fluxo', 'caixa', 'gastos'], text: 'Organize receitas e despesas com regularidade. Separe investimento de custo e revise seu orçamento a cada semana.' },
    { keywords: ['produto', 'serviço', 'oferta'], text: 'Identifique o valor principal do seu produto e ajuste o preço conforme a percepção do cliente. Busque feedback direto.' },
    { keywords: ['crescer', 'escala', 'expandir'], text: 'Aumente a estrutura só depois de validar a oferta. Crescimento sustentável depende de processos claros e controle financeiro.' }
  ];
  const found = answers.find(item => item.keywords.some(k => q.includes(k)));
  if (found) {
    return `${found.text} Sugestão prática: 1) Liste 3 ações rápidas que pode testar esta semana; 2) Meça resultados a cada 7 dias; 3) Ajuste comunicação com base no que funcionou.`;
  }
  return 'Comece mapeando seu público, definindo metas claras e testando pequenas ações. Exemplo prático: 1) oferta teste; 2) ligação para 10 clientes; 3) ajuste preço/posicionamento.';
}

async function fetchAIResponse(question) {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Erro ao gerar resposta de IA.');
    }
    return result.answer;
  } catch (error) {
    console.warn('Falha no serviço de IA, usando fallback local:', error);
    return askAIFallback(question);
  }
}

async function dicaIA() {
  const output = document.getElementById('ai-suggestion');
  if (output) output.textContent = 'Carregando orientação da IA...';
  const answer = await fetchAIResponse('Forneça uma orientação prática de negócio para um pequeno empreendedor brasileiro.');
  if (output) output.textContent = answer;
  showToast('success', 'Orientação de IA', 'Resposta da IA recebida.');
}

function enviarContato(event) {
  event.preventDefault();
  const nomeEl = document.getElementById('contato-nome');
  const emailEl = document.getElementById('contato-email');
  const msgEl = document.getElementById('contato-mensagem');
  const nome = nomeEl ? nomeEl.value.trim() : '';
  const email = emailEl ? emailEl.value.trim() : '';
  const mensagem = msgEl ? msgEl.value.trim() : '';

  if (!nome || !email || !mensagem) {
    showToast('error', 'Erro', 'Por favor, preencha todos os campos do formulário de contato.');
    return;
  }

  try {
    const stored = JSON.parse(localStorage.getItem('impulsa_contacts') || '[]');
    stored.push({ nome, email, mensagem, date: new Date().toISOString() });
    localStorage.setItem('impulsa_contacts', JSON.stringify(stored));
  } catch (e) {
    console.error('Erro ao salvar contato:', e);
  }

  showToast('success', 'Mensagem recebida', 'Obrigado. Entraremos em contato em breve.');
  if (nomeEl) nomeEl.value = '';
  if (emailEl) emailEl.value = '';
  if (msgEl) msgEl.value = '';
}

function applyConfig(config) {
  const getConfigValue = (key) => config && config[key] ? config[key] : defaultConfig[key];

  const updateText = (id, value, useHtml = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (useHtml) el.innerHTML = value;
    else el.textContent = value;
  };

  updateText('hero-title', getConfigValue('hero_title'), true);
  updateText('hero-subtitle', getConfigValue('hero_subtitle'));
  updateText('services-title', getConfigValue('services_title'));
  updateText('support-title', getConfigValue('support_title'));
  updateText('projects-title', getConfigValue('projects_title'));
  updateText('tech-title', getConfigValue('tech_title'));
  updateText('cta-btn', getConfigValue('cta_button_text'));

  const font = getConfigValue('font_family');
  const baseStack = 'DM Sans, sans-serif';
  document.body.style.fontFamily = `${font}, ${baseStack}`;
  document.body.style.fontSize = `${getConfigValue('font_size')}px`;

  const appWrapper = document.getElementById('app-wrapper');
  if (appWrapper) appWrapper.style.backgroundColor = getConfigValue('background_color');
  const apoio = document.getElementById('apoio');
  if (apoio) apoio.style.backgroundColor = getConfigValue('surface_color');
}

function initScript() {
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileMenu();
    });
  });

  if (window.elementSdk && typeof window.elementSdk.init === 'function') {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange: async (config) => { applyConfig(config); },
      mapToCapabilities: (config) => {
        const c = (key) => config[key] || defaultConfig[key];
        const mut = (key) => ({
          get: () => c(key),
          set: (v) => {
            config[key] = v;
            window.elementSdk.setConfig({ [key]: v });
          }
        });
        return {
          recolorables: [
            mut('background_color'),
            mut('surface_color'),
            mut('text_color'),
            mut('primary_action_color'),
            mut('secondary_action_color')
          ],
          borderables: [],
          fontEditable: mut('font_family'),
          fontSizeable: mut('font_size')
        };
      },
      mapToEditPanelValues: (config) => {
        const c = (key) => config[key] || defaultConfig[key];
        return new Map([
          ['hero_title', c('hero_title')],
          ['hero_subtitle', c('hero_subtitle')],
          ['services_title', c('services_title')],
          ['support_title', c('support_title')],
          ['projects_title', c('projects_title')],
          ['tech_title', c('tech_title')],
          ['cta_button_text', c('cta_button_text')]
        ]);
      }
    });
  }

  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('#navbar a[href^="#"]');
  const sections = Array.from(navLinks).map((link) => {
    const target = document.querySelector(link.getAttribute('href'));
    return target ? { link, target } : null;
  }).filter(Boolean);

  let lastScrollY = window.scrollY;
  let hideNavbarTimeout = 0;

  const showNavbar = () => {
    if (!navbar) return;
    navbar.classList.remove('navbar-hidden');
    navbar.classList.add('navbar-solid');
  };

  const hideNavbar = () => {
    if (!navbar || isMobileMenuOpen) return;
    if (window.scrollY > 100) {
      navbar.classList.add('navbar-hidden');
    }
  };

  const scheduleHideNavbar = () => {
    window.clearTimeout(hideNavbarTimeout);
    hideNavbarTimeout = window.setTimeout(() => {
      if (window.scrollY > 120 && !isMobileMenuOpen) hideNavbar();
    }, 1400);
  };

  const updateNavbar = () => {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add('navbar-solid');
    else navbar.classList.remove('navbar-solid');
  };

  const updateActiveNav = () => {
    const offset = window.innerHeight * 0.25;
    let activeLink = sections.length > 0 ? sections[0].link : null;
    sections.forEach(({ link, target }) => {
      if (target.getBoundingClientRect().top <= offset) activeLink = link;
    });
    sections.forEach(({ link }) => {
      link.classList.toggle('active', link === activeLink);
    });
  };

  updateNavbar();
  updateActiveNav();
  window.addEventListener('scroll', () => {
    if (window.scrollY < lastScrollY || window.scrollY <= 20) {
      showNavbar();
    } else if (window.scrollY > lastScrollY + 8) {
      scheduleHideNavbar();
    }
    updateNavbar();
    updateActiveNav();
    lastScrollY = window.scrollY;
  });
  window.addEventListener('mousemove', (event) => {
    if (event.clientY < 90) showNavbar();
    else scheduleHideNavbar();
  });
  window.addEventListener('touchstart', (event) => {
    const touch = event.touches && event.touches[0];
    if (touch && touch.clientY < 90) showNavbar();
  });

  const counterEls = Array.from(document.querySelectorAll('.counter-number'));
  const animateCounter = (el) => {
    const targetValue = parseFloat(el.dataset.value || '0');
    if (!targetValue || Number.isNaN(targetValue)) return;
    const suffix = el.dataset.suffix || '';
    const duration = 900;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.round(targetValue * progress);
      el.textContent = `${current.toLocaleString('pt-BR')}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = `${targetValue.toLocaleString('pt-BR')}${suffix}`;
    };
    requestAnimationFrame(tick);
  };

  if (counterEls.length) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach((el) => counterObserver.observe(el));
  }

  const preloader = document.getElementById('preloader');
  const hidePreloader = () => {
    if (!preloader) return;
    preloader.classList.add('hidden');
  };
  if (preloader) {
    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 350);
    } else {
      window.addEventListener('load', () => setTimeout(hidePreloader, 350));
    }
  }

  // Link contact buttons to contact section
  const contactBtn = document.getElementById('contact-btn');
  const contactBtnMobile = document.getElementById('contact-btn-mobile');
  const contatoSection = document.getElementById('contato');
  if (contactBtn) contactBtn.addEventListener('click', () => { if (contatoSection) { contatoSection.scrollIntoView({ behavior: 'smooth' }); const el = document.getElementById('contato-nome'); if (el) el.focus(); } });
  if (contactBtnMobile) contactBtnMobile.addEventListener('click', () => { if (contatoSection) { contatoSection.scrollIntoView({ behavior: 'smooth' }); const el = document.getElementById('contato-nome'); if (el) el.focus(); toggleMobile(); } });

  // Hook contact form submit
  const contactForm = document.getElementById('contact-form');
  if (contactForm) contactForm.addEventListener('submit', enviarContato);
  // Hook signup button -> toggle inline signup panel
  const signupBtn = document.getElementById('signup-btn');
  const consultBtn = document.getElementById('consult-btn');
  const aiHelperBtn = document.getElementById('ai-helper-btn');
  const signupPanel = document.getElementById('signup-panel');
  const signupForm = document.getElementById('signup-form');

  if (signupBtn && signupPanel) {
    signupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      signupPanel.classList.toggle('hidden');
      const nameEl = document.getElementById('signup-name');
      if (!signupPanel.classList.contains('hidden') && nameEl) {
        nameEl.focus();
      }
    });
  }
  if (aiHelperBtn) aiHelperBtn.addEventListener('click', (e) => { e.preventDefault(); dicaIA(); });
  const aiChatBtn = document.getElementById('ai-chat-btn');
  const aiSubmitBtn = document.getElementById('ai-submit-btn');
  const aiInput = document.getElementById('ai-input');
  const aiChat = document.getElementById('ai-chat');
  if (aiChatBtn && aiInput) {
    aiChatBtn.addEventListener('click', (e) => {
      e.preventDefault();
      aiInput.focus();
    });
  }
  if (aiSubmitBtn && aiInput && aiChat) {
    aiSubmitBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const question = aiInput.value.trim();
      if (!question) {
        showToast('error', 'Erro', 'Escreva sua pergunta para o assistente.');
        return;
      }
      aiSubmitBtn.disabled = true;
      aiSubmitBtn.textContent = 'Aguarde...';
      const userMessage = document.createElement('div');
      userMessage.className = 'ai-message user';
      userMessage.textContent = question;
      aiChat.appendChild(userMessage);
      try {
        const reply = await fetchAIResponse(question);
        const assistantMessage = document.createElement('div');
        assistantMessage.className = 'ai-message assistant';
        assistantMessage.textContent = reply;
        aiChat.appendChild(assistantMessage);
        aiChat.scrollTop = aiChat.scrollHeight;
        showToast('success', 'Assistente', 'Orientação gerada com sucesso.');
      } catch (err) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'ai-message assistant';
        errorMessage.textContent = 'Não foi possível gerar uma resposta no momento. Tente novamente mais tarde.';
        aiChat.appendChild(errorMessage);
        aiChat.scrollTop = aiChat.scrollHeight;
        showToast('error', 'Erro', 'Falha ao conectar com o serviço de IA.');
      } finally {
        aiInput.value = '';
        aiSubmitBtn.disabled = false;
        aiSubmitBtn.textContent = 'Enviar pergunta';
      }
    });
  }

  // Signup form handler: validate, hash password, save user
  async function hashPassword(password) {
    if (!password || !window.crypto || !window.crypto.subtle) return null;
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = (document.getElementById('signup-name') || {}).value || '';
      const email = (document.getElementById('signup-email') || {}).value || '';
      const password = (document.getElementById('signup-password') || {}).value || '';
      if (!name.trim() || !email.trim() || !password) {
        showToast('error', 'Erro', 'Preencha nome, email e senha.');
        return;
      }
      try {
        const pwdHash = await hashPassword(password);
        const users = JSON.parse(localStorage.getItem('impulsa_users') || '[]');
        users.push({ name: name.trim(), email: email.trim(), passwordHash: pwdHash, date: new Date().toISOString() });
        localStorage.setItem('impulsa_users', JSON.stringify(users));
        // set current user for dashboard access
        try { localStorage.setItem('impulsa_current_user', email.trim()); } catch (e) {}
        showToast('success', 'Conta criada', 'Sua conta foi criada com sucesso.');
        signupForm.reset();
        if (signupPanel) signupPanel.classList.add('hidden');
      } catch (err) {
        console.error('Erro ao criar conta:', err);
        showToast('error', 'Erro', 'Não foi possível criar sua conta. Tente novamente.');
      }
    });
  }

  // Theme toggle: read/write preference
  function applyStoredTheme() {
    try {
      const t = localStorage.getItem('impulsa_theme') || 'light';
      if (t === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark');
      // update floating toggle UI if present
      try { const f = document.getElementById('theme-toggle-floating'); if (f && f.firstElementChild) f.firstElementChild.textContent = (t === 'dark' ? '🌙' : '☀️'); } catch (e) {}
    } catch (e) {}
  }
  // Apply theme on load regardless of presence of a toggle in the DOM
  applyStoredTheme();
  const themeToggleFloating = document.getElementById('theme-toggle-floating');
  const handleThemeToggle = (ev) => {
    if (ev) ev.preventDefault();
    const isDark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('impulsa_theme', isDark ? 'dark' : 'light'); } catch (e) {}
    try { const f = document.getElementById('theme-toggle-floating'); if (f && f.firstElementChild) f.firstElementChild.textContent = (isDark ? '🌙' : '☀️'); } catch (e) {}
    showToast('info', 'Tema', `Tema ${isDark ? 'escuro' : 'claro'} ativado.`);
  };
  if (themeToggleFloating) themeToggleFloating.addEventListener('click', handleThemeToggle);

  // Simple auth: login modal, set current user
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const loginModal = document.getElementById('login-modal');
  const loginClose = document.getElementById('login-close');
  const loginCancel = document.getElementById('login-cancel');
  const loginSubmit = document.getElementById('login-submit');
  const loginEmail = document.getElementById('login-email');
  const loginPass = document.getElementById('login-pass');
  const userBadge = document.getElementById('user-badge');

  function updateAuthUI() {
    const user = localStorage.getItem('impulsa_current_user');
    if (user) {
      if (loginBtn) loginBtn.classList.add('hidden');
      if (logoutBtn) logoutBtn.classList.remove('hidden');
      if (userBadge) { userBadge.style.display='inline'; userBadge.textContent = user.split('@')[0]; }
    } else {
      if (loginBtn) loginBtn.classList.remove('hidden');
      if (logoutBtn) logoutBtn.classList.add('hidden');
      if (userBadge) { userBadge.style.display='none'; userBadge.textContent = ''; }
    }
  }

  if (loginBtn) loginBtn.addEventListener('click', (e) => { e.preventDefault(); if (loginModal) loginModal.classList.remove('hidden'); if (loginEmail) loginEmail.focus(); });
  if (loginClose) loginClose.addEventListener('click', (e) => { e.preventDefault(); if (loginModal) loginModal.classList.add('hidden'); });
  if (loginCancel) loginCancel.addEventListener('click', (e) => { e.preventDefault(); if (loginModal) loginModal.classList.add('hidden'); });
  if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); localStorage.removeItem('impulsa_current_user'); updateAuthUI(); showToast('info','Sair','Você saiu da sua conta.'); });

  if (loginSubmit) {
    loginSubmit.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = (loginEmail||{}).value || '';
      const pass = (loginPass||{}).value || '';
      if (!email) { showToast('error','Login','Informe seu email.'); return; }
      try {
        const resp = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: pass }) });
        const data = await resp.json();
        if (!resp.ok) { showToast('error','Login', data.error || 'Falha ao autenticar'); return; }
        // ensure user exists locally
        let users = [];
        try { users = JSON.parse(localStorage.getItem('impulsa_users') || '[]'); } catch (e) { users = []; }
        const found = users.find(u => (u.email||'').toLowerCase() === email.toLowerCase());
        if (!found) { try { users.push({ name: email.split('@')[0], email, passwordHash: '', date: new Date().toISOString() }); localStorage.setItem('impulsa_users', JSON.stringify(users)); } catch (e) {} }
        localStorage.setItem('impulsa_current_user', email);
        // Frontend admin flags are disabled; admin access must be handled server-side and via a secure admin UI.
        if (loginModal) loginModal.classList.add('hidden');
        updateAuthUI();
        showToast('success','Login','Entrou com sucesso.');
      } catch (err) { console.error(err); showToast('error','Login','Erro na requisição de login.'); }
    });
  }
  updateAuthUI();

  // Admin UI disabled: admin pages are removed from frontend to avoid broken controls.
  // If you need admin functionality, re-enable server-side verification and add a secure admin UI.

  // 'Fale com um Consultor' -> scroll to contact form
  if (consultBtn && contatoSection) {
    consultBtn.addEventListener('click', (e) => {
      e.preventDefault();
      contatoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const el = document.getElementById('contato-nome'); if (el) el.focus();
    });
  }

  // CTA and projects buttons
  const ctaBtn = document.getElementById('cta-btn');
  const projectsBtn = document.getElementById('projects-btn');
  const mentorBtn = document.getElementById('mentor-btn');
  const mentorPanel = document.getElementById('mentor-panel');
  const mentorForm = document.getElementById('mentor-form');

  if (ctaBtn && signupPanel) {
    ctaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      signupPanel.classList.remove('hidden');
      signupPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const el = document.getElementById('signup-name'); if (el) el.focus();
    });
  }
  if (projectsBtn) {
    projectsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const p = document.getElementById('projetos'); if (p) p.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (mentorBtn && mentorPanel) {
    mentorBtn.addEventListener('click', (e) => {
      e.preventDefault();
      mentorPanel.classList.toggle('hidden');
      if (!mentorPanel.classList.contains('hidden')) {
        const el = document.getElementById('mentor-name'); if (el) el.focus();
      }
    });
  }

  if (mentorForm) {
    mentorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('mentor-name') || {}).value || '';
      const email = (document.getElementById('mentor-email') || {}).value || '';
      const area = (document.getElementById('mentor-area') || {}).value || '';
      const bio = (document.getElementById('mentor-bio') || {}).value || '';
      if (!name.trim() || !email.trim() || !area.trim()) {
        showToast('error', 'Erro', 'Preencha nome, email e área de atuação.');
        return;
      }
      try {
        const mentors = JSON.parse(localStorage.getItem('impulsa_mentors') || '[]');
        mentors.push({ name: name.trim(), email: email.trim(), area: area.trim(), bio: bio.trim(), date: new Date().toISOString() });
        localStorage.setItem('impulsa_mentors', JSON.stringify(mentors));
        showToast('success', 'Cadastro de mentor', 'Obrigado pelo cadastro!');
        mentorForm.reset();
        mentorPanel.classList.add('hidden');
      } catch (err) {
        console.error('Erro ao salvar mentor:', err);
        showToast('error', 'Erro', 'Não foi possível salvar seu cadastro.');
      }
    });
  }

  // Floating chat drawer handlers
  const chatToggle = document.getElementById('chat-toggle');
  const chatDrawer = document.getElementById('chat-drawer');
  const chatClose = document.getElementById('chat-close');
  const drawerInput = document.getElementById('drawer-input');
  const drawerSend = document.getElementById('drawer-send');
  const drawerMessages = document.getElementById('drawer-messages');

  function appendDrawerMessage(text, who = 'assistant') {
    const m = document.createElement('div');
    m.style.padding = '8px 10px';
    m.style.borderRadius = '10px';
    m.style.maxWidth = '86%';
    m.style.lineHeight = '1.3';
    if (who === 'user') {
      m.style.marginLeft = 'auto';
      m.style.background = 'linear-gradient(135deg,#7c3aed,#6366f1)';
      m.style.color = 'white';
    } else {
      m.style.background = '#fff';
      m.style.color = '#0f172a';
      m.style.border = '1px solid #eef2f7';
    }
    // allow simple HTML when needed
    if (text && text.startsWith('<')) m.innerHTML = text; else m.textContent = text;
    if (drawerMessages) drawerMessages.appendChild(m);
    if (drawerMessages) drawerMessages.scrollTop = drawerMessages.scrollHeight;
  }

  if (chatToggle && chatDrawer) {
    chatToggle.addEventListener('click', (e) => {
      e.preventDefault();
      chatDrawer.classList.toggle('hidden');
      if (!chatDrawer.classList.contains('hidden')) {
        drawerInput && drawerInput.focus();
      }
    });
  }
  if (chatClose && chatDrawer) {
    chatClose.addEventListener('click', (e) => { e.preventDefault(); chatDrawer.classList.add('hidden'); });
  }

  if (drawerSend && drawerInput && drawerMessages) {
    drawerSend.addEventListener('click', async (e) => {
      e.preventDefault();
      let q = drawerInput.value.trim();
      if (!q) return;
      // detect mentor intent: starts with 'Conectar com mentor ' (set by mentor list)
      let mentorTag = null;
      if (q.toLowerCase().startsWith('conectar com mentor ')) {
        const rest = q.slice('Conectar com mentor '.length);
        // split by colon or em dash or hyphen
        const colonIdx = rest.indexOf(':');
        const emIdx = rest.indexOf('—');
        const hyIdx = rest.indexOf('-');
        let endIdx = colonIdx;
        if (endIdx === -1 || (emIdx !== -1 && emIdx < endIdx)) endIdx = emIdx;
        if (endIdx === -1 || (hyIdx !== -1 && hyIdx < endIdx)) endIdx = hyIdx;
        if (endIdx === -1) endIdx = rest.length;
        mentorTag = rest.slice(0, endIdx).trim();
        // question after colon/em-dash if present
        let questionPart = '';
        if (colonIdx !== -1) questionPart = rest.slice(colonIdx + 1).trim();
        else if (emIdx !== -1) {
          questionPart = rest.slice(emIdx + 1).trim();
        } else if (hyIdx !== -1) {
          questionPart = rest.slice(hyIdx + 1).trim();
        }
        if (questionPart) q = questionPart; else q = '';
      }

      appendDrawerMessage(q || (mentorTag ? `Conectar com mentor ${mentorTag}` : ''), 'user');
      drawerInput.value = '';
      appendDrawerMessage('Pensando...', 'assistant');
      try {
        const prompt = mentorTag ? `Você é um mentor experiente. Responda sucintamente e indique próximos passos. Pergunta para ${mentorTag}: ${q}` : q;
        const answer = await fetchAIResponse(prompt);
        // remove last 'Pensando...'
        const nodes = drawerMessages.querySelectorAll('div');
        if (nodes && nodes.length) {
          const last = nodes[nodes.length - 1];
          if (last && (last.textContent === 'Pensando...' || last.innerText === 'Pensando...')) last.remove();
        }
        // if mentorTag, save mentor request
        if (mentorTag) {
          try {
            const requests = JSON.parse(localStorage.getItem('impulsa_mentor_requests') || '[]');
            requests.push({ mentor: mentorTag, question: q, answerSnippet: (answer || '').slice(0,300), date: new Date().toISOString() });
            localStorage.setItem('impulsa_mentor_requests', JSON.stringify(requests));
          } catch (e) { console.warn('Falha ao salvar pedido de mentor', e); }
          appendDrawerMessage(`<strong>🔖 Marcado para <em>${mentorTag}</em></strong><div style="margin-top:6px;">Resposta inicial:</div><div style="margin-top:6px;">${escapeHtml(answer)}</div>`, 'assistant');
        } else {
          appendDrawerMessage(`<strong>💡 Orientação</strong><div style="margin-top:6px;">${escapeHtml(answer)}</div>`, 'assistant');
        }
      } catch (err) {
        console.error(err);
        appendDrawerMessage('Não foi possível obter resposta agora.', 'assistant');
      }
    });
    drawerInput.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' && !ev.shiftKey) {
        ev.preventDefault();
        drawerSend.click();
      }
    });
  }

  // Drawer mentor list handlers
  const drawerMentorsToggle = document.getElementById('drawer-mentors-toggle');
  const drawerMentors = document.getElementById('drawer-mentors');

  function renderDrawerMentors() {
    if (!drawerMentors) return;
    drawerMentors.innerHTML = '';
    let mentors = [];
    try { mentors = JSON.parse(localStorage.getItem('impulsa_mentors') || '[]'); } catch (e) { mentors = []; }
    if (!mentors || mentors.length === 0) {
      const p = document.createElement('div'); p.style.color = '#64748b'; p.textContent = 'Nenhum mentor cadastrado ainda.'; drawerMentors.appendChild(p); return;
    }
    mentors.slice().reverse().forEach(m => {
      const item = document.createElement('div');
      item.style.display = 'flex'; item.style.flexDirection = 'column'; item.style.padding = '8px'; item.style.borderRadius = '8px'; item.style.background = '#fff'; item.style.cursor = 'pointer';
      const title = document.createElement('div'); title.style.fontWeight = '700'; title.style.color = '#0f172a'; title.textContent = m.name + ' — ' + (m.area || 'Mentor');
      const bio = document.createElement('div'); bio.style.fontSize = '13px'; bio.style.color = '#475569'; bio.style.marginTop = '6px'; bio.textContent = m.bio ? (m.bio.length > 140 ? m.bio.slice(0,137) + '...' : m.bio) : '';
      item.appendChild(title); if (m.bio) item.appendChild(bio);
      item.addEventListener('click', (ev) => {
        ev.preventDefault();
        drawerInput.value = `Conectar com mentor ${m.name} — ${m.area}: `;
        drawerInput.focus();
        showToast('info', 'Mentor selecionado', `Você está escrevendo ao mentor ${m.name}.`);
      });
      drawerMentors.appendChild(item);
    });
  }

  if (drawerMentorsToggle) {
    drawerMentorsToggle.addEventListener('click', (ev) => {
      ev.preventDefault();
      if (!drawerMentors) return;
      drawerMentors.classList.toggle('hidden');
      if (!drawerMentors.classList.contains('hidden')) renderDrawerMentors();
    });
  }

  // Admin features removed from frontend: export and admin populate disabled to avoid exposing admin controls.
  initQuizPage();
}

function initQuizPage() {
  const quizForm = document.getElementById('quiz-form');
  const progressFill = document.getElementById('quiz-progress-fill');
  const progressText = document.getElementById('quiz-progress-text');
  const resultCard = document.getElementById('quiz-result-card');
  const resultTitle = document.getElementById('quiz-result-title');
  const resultSummary = document.getElementById('quiz-result-summary');
  const restartButton = document.getElementById('quiz-restart');
  const steps = Array.from(document.querySelectorAll('.quiz-step'));
  if (!quizForm || !steps.length || !progressFill || !progressText) return;

  let currentStep = 0;
  const totalSteps = steps.length;

  const updateProgress = () => {
    const progress = Math.round(((currentStep + 1) / totalSteps) * 100);
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Pergunta ${Math.min(currentStep + 1, totalSteps)} de ${totalSteps}`;
  };

  const showStep = (index) => {
    steps.forEach((step, idx) => {
      step.classList.toggle('hidden', idx !== index);
      step.classList.toggle('active', idx === index);
    });
    if (resultCard) resultCard.classList.add('hidden');
    updateProgress();
    window.scrollTo({ top: quizForm.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
  };

  const getSelectedValue = (stepIndex) => {
    const inputs = steps[stepIndex].querySelectorAll('input[type="radio"]');
    const found = Array.from(inputs).find((input) => input.checked);
    return found ? found.value : null;
  };

  const determineProfile = (answers) => {
    const score = { visionario: 0, criativo: 0, estrategico: 0, analitico: 0 };
    const mapping = {
      ideia: ['visionario'],
      validacao: ['estrategico'],
      crescimento: ['visionario'],
      escala: ['estrategico'],
      vendas: ['estrategico'],
      financeiro: ['analitico'],
      marketing: ['criativo'],
      inovacao: ['visionario'],
      criativo: ['criativo'],
      estavel: ['estrategico'],
      estrategico: ['estrategico'],
      analitico: ['analitico'],
      intuicao: ['criativo'],
      dados: ['analitico'],
      planejamento: ['estrategico'],
      colaboracao: ['visionario'],
      mentorias: ['estrategico'],
      workshops: ['visionario'],
      consultorias: ['analitico'],
      digital: ['criativo']
    };
    answers.forEach((answer) => {
      const profiles = mapping[answer];
      if (profiles && profiles.length) {
        profiles.forEach((profile) => score[profile]++);
      }
    });
    const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
    return sorted[0][0];
  };

  const renderResult = (profile) => {
    const details = {
      visionario: {
        title: 'Empreendedor Visionário',
        message: 'Você aposta na inovação, identifica oportunidades e lidera com ousadia. Busque mentores que ampliem sua visão estratégica e transformem ideias em ações concretas.'
      },
      criativo: {
        title: 'Empreendedor Criativo',
        message: 'Você traz soluções originais e valoriza a diferenciação. Aproveite workshops e formatos digitais que potencializem sua imagem e engajem seus clientes.'
      },
      estrategico: {
        title: 'Empreendedor Estratégico',
        message: 'Você planeja com foco em resultados e entende os próximos passos. Invista em consultorias e estruturação de processos para escalar com segurança.'
      },
      analitico: {
        title: 'Empreendedor Analítico',
        message: 'Você valoriza dados, controle e previsibilidade. Utilize ferramentas de gestão financeira e métricas para maximizar decisões e reduzir riscos.'
      }
    };
    const current = details[profile] || details.estrategico;
    if (resultTitle) resultTitle.textContent = current.title;
    if (resultSummary) resultSummary.textContent = current.message;
    if (resultCard) resultCard.classList.remove('hidden');
    window.scrollTo({ top: quizForm.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
  };

  quizForm.querySelectorAll('.quiz-next').forEach((button, stepIndex) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const selected = getSelectedValue(stepIndex);
      if (!selected) {
        showToast('error', 'Quiz', 'Selecione uma opção antes de avançar.');
        return;
      }
      if (stepIndex < totalSteps - 1) {
        currentStep = stepIndex + 1;
        showStep(currentStep);
      } else {
        const answers = steps.map((_, idx) => getSelectedValue(idx));
        if (answers.some((answer) => !answer)) {
          showToast('error', 'Quiz', 'Responda todas as perguntas para ver seu perfil.');
          return;
        }
        const profile = determineProfile(answers);
        renderResult(profile);
      }
    });
  });

  if (restartButton) {
    restartButton.addEventListener('click', () => {
      steps.forEach((step, idx) => {
        step.classList.toggle('hidden', idx !== 0);
        step.classList.toggle('active', idx === 0);
      });
      steps.forEach((step) => step.querySelectorAll('input[type="radio"]').forEach((input) => { input.checked = false; }));
      if (resultCard) resultCard.classList.add('hidden');
      currentStep = 0;
      updateProgress();
    });
  }

  showStep(currentStep);
}

document.addEventListener('DOMContentLoaded', initScript);
