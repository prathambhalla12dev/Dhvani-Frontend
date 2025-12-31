const nameInput = document.getElementById("name")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const button = document.getElementById("loginBtn")
const result = document.getElementById("result")

button.addEventListener("click", async function () {

    const payload = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value
    }

    try {
        const response = await fetch("http://localhost:8080/api/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })

        const data = await response.json()

        console.log("FULL RESPONSE:", data)

        if (data.status) {
            console.log("STATUS FIELD:", data.status)
        }

        if (data.status === "OK") {
            result.textContent = "Login successful! Welcome " + data.data.name
        } else {
            result.textContent = data.message || "Login failed"
        }

    } catch (error) {
        console.error(error)
        result.textContent = "Server error"
    }
})