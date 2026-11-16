document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#form");
    const loginButton = document.querySelector("#btn");

    if (form && loginButton) {
        const validateLogin = function () {
            loginButton.disabled = !form.user.value || !form.password.value;
        };

        form.addEventListener("input", validateLogin);
        validateLogin();
    }

    const vehicleRadios = document.querySelectorAll('input[name="tipoVehiculo"]');
    const continueButton = document.getElementById("btnContinuar");
    if (vehicleRadios.length === 0 || !continueButton) return;

    const destinations = {
        motocicleta: "TodoMotos/pre-checking.html",
        sencillo: "TodoSencillo/pre-checking.html",
        "llanta-doble": "TodoLlantaDoble/pre-checking.html"
    };

    function updateContinueButton() {
        const selectedVehicle = document.querySelector('input[name="tipoVehiculo"]:checked');
        continueButton.disabled = !selectedVehicle;
        continueButton.setAttribute("aria-disabled", String(!selectedVehicle));
    }

    vehicleRadios.forEach(function (radio) {
        radio.addEventListener("change", updateContinueButton);
    });

    continueButton.addEventListener("click", function () {
        const selectedVehicle = document.querySelector('input[name="tipoVehiculo"]:checked');
        if (!selectedVehicle || !destinations[selectedVehicle.value]) return;

        sessionStorage.setItem("atm:tipoVehiculo", selectedVehicle.value);
        window.location.href = new URL(destinations[selectedVehicle.value], document.baseURI).href;
    });

    updateContinueButton();
});
