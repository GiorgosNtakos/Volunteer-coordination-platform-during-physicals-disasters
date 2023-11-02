
function showMessage(type, message, targetInputId) {
    clearMessages();
    var messageField = document.createElement("div");
    messageField.className = type;
    messageField.textContent = message;
    messageField.innerHTML += '<button class="close-button" onclick="clearMessages()">×</button>';
    
    // Ελέγχουμε αν υπάρχει πεδίο εισαγωγής με το συγκεκριμένο ID
    var targetInput = document.getElementById(targetInputId);
    if (targetInput) {
      targetInput.parentNode.insertBefore(messageField, targetInput.nextSibling);
    } else {
      document.body.appendChild(messageField);
    }
  }

function clearMessages() {
    var messages = document.querySelectorAll('.error-message, .success-message');
    messages.forEach(function(message) {
    message.parentNode.removeChild(message);
    });
  }