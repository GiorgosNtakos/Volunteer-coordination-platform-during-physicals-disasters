// task_panel.js
"use strict";

function updateTaskPanel(assignedTasks) {
    let taskListContainer = $('#task-list-container');
    taskListContainer.empty(); // Clear existing tasks

    assignedTasks.forEach(task => {
        let taskElement = $(`
            <div class="task">
                <p><b>Task ID:</b> ${task.id}</p>
                <p><b>Type:</b> ${task.type}</p>
                <p><b>Name:</b> ${task.full_name}</p>
                <p><b>Phone:</b> ${task.phone}</p>
                <p><b>Quantity:</b> ${task.quantity}</p>
                <p><b>Created At:</b> ${task.created_at}</p>
                <p><b>Accepted At:</b> ${task.accepted_at}</p>
                <button onclick="completeTask('${task.id}')">Complete Task</button>
                <button onclick="cancelTask('${task.id}')">Cancel Task</button>
            </div>
        `);
        taskListContainer.append(taskElement);
    });
}

export { updateTaskPanel };
