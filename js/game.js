let btn = document.getElementById("runBtn");

btn.addEventListener("mouseover", () => {
    let x = Math.random() * (window.innerWidth - 150);
    let y = Math.random() * (window.innerHeight - 80);

    btn.style.left = x + "px";
    btn.style.top = y + "px";
});

btn.addEventListener("click", () => {
    alert("Level 1 Complete 😎");
    window.location.href = "level2.html";
});
