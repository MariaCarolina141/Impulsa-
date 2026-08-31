document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const menuButton = document.getElementById("menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  menuButton.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden", isOpen);
    menuButton.setAttribute("aria-expanded", String(!isOpen));
  });

  document.querySelectorAll("#mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });

  const resultPanels = {
    story: document.getElementById("result-story"),
    experiment: document.getElementById("result-experiment"),
    community: document.getElementById("result-community")
  };
  const defaultResult = document.getElementById("result-default");

  document.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const choice = button.dataset.choice;
      document.querySelectorAll("[data-choice]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });

      defaultResult.hidden = true;
      Object.values(resultPanels).forEach((panel) => panel.hidden = true);
      resultPanels[choice].hidden = false;
    });
  });

  document.querySelectorAll(".method-card").forEach((card) => {
    card.addEventListener("click", () => {
      const isFlipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(isFlipped));
    });
  });

  const interestSelect = document.getElementById("interest");
  document.querySelectorAll("[data-interest]").forEach((button) => {
    button.addEventListener("click", () => {
      interestSelect.value = button.dataset.interest;
      document.getElementById("contato").scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => document.getElementById("name").focus(), 500);
    });
  });

  const form = document.getElementById("contact-form");
  const submitButton = document.getElementById("submit-button");
  const status = document.getElementById("form-status");
  let sheetReady = false;

  function showStatus(message, type) {
    status.textContent = message;
    status.hidden = false;
    status.className = "status-message mt-5 rounded-sm border px-4 py-3 text-sm " +
      (type === "success"
        ? "border-[#d9ee69] bg-[#1d352b] text-[#f2ffae]"
        : "border-[#f5b38f] bg-[#4a2924] text-[#ffe3d5]");
  }

  const dataHandler = {
    onDataChanged() {
      sheetReady = true;
    }
  };

  async function initializeSheet() {
    if (window.dataSdk) {
      const initResult = await window.dataSdk.init(dataHandler);
      if (!initResult.isOk) {
        showStatus("Não foi possível preparar o envio agora. Tente novamente em instantes.", "error");
        return;
      }
      sheetReady = true;
    }
  }

  initializeSheet();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.hidden = true;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!sheetReady && window.dataSdk) {
      showStatus("Estamos preparando seu envio. Aguarde um instante e tente novamente.", "error");
      return;
    }

    submitButton.disabled = true;

    const record = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      interest: interestSelect.value,
      message: document.getElementById("message").value.trim(),
      created_at: new Date().toISOString()
    };

    if (window.dataSdk) {
      const createResult = await window.dataSdk.create(record);
      submitButton.disabled = false;

      if (createResult.isOk) {
        form.reset();
        showStatus("Recebemos sua mensagem. Em breve, a Story Education entra em contato.", "success");
      } else {
        showStatus("Não foi possível enviar sua mensagem agora. Revise os dados e tente novamente.", "error");
      }
    } else {
      submitButton.disabled = false;
      showStatus("Mensagem enviada com sucesso (Simulação local)!", "success");
      form.reset();
    }
  });
});
