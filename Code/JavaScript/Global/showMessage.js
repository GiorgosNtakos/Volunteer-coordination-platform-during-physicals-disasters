function showMessage(type, message, targetInputId) {
  var messageField = document.createElement("div");
  messageField.className = type;
  messageField.textContent = message;

  var closeButton = document.createElement("button");
  closeButton.className = "close-button";
  closeButton.textContent = "×";
  closeButton.addEventListener("click", function () {
    clearMessages();
  });
  messageField.appendChild(closeButton);

  // Ελέγχουμε αν υπάρχει πεδίο εισαγωγής με το συγκεκριμένο ID
  var targetInput = document.querySelector(targetInputId);
  if (targetInput) {
    console.log("kati kala");
    targetInput.parentNode.insertBefore(messageField, targetInput.nextSibling);
  } else {
    console.log("kati skata");
    document.body.appendChild(messageField);
  }
}

function clearMessages() {
  var messages = document.querySelectorAll(
    ".error-message, .success-message, .extra-error-message, .extra-success-message"
  );
  messages.forEach(function (message) {
    message.parentNode.removeChild(message);
  });
}
