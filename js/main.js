let shopBtn = document.getElementById("shopBtn");
let exploreBtn = document.getElementById("exploreBtn");

shopBtn.addEventListener("dblclick", () => {
    window.location.href = "shop/products.html";
});

exploreBtn.addEventListener("dblclick", () => {
    window.location.href = "game/level1.html";
});

let selectedVoice = null;   // ✅ yahi voice hamesha use hogi
let isSpeaking = false;

// Female voice choose and LOCK
speechSynthesis.onvoiceschanged = () => {
    const voices = speechSynthesis.getVoices();

    selectedVoice = voices.find(v =>
        v.name.includes("Google UK English Female") ||
        v.name.includes("Microsoft Zira") ||
        (v.lang.includes("en") && v.name.toLowerCase().includes("female"))
    );
};

// Speak function (only one voice forever)
function speak(text){
    if(isSpeaking || !selectedVoice) return;

    const msg = new SpeechSynthesisUtterance(text);
    msg.voice = selectedVoice;   // ✅ fixed voice
    msg.rate = 0.9;

    msg.onend = () => isSpeaking = false;
    isSpeaking = true;

    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
}

// Welcome बोले सिर्फ 1 बार
window.addEventListener("load", ()=>{
    setTimeout(()=>{
        speak("Welcome to this adventure. You are entering a new world.");
    }, 1500);
});

// Hover voice guide
shopBtn.addEventListener("mouseenter", ()=>{
    speak("This button will take you to the shop, where you can purchase amazing items.");
});

exploreBtn.addEventListener("mouseenter", ()=>{
    speak("Choose this path if you want to explore something new and adventurous.");
});
