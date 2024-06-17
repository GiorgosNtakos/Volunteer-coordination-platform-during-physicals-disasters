// * Header call function in HTML pages where need it

$(document).ready(function () {
  // Load common.html content into #commonContent div
  $("#Header").load("../../Html/Global/Header.html", function() {
    updateHeaderTitle(); // Εκτελέστε μετά την φόρτωση του Header
    getHeaderUserInfo();
  });
});

function updateHeaderTitle() {
  const pageTitles = {
    'index_page.html': 'Αρχική Σελίδα',
    'map.html': 'Χάρτης',
    'upload_products.html': 'Διαχείριση Ειδών',
    'form_completion.html': 'Δημιουργία Διασώστη/Οχήματος',
    'user_profile_settings.html': 'Επεξεργασία Προφίλ',
    'admin_announcements.html': 'Διαχείριση Ανακοινώσεων',
    'cargo_page.html': 'Διαχείριση Φορτίου Οχήματος',
    'offers_page.html': 'Διαχείριση Προσφορών',
    'personal_info_form.html': 'Υποχρεωτική Φόρμα Προσωπικών στοιχείων',
    'request_page.html': 'Διαχείριση Αιτήσεων',
    'choose_vehicle.html':'Επιλογή Οχήματος',
    'statistics.html':'Στατιστικά'
  };

  const pathname = window.location.pathname.split("/").pop();
  const headerTitle = pageTitles[pathname] || 'Προεπιλεγμένος Τίτλος';
  $('.header-center h1').text(headerTitle);
}


function getHeaderUserInfo(){

  var userNameElement = document.getElementById("userName");
  var userImageElement = document.getElementById("userImage");
  $.ajax({
    url: "../../PHP/Global/user_header.php",
    method: "GET",
    success: function (response) {
      if (response.status === "success") {
        userNameElement.textContent = response.username.replace("_", " ");
        userImageElement.src = response.img_path || "../../../upload_img/global/user.png";
        updateNavItems(response.type);
        console.log("Απάντηση από τον διακομιστή:", response);
      } else {
        window.location.href = "../../HTML/Global/login_signup.html";
        showMessage(
          "error-message",
          "Ενώ η ανάκτηση στοιχείων ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ συνδεθείτε ξανά.",
          "userName"
        );
      }
    },
    error: function (response) {
      var errorResponse = JSON.parse(response.responseText);

      if (errorResponse.status === "need_connection") {
        window.location.href = "../../HTML/Global/login_signup.html";
        showMessage("error-message", errorResponse.message, "userName");
      } else if (errorResponse.status === "wrong_method_405") {
        showMessage("error-message", errorResponse.message, "userName");
      } else {
        showMessage(
          "error-message",
          "Σφάλμα κατά την διάρκεια φόρτωσης των στοιχείων. Παρακαλώ συνδεθείτε ξανά.",
          "userName"
        );
      }
    },
  });
}

