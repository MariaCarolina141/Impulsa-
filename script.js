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

  try {
    const users = JSON.parse(localStorage.getItem('impulsa_signups') || '[]');
    users.push({ nome, email, date: new Date().toISOString() });
    localStorage.setItem('impulsa_signups', JSON.stringify(users));
  } catch (e) {
    console.error('Erro ao salvar cadastro:', e);
  }

  showToast('success', 'Cadastro realizado', `Obrigado, ${nome}. Redirecionando para o painel...`);
  
  setTimeout(() => {
    window.location.href = './dashboard.html';
  }, 1000);
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
    { keywords
