// script.js
document.addEventListener("DOMContentLoaded", function () {
  if (
    window.location.href ===
    "http://localhost/webproject/Code/Html/User/login_signup.html"
  ) {
    const loginPasswordField = document.getElementById("pass-login");
    const signupPasswordField = document.getElementById("pass-signup");
    const repeatPasswordField = document.getElementById("pass-repeat-signup");

    const toggleLoginPassword = document.getElementById("eye-pass-login");
    const toggleSignupPassword = document.getElementById("eye-pass-signup");
    const toggleRepeatPassword = document.getElementById("eye-repeat-signup");

    toggleLoginPassword.addEventListener("click", function () {
      togglePasswordVisibility(loginPasswordField, toggleLoginPassword);
    });

    toggleSignupPassword.addEventListener("click", function () {
      togglePasswordVisibility(signupPasswordField, toggleSignupPassword);
    });

    toggleRepeatPassword.addEventListener("click", function () {
      togglePasswordVisibility(repeatPasswordField, toggleRepeatPassword);
    });
  } else if (
    window.location.href ===
    "https://localhost/webproject/Code/Html/admin_profile_setting.html"
  ) {
    const OldPasswordField = document.getElementById("oldPassword");
    const NewPasswordField = document.getElementById("newPassword");
    const RepeatNewPasswordField = document.getElementById("RepeatNewPassword");

    const toggleOldPassword = document.getElementById("eye-old-password");
    const toggleNewPassword = document.getElementById("eye-new-password");
    const toggleRepeatNewPassword = document.getElementById(
      "eye-repeatNew-password"
    );

    toggleOldPassword.addEventListener("click", function () {
      togglePasswordVisibility(OldPasswordField, toggleOldPassword);
    });

    toggleNewPassword.addEventListener("click", function () {
      togglePasswordVisibility(NewPasswordField, toggleNewPassword);
    });

    toggleRepeatNewPassword.addEventListener("click", function () {
      togglePasswordVisibility(RepeatNewPasswordField, toggleRepeatNewPassword);
    });
  }
});

function togglePasswordVisibility(passwordField, toggleButton) {
  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleButton.classList.remove("fa-eye");
    toggleButton.classList.add("fa-eye-slash");
  } else {
    passwordField.type = "password";
    toggleButton.classList.remove("fa-eye-slash");
    toggleButton.classList.add("fa-eye");
  }
}
