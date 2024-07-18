const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const form = document.getElementById("form-login");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const response = await fetch ("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value
        })    
    })

    if (response.ok) {
        const result = await response.json();
        localStorage.setItem("token", result.token);
        window.location.href = "./index.html";
        return;
    }

    else if (response.status === 401 || response.status === 404) {
        alert("Identifiant incorrect", response.statusText);
    }

})
