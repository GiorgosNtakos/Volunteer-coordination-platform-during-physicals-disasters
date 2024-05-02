// Ορισμός της μεταβλητής itemsData έξω από τις συναρτήσεις
const itemsData = [];

function getTaskIds() {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        populateSelect(response); // Καλεί συνάρτηση για να γεμίσει το select με τα δεδομένα που παίρνει από τον server

      } else {
        console.error('Υπήρξε ένα πρόβλημα με το αίτημα.');
      }
    }
  };

  xhr.open('GET', '../../PHP/Admin/get_tasks.php', true);
  xhr.send();
}

function loadItemsData() {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        itemsData = JSON.parse(xhr.responseText);
      } else {
        console.error('Υπήρξε ένα πρόβλημα με το αίτημα για τα δεδομένα των αντικειμένων.');
      }
    }
  };

  xhr.open('GET', '../../PHP/Admin/get_items.php', true);
  xhr.send();
}

function populateSelect(taskIds) {
  var select = document.getElementById('taskSelect');
  taskIds.forEach(function(task) {
    var option = document.createElement('option');
    option.value = task.id;

    // Κάνει populate το select με τα στοιχεία του task ως options, αν αυτά υπάρχουν
    option.text = task.id + ', ' + task.item_name + ', ' + task.username + ', ' + task.quantity + ', ' + task.type + ', ' + task.status

    select.appendChild(option);
  });
}

window.onload = getTaskIds;

function getTaskDetails() {
  var selectedTaskId = document.getElementById('taskSelect').value;

  if (selectedTaskId !== '') {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          fillFormFields(response); // Καλεί συνάρτηση για τη συμπλήρωση των δεδομένων στα πεδία της φόρμας
        } else {
          console.error('Υπήρξε ένα πρόβλημα με το αίτημα.');
        }
      }
    };

    xhr.open('GET', '../../PHP/Admin/get_tasks.php?' + selectedTaskId, true);
    xhr.send();
  }
}

function fillFormFields(taskData) {
  console.log(taskData[0]);
  var task = taskData[0];

  document.getElementById('item').value = task.item_name;
  document.getElementById('quantity').value = task.quantity;
  document.getElementById('username').value = task.username;
  document.getElementById('task_type').value = task.type;
  document.getElementById('status').value = task.status;
}