function updateNavItems(userType) {
  const navItems = {
    'Admin': {
      'index_page.html': [
        { text: 'Χάρτης', href: '../../HTML/Admin/map.html' },
        { text: 'Αποθήκη', href: '../../HTML/Admin/upload_products.html' },
        { text: 'Διασώστες/Οχήματα', href: '../../HTML/Admin/form_completion.html' },
        { text: 'Στατιστικά', href: '../../HTML/Admin/statistics.html' },
        { text: 'Ανακοινώσεις', href: '../../HTML/Admin/admin_announcements.html' }
      ],
      'map.html': [
        { text: 'Αρχική Σελίδα', href: '../../HTML/Global/index_page.html' },
        { text: 'Αποθήκη', href: '../../HTML/Admin/upload_products.html' },
        { text: 'Διασώστες/Οχήματα', href: '../../HTML/Admin/form_completion.html' },
        { text: 'Στατιστικά', href: '../../HTML/Admin/statistics.html' },
        { text: 'Ανακοινώσεις', href: '../../HTML/Admin/admin_announcements.html' }
      ],
      'upload_products.html': [
        { text: 'Αρχική Σελίδα', href: '../../HTML/Global/index_page.html' },
        { text: 'Χάρτης', href: '../../HTML/Admin/map.html' },
        { text: 'Διασώστες/Οχήματα', href: '../../HTML/Admin/form_completion.html' },
        { text: 'Στατιστικά', href: '../../HTML/Admin/statistics.html' },
        { text: 'Ανακοινώσεις', href: '../../HTML/Admin/admin_announcements.html' }
      ],
      'form_completion.html':[
        { text: 'Αρχική Σελίδα', href: '../../HTML/Global/index_page.html' },
        { text: 'Χάρτης', href: '../../HTML/Admin/map.html' },
        { text: 'Αποθήκη', href: '../../HTML/Admin/upload_products.html' },
        { text: 'Στατιστικά', href: '../../HTML/Admin/statistics.html' },
        { text: 'Ανακοινώσεις', href: '../../HTML/Admin/admin_announcements.html' }
      ],
      'statistics.html':[
        { text: 'Αρχική Σελίδα', href: '../../HTML/Global/index_page.html' },
        { text: 'Χάρτης', href: '../../HTML/Admin/map.html' },
        { text: 'Αποθήκη', href: '../../HTML/Admin/upload_products.html' },
        { text: 'Διασώστες/Οχήματα', href: '../../HTML/Admin/form_completion.html' },
        { text: 'Ανακοινώσεις', href: '../../HTML/Admin/admin_announcements.html' }
      ],
      'admin_announcements.html':[
        { text: 'Αρχική Σελίδα', href: '../../HTML/Global/index_page.html' },
        { text: 'Χάρτης', href: '../../HTML/Admin/map.html' },
        { text: 'Αποθήκη', href: '../../HTML/Admin/upload_products.html' },
        { text: 'Διασώστες/Οχήματα', href: '../../HTML/Admin/form_completion.html' },
        { text: 'Στατιστικά', href: '../../HTML/Admin/statistics.html' }
      ]
    },
    'Rescuer': {
      'index_page.html': [
        { text: 'Χάρτης', href: '../../HTML/Rescuer/map.html' },
        { text: 'Φορτίο', href: '../../HTML/Rescuer/cargo_page.html' },
        { text: 'Όχημα', href: '../../HTML/Rescuer/choose_vehicle.html' }
      ],
      'cargo_page.html': [
        { text: 'Αρχική Σελίδα', href: '../../HTML/Global/index_page.html' },
        { text: 'Χάρτης', href: '../../HTML/Rescuer/map.html' },
        { text: 'Όχημα', href: '../../HTML/Rescuer/choose_vehicle.html' }
      ],
      'map.html':[
        { text: 'Αρχική Σελίδα', href: '../../HTML/Global/index_page.html' },
        { text: 'Φορτίο', href: '../../HTML/Rescuer/cargo_page.html' },
        { text: 'Όχημα', href: '../../HTML/Rescuer/choose_vehicle.html' }
      ],
      'choose_vehicle.html':[
        { text: 'Αρχική Σελίδα', href: '../../HTML/Global/index_page.html' },
        { text: 'Φορτίο', href: '../../HTML/Rescuer/cargo_page.html' },
        { text: 'Χάρτης', href: '../../HTML/Rescuer/map.html' }
      ]
    },
    'Citizen':{
      'index_page.html':[
        { text: 'Αιτήσεις', href: '../../HTML/User/request_page.html' },
        { text: 'Προσφορές', href: '../../HTML/User/offers_page.html' }
      ],
      'request_page.html':[
        { text: 'Αρχική Σελίδα', href: '../../HTML/Global/index_page.html' },
        { text: 'Προσφορές', href: '../../HTML/User/offers_page.html' }
      ],
      'offers_page.html':[
        { text: 'Αρχική Σελίδα', href: '../../HTML/Global/index_page.html' },
        { text: 'Αιτήσεις', href: '../../HTML/User/request_page.html' }
      ]
    }
  };

  const pathname = window.location.pathname.split("/").pop();
  const items = (navItems[userType] && navItems[userType][pathname]) || [];
  const navList = $('#nav-items');
  navList.empty(); // Καθαρίζει τα υπάρχοντα στοιχεία

  items.forEach(item => {
    const listItem = `<li><a href="${item.href}">${item.text}</a></li>`;
    navList.append(listItem);
  });
}
