document.addEventListener("DOMContentLoaded", () => {

    const comingSoonPopup = document.getElementById("comingSoonPopup")
    const closeBtn = document.getElementById("closePopup")
    const loginPopup = document.getElementById("loginPopup")

    const discover = document.getElementById("discoverLink")
    const premium = document.getElementById("premiumLink")
    const login = document.getElementById("loginLink")
    const signup = document.getElementById("signupLink")

    const authForm = document.getElementById("authForm")
    const authTitle = document.getElementById("authTitle")
    const authBtn = document.getElementById("authBtn")
    const authError = document.getElementById("authError")
    const toggleAuth = document.getElementById("toggleAuth")
    const toggleText = document.getElementById("toggleText")
    const nameField = document.getElementById("nameField")
    const confirmField = document.getElementById("confirmField")

    const authName = document.getElementById("authName")
    const authEmail = document.getElementById("authEmail")
    const authPassword = document.getElementById("authPassword")
    const authConfirm = document.getElementById("authConfirm")

    let isSignup = false

    function parseApiResponse(json){
        return {
            successful: json.successful === true,
            message: json.message || "",
            status: json.status,
            data: json.data
        }
    }

    discover.onclick = e => { e.preventDefault(); comingSoonPopup.classList.add("show") }
    premium.onclick = e => { e.preventDefault(); comingSoonPopup.classList.add("show") }

    login.onclick = e => {
        e.preventDefault()
        isSignup = false
        updateUI()
        loginPopup.classList.add("show")
    }

    signup.onclick = e => {
        e.preventDefault()
        isSignup = true
        updateUI()
        loginPopup.classList.add("show")
    }

    closeBtn.onclick = () => comingSoonPopup.classList.remove("show")

    loginPopup.onclick = e => {
        if(e.target === loginPopup) loginPopup.classList.remove("show")
    }

    toggleAuth.onclick = e => {
        e.preventDefault()
        isSignup = !isSignup
        updateUI()
    }

    function updateUI(){
        if(isSignup){
            authTitle.innerText = "Create your Dhvani account"
            authBtn.innerText = "Sign Up"
            toggleText.innerText = "Already have an account?"
            toggleAuth.innerText = "Login"
            nameField.style.display = "block"
            confirmField.style.display = "block"
        }else{
            authTitle.innerText = "Login to Dhvani"
            authBtn.innerText = "Login"
            toggleText.innerText = "Don’t have an account?"
            toggleAuth.innerText = "Sign up"
            nameField.style.display = "none"
            confirmField.style.display = "none"
        }
    }

    authForm.onsubmit = async e => {
        e.preventDefault()

        authError.innerText = "Please wait..."

        if(isSignup && authPassword.value !== authConfirm.value){
            authError.innerText = "Passwords do not match"
            return
        }

        const url = isSignup
            ? "http://localhost:5000/api/user/signup"
            : "http://localhost:5000/api/user/login"

        const payload = isSignup
            ? {
                name: authName.value,
                email: authEmail.value,
                password: authPassword.value,
                confirmPassword: authConfirm.value
            }
            : {
                email: authEmail.value,
                password: authPassword.value
            }

        try{
            const res = await fetch(url,{
                method:"POST",
                headers:{ "Content-Type":"application/json" },
                body: JSON.stringify(payload)
            })

            const raw = await res.json()
            const api = parseApiResponse(raw)

            if(api.successful === true){
                window.location.href = "dashboard.html"
            }else{
                authError.innerText = api.message || "Authentication failed"
            }

        }catch{
            authError.innerText = "Server not reachable"
        }
    }

})