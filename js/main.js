document.addEventListener("DOMContentLoaded", () => {
    // Hace que el fondo del hero coincida con el fondo de la imagen del personaje
    // (evita que se note el recuadro). Si falla, se usa el color definido en el CSS.
    const heroImg = document.querySelector(".hero-image img");
    const syncHeroColor = () => {
        try {
            const c = document.createElement("canvas");
            c.width = c.height = 1;
            const ctx = c.getContext("2d");
            ctx.drawImage(heroImg, 2, 2, 1, 1, 0, 0, 1, 1);
            const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
            if (a === 255) document.documentElement.style.setProperty("--bg-hero", `rgb(${r}, ${g}, ${b})`);
        } catch (e) { /* canvas bloqueado (file://): se mantiene el color del CSS */ }
    };
    if (heroImg) heroImg.complete ? syncHeroColor() : heroImg.addEventListener("load", syncHeroColor);
});

// Enlaces que copian un dato al portapapeles (p. ej. usuario de Discord)
document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-copy]");
    if (!el) return;
    e.preventDefault();
    const text = el.dataset.copy;
    const done = () => {
        let toast = document.querySelector(".toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.className = "toast";
            toast.setAttribute("role", "status");
            document.body.appendChild(toast);
        }
        toast.textContent = `${el.dataset.label || "Texto"} copiado: ${text}`;
        toast.classList.add("show");
        clearTimeout(toast._t);
        toast._t = setTimeout(() => toast.classList.remove("show"), 2200);
    };
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(done).catch(() => {
        window.prompt("Copia el usuario:", text);
    });
});