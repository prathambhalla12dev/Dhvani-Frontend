document.addEventListener("DOMContentLoaded", () => {

    const comingSoonPopup = document.getElementById("comingSoonPopup")
    const closeBtn = document.getElementById("closePopup")
    const loginPopup = document.getElementById("loginPopup")

    const discover = document.getElementById("discoverLink")
    const premium = document.getElementById("premiumLink")
    const login = document.getElementById("loginLink")

    const loginForm = document.getElementById("loginForm")
    const loginError = document.getElementById("loginError")
    const loginEmail = document.getElementById("loginEmail")
    const loginPassword = document.getElementById("loginPassword")

    discover.addEventListener("click", e => {
        e.preventDefault()
        comingSoonPopup.classList.add("show")
    })

    premium.addEventListener("click", e => {
        e.preventDefault()
        comingSoonPopup.classList.add("show")
    })

    login.addEventListener("click", e => {
        e.preventDefault()
        loginPopup.classList.add("show")
    })

    closeBtn.addEventListener("click", () => {
        comingSoonPopup.classList.remove("show")
    })

    loginPopup.addEventListener("click", e => {
        if(e.target === loginPopup){
            loginPopup.classList.remove("show")
        }
    })

    loginForm.addEventListener("submit", async e => {
        e.preventDefault()
        loginError.innerText = "Logging in..."

        try{
            const res = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: loginEmail.value,
                    password: loginPassword.value
                })
            })

            const data = await res.json()

            if(res.ok){
                window.location.href = "dashboard.html"
            }else{
                loginError.innerText = data.error || "Invalid credentials"
            }
        }catch{
            loginError.innerText = "Server not reachable"
        }
    })

})