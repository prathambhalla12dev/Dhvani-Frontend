const nameInput = document.getElementById("name")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const button = document.getElementById("loginBtn")
const result = document.getElementById("result")

const defaultName = "Pratham"
const defaultEmail = "prathambhalla12@gmail.com"
const defaultPassword = "PRATHAM@@#121127"

button.addEventListener("click", function () {
    if (
        nameInput.value === defaultName &&
        emailInput.value === defaultEmail &&
        passwordInput.value === defaultPassword
    ) {
        result.textContent = "Login successful"
    } else {
        result.textContent = "Invalid credentials"
    }
})