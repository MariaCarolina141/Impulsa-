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

function toggleMobile() {
  const menu = document.getElementById("mobile-menu");
  if (menu) {
    menu.classList.toggle("hidden");
  }
}

// Toast helper
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
  return found ? found.text : 'Comece mapeando seu público, definindo metas claras e testando pequenas ações. Escale o que funcionar.';
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
  const updateNavbar = () => {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add('navbar-solid');
    else navbar.classList.remove('navbar-solid');
  };
  updateNavbar();
  window.addEventListener('scroll', updateNavbar);

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
        showToast('success', 'Conta criada', 'Sua conta foi criada com sucesso.');
        signupForm.reset();
        if (signupPanel) signupPanel.classList.add('hidden');
      } catch (err) {
        console.error('Erro ao criar conta:', err);
        showToast('error', 'Erro', 'Não foi possível criar sua conta. Tente novamente.');
      }
    });
  }

  // 'Fale com um Consultor' -> scroll to contact form
  if (consultBtn && contatoSection) {
    consultBtn.addEventListener('click', (e) => {
      e.preventDefault();
      contatoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const el = document.getElementById('contato-nome'); if (el) el.focus();
    });
  }
}

document.addEventListener('DOMContentLoaded', initScript);
