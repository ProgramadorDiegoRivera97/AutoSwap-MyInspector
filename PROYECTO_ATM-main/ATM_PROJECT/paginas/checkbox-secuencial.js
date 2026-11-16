(() => {
    const casillas = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    if (casillas.length === 0) return;
    const claveFinalizacion = document.body.dataset.completionKey;
    const finalizacionGuardada = claveFinalizacion
        && sessionStorage.getItem(claveFinalizacion) === "completada";

    const botonFinalizar = Array.from(document.querySelectorAll(".boton-custom")).find(boton =>
        /finish|continue/i.test(boton.textContent)
    );
    const enlaceFinalizar = botonFinalizar && (
        botonFinalizar.closest("a") ||
        (botonFinalizar instanceof HTMLAnchorElement ? botonFinalizar : null)
    );
    let actualizacionPorCambio = false;

    function actualizarSecuencia() {
        casillas.forEach((casilla, indice) => {
            casilla.disabled = indice > 0 && !casillas[indice - 1].checked;
            if (casilla.disabled) casilla.checked = false;
        });

        const completa = casillas.every(casilla => casilla.checked);
        if (claveFinalizacion) {
            if (completa) {
                sessionStorage.setItem(claveFinalizacion, "completada");
            } else if (actualizacionPorCambio) {
                sessionStorage.removeItem(claveFinalizacion);
            }
        }

        if (!botonFinalizar) return;

        botonFinalizar.classList.toggle("disabled", !completa);
        botonFinalizar.setAttribute("aria-disabled", String(!completa));

        if (botonFinalizar instanceof HTMLButtonElement) {
            botonFinalizar.disabled = !completa;
        } else if (completa) {
            botonFinalizar.removeAttribute("tabindex");
        } else {
            botonFinalizar.setAttribute("tabindex", "-1");
        }
    }

    casillas.forEach(casilla => {
        casilla.addEventListener("change", () => {
            actualizacionPorCambio = true;
            actualizarSecuencia();
        });
    });

    if (botonFinalizar) {
        const bloquearFinalizacion = event => {
            if (casillas.some(casilla => !casilla.checked)) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        botonFinalizar.addEventListener("click", bloquearFinalizacion);
        if (enlaceFinalizar && enlaceFinalizar !== botonFinalizar) {
            enlaceFinalizar.addEventListener("click", bloquearFinalizacion);
        }
    }

    if (finalizacionGuardada) {
        casillas.forEach(casilla => { casilla.checked = true; });
    }
    actualizarSecuencia();
})();
