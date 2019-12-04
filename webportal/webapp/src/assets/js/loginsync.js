function togglePassword(e1, e2) {
  e2.type === "password" ? e2.type = "text" : e2.type = "password";
  e2.type === "password" ? e1.innerHTML = "Show password" : e1.innerHTML = "Hide password";
}