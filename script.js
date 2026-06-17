/*
      Lógica do protótipo em JavaScript Vanilla.
      Mantida simples para fins demonstrativos, sem frameworks externos.
    */

// Utilitário: exibe notificação tipo toast (feedback visual)
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.textContent = message;

  container.appendChild(toast);

  // Heurística nº 1: visibilidade — a notificação aparece por tempo suficiente
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "opacity 0.3s, transform 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Seção de Doação: validação e envio simulado
document
  .getElementById("donationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const donorName = document.getElementById("donorName").value.trim();
    const itemType = document.getElementById("itemType").value;
    const itemDescription = document
      .getElementById("itemDescription")
      .value.trim();
    const dropPoint = document.getElementById("dropPoint").value;

    // Heurística nº 5: prevenção de erros — validação antes de prosseguir
    if (!donorName || !itemType || !itemDescription || !dropPoint) {
      showToast("Preencha todos os campos antes de enviar.", "error");
      return;
    }

    // Simula o envio dos dados
    console.log("Doação cadastrada:", {
      donorName,
      itemType,
      itemDescription,
      dropPoint,
    });

    // Heurística nº 1: visibilidade do status do sistema — confirma sucesso
    showToast(
      `Obrigado, ${donorName}! Sua doação de ${itemType} foi cadastrada.`,
      "success",
    );

    // Reseta o formulário para nova entrada (eficiência de uso)
    this.reset();
  });

// Seção de Chat: envio de mensagens
const chatWindow = document.getElementById("chatWindow");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");

function appendMessage(text, sender = "Você") {
  if (!text.trim()) return;

  const now = new Date();
  const time = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const message = document.createElement("div");
  message.className = "message message-sent";
  message.innerHTML = `<strong>${sender}:</strong> ${text}<span class="message-meta">${time}</span>`;

  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  showToast("Mensagem enviada.", "success");
}

function sendQuickReply(text) {
  appendMessage(text, "Você");
  chatInput.value = "";

  // Simula resposta automática do coordenador após 1 segundo
  setTimeout(() => {
    const reply = document.createElement("div");
    reply.className = "message message-received";
    const time = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    reply.innerHTML = `<strong>Coordenador:</strong> Obrigado! Anotamos aqui. <span class="message-meta">${time}</span>`;
    chatWindow.appendChild(reply);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, 1000);
}

chatSend.addEventListener("click", function () {
  sendQuickReply(chatInput.value);
});

chatInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendQuickReply(chatInput.value);
  }
});

// Interação com pontos do mapa: exibe detalhes ao clicar
document.querySelectorAll(".map-point").forEach((point) => {
  point.addEventListener("click", function () {
    const label = this.getAttribute("data-label");

    // Heurística nº 1: feedback imediato ao interagir com o mapa
    showToast(`Ponto selecionado: ${label}.`, "success");

    // Heurística nº 6: reconhecimento em vez de memorização —
    // preenche automaticamente o ponto de entrega no formulário
    const dropPointSelect = document.getElementById("dropPoint");
    let found = false;
    for (let i = 0; i < dropPointSelect.options.length; i++) {
      if (dropPointSelect.options[i].value === label) {
        dropPointSelect.selectedIndex = i;
        found = true;
        break;
      }
    }
    if (found) {
      showToast(
        "Ponto de entrega preenchido automaticamente no formulário.",
        "success",
      );
    }
  });
});

// Exibe mensagem inicial ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  showToast("Bem-vindo à Solução Colaborativa de Doações!", "success");
});
