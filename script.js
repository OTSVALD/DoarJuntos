// ============================================================
// Solução Colaborativa de Doações — DoarJuntos
// Funcionalidades: Chat, Doações com Anonimato, Notificações
// ============================================================

// --- Chat ---
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");
const chatWindow = document.getElementById("chatWindow");

function addMessage(text, type = "sent") {
  const msg = document.createElement("div");
  msg.className = `message message-${type}`;
  const now = new Date();
  const time = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  msg.innerHTML = `<strong>Você:</strong> ${text}<span class="message-meta">${time}</span>`;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatSend.addEventListener("click", () => {
  const text = chatInput.value.trim();
  if (text) {
    addMessage(text);
    chatInput.value = "";
  }
});

chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") chatSend.click();
});

function sendQuickReply(text) {
  addMessage(text);
}

// --- Doações com Anonimato ---
const donationForm = document.getElementById("donationForm");
const anonymousCheckbox = document.getElementById("anonymousDonor");

// Criar seção de doações recentes
const doacaoSection = document.getElementById("doacao");
const recentDonationsDiv = document.createElement("div");
recentDonationsDiv.id = "recentDonations";
recentDonationsDiv.className = "recent-donations";
recentDonationsDiv.innerHTML = `
  <h3 class="recent-donations-title">Doações Recentes</h3>
  <div id="donationList" class="donation-list"></div>
`;
doacaoSection.appendChild(recentDonationsDiv);

let donations = [];

donationForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const donorName = document.getElementById("donorName").value.trim();
  const isAnonymous = !anonymousCheckbox.checked; // padrão: anônimo
  const itemType = document.getElementById("itemType").value;
  const itemDescription = document
    .getElementById("itemDescription")
    .value.trim();
  const dropPoint = document.getElementById("dropPoint").value;

  if (!donorName || !itemType || !itemDescription || !dropPoint) {
    showToast("Preencha todos os campos obrigatórios.", "error");
    return;
  }

  const displayName = isAnonymous ? "Doador Anônimo" : donorName;

  const donation = {
    name: displayName,
    type: itemType,
    description: itemDescription,
    point: dropPoint,
    date: new Date().toLocaleDateString("pt-BR"),
  };

  donations.unshift(donation);
  renderDonations();
  donationForm.reset();
  anonymousCheckbox.checked = false; // volta ao padrão (anônimo)
  showToast("Doação cadastrada com sucesso!", "success");
});

function renderDonations() {
  const list = document.getElementById("donationList");
  if (donations.length === 0) {
    list.innerHTML =
      '<p class="donation-empty">Nenhuma doação registrada ainda.</p>';
    return;
  }

  list.innerHTML = donations
    .map(
      (d) => `
    <div class="donation-card">
      <div class="donation-card-header">
        <strong class="donation-name">${d.name}</strong>
        <span class="donation-date">${d.date}</span>
      </div>
      <div class="donation-tags">
        <span class="tag tag-category">${d.type}</span>
        <span class="tag tag-point">📍 ${d.point}</span>
      </div>
      <p class="donation-description">${d.description}</p>
    </div>
  `,
    )
    .join("");
}

// Inicializa a lista vazia
renderDonations();

// --- Notificações (Toast) ---
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
