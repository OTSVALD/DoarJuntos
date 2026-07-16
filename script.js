(function () {
  "use strict";

  function showToast(message, type) {
    var container = document.getElementById("toastContainer");
    if (!container) return;
    var toast = document.createElement("div");
    toast.className = "toast" + (type ? " toast-" + type : "");
    toast.textContent = message;
    container.appendChild(toast);
    void toast.offsetWidth;
    toast.classList.add("show");
    setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3500);
  }

  function nowTime() {
    var d = new Date();
    return (
      String(d.getHours()).padStart(2, "0") +
      ":" +
      String(d.getMinutes()).padStart(2, "0")
    );
  }

  function appendMessage(text, type, sender) {
    var chatWindow = document.getElementById("chatWindow");
    if (!chatWindow) return;
    var msg = document.createElement("div");
    msg.className = "message message-" + (type || "sent");
    if (type === "system") {
      msg.textContent = text;
    } else {
      var strong = document.createElement("strong");
      strong.textContent = (sender || "Você") + ": ";
      msg.appendChild(strong);
      msg.appendChild(document.createTextNode(text));
    }
    var meta = document.createElement("span");
    meta.className = "message-meta";
    meta.textContent = nowTime();
    msg.appendChild(meta);
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Mapa - clique no ponto
  function initMapPoints() {
    document.querySelectorAll(".map-point").forEach(function (point) {
      point.addEventListener("click", function () {
        showToast(
          "📍 Sede União Espírita Alagoinhense — Rua Pracinhas Dionisio e Evilásio, 374 – Centro, Alagoinhas – BA",
          "success",
        );
      });
    });
  }

  // Formulário
  function initDonationForm() {
    var form = document.getElementById("donationForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var donorName = document.getElementById("donorName");
      var anonymous = document.getElementById("anonymousDonor");
      var itemType = document.getElementById("itemType");
      var itemDescription = document.getElementById("itemDescription");
      var dropPoint = document.getElementById("dropPoint");

      if (!donorName.value.trim()) {
        showToast("Informe seu nome para continuar.", "error");
        donorName.focus();
        return;
      }
      if (!itemType.value) {
        showToast("Selecione a categoria do item.", "error");
        itemType.focus();
        return;
      }
      if (!itemDescription.value.trim()) {
        showToast("Descreva os itens que vai doar.", "error");
        itemDescription.focus();
        return;
      }

      var displayDonor = anonymous.checked
        ? donorName.value.trim()
        : "Doador anônimo";
      showToast(
        "Doação confirmada! " +
          displayDonor +
          " doou " +
          itemType.value +
          " para " +
          dropPoint.value +
          ".",
        "success",
      );
      appendMessage(
        "🟢 Nova doação: " +
          itemType.value +
          " — " +
          itemDescription.value.trim() +
          " | Entrega: " +
          dropPoint.value +
          " | Doador: " +
          displayDonor,
        "system",
      );
      form.reset();
      if (dropPoint.options.length > 0) dropPoint.selectedIndex = 0;
    });
  }

  // Chat
  function initChat() {
    var chatInput = document.getElementById("chatInput");
    var chatSend = document.getElementById("chatSend");
    if (!chatInput || !chatSend) return;
    function sendMessage() {
      var text = chatInput.value.trim();
      if (!text) return;
      appendMessage(text, "sent", "Você");
      chatInput.value = "";
      chatInput.focus();
      setTimeout(function () {
        appendMessage(
          "Recebido! Obrigado pela colaboração. Estamos na Sede União Espírita Alagoinhense.",
          "received",
          "Coordenador",
        );
      }, 900);
    }
    chatSend.addEventListener("click", sendMessage);
    chatInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  window.sendQuickReply = function (text) {
    if (!text) return;
    appendMessage(text, "sent", "Você");
    setTimeout(function () {
      appendMessage(
        "Anotado! Vamos organizar a entrega na Sede União Espírita Alagoinhense.",
        "received",
        "Coordenador",
      );
    }, 800);
  };

  document.addEventListener("DOMContentLoaded", function () {
    initMapPoints();
    initDonationForm();
    initChat();
  });
})();
