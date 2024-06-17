// task_panel.js
"use strict";

function updateTaskPanel(tasks) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = ""; // Καθαρισμός της λίστας

  tasks.forEach((task) => {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item", "task-item");

    listItem.innerHTML = `
      <div class="task-container">
        <h5>Τύπος: ${task.type === "Offer" ? "Προσφορά" : "Αίτηση"}</h5>
        <p><strong>Ονομ/νυμο:</strong>${task.full_name}</p>
        <p><strong>Τηλέφωνο:</strong>${task.phone}</p>
        <p><strong>Είδος:</strong>${task.item_name}</p>
        <p><strong>Ποσότητα:</strong> ${task.quantity}</p>
        <p><strong>Διεύθυνση:</strong> ${task.street} ${task.number}, ${
      task.town
    }</p>
        <p><strong>Ημερομηνία Καταχώρησης:</strong> ${formatDateIntl(
          task.created_at
        )}</p>
        <p><strong>Ημερομηνία Ανάληψης:</strong> ${formatDateIntl(
          task.accepted_at
        )}</p>
        <button class="btn-task" onclick="completeTask('${
          task.id
        }')">Ολοκλήρωση Task</button>
        <button class="btn-task" onclick="cancelTask('${
          task.id
        }')">Ακύρωση Task</button>
      </div>
    `;

    taskList.appendChild(listItem);
  });
}

function formatDateIntl(dateStr) {
  const dateObj = new Date(dateStr); // Δημιουργία ενός αντικειμένου Date από τη συμβολοσειρά
  return new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dateObj);
}

export { updateTaskPanel };
