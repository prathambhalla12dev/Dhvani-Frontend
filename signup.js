const form = document.querySelector("form")
const message = document.getElementById("formMessage")

form.addEventListener("submit", async e => {
    e.preventDefault()

    message.style.opacity = "1"
    message.style.maxHeight = "40px"
    message.innerText = "Creating account..."
    message.style.color = "#ff9f43"

    const inputs = form.querySelectorAll("input")

    const data = {
        name: inputs[0].value.trim(),
        email: inputs[1].value.trim(),
        password: inputs[2].value,
        confirmPassword: inputs[3].value
    }

    try{
        const res = await fetch("http://localhost:5000/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const result = await res.json()

        if(res.ok){
            message.innerText = result.message || "Account created successfully"
            message.style.color = "#00ff9c"
            form.reset()
        }else{
            message.innerText = result.error || "Signup failed"
            message.style.color = "#ff4d4d"
        }
    }catch{
        message.innerText = "Server not reachable"
        message.style.color = "#ff4d4d"
    }
})