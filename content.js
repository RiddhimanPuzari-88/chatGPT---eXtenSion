let bookmark = null;
let lastJumpWasToBookmark = false;

// Prevent Chrome middle-click auto-scroll
document.addEventListener("mousedown", (e) => {
    if (e.button === 1) {
        e.preventDefault();
        e.stopPropagation();
    }
}, true);

// Strong ChatGPT scroll container detector
function getChatContainer() {
    // Try official ChatGPT containers first
    let box = document.querySelector("main .overflow-y-auto, main div[slot='messages']");
    if (box) return box;

    // Automatic fallback: find largest scrollable DIV
    let candidates = Array.from(document.querySelectorAll("div"))
        .filter(d => d.scrollHeight > d.clientHeight + 50);

    if (candidates.length > 0) {
        candidates.sort((a, b) => b.scrollHeight - a.scrollHeight);
        return candidates[0];
    }

    return null;
}

// Middle-click handler
document.addEventListener("mouseup", (e) => {
    if (e.button !== 1) return;

    e.preventDefault();
    e.stopPropagation();

    const box = getChatContainer();
    if (!box) {
        showToast("❗ Chat container not found");
        return;
    }

    // CASE 1 — Bookmark not set yet
    if (bookmark === null) {
        bookmark = box.scrollTop;
        showToast("📌 Bookmark set!");
        return;
    }

    // CASE 2 — Toggle jumping
    if (lastJumpWasToBookmark) {
        box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
        lastJumpWasToBookmark = false;
        showToast("⬇️ Jumped to bottom");
    } else {
        box.scrollTo({ top: bookmark, behavior: "smooth" });
        lastJumpWasToBookmark = true;
        showToast("📍 Jumped to bookmark");
    }
}, true);

// Toast popup function
function showToast(text) {
    const toast = document.createElement("div");
    toast.innerText = text;

    Object.assign(toast.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "10px 15px",
        background: "#222",
        color: "#fff",
        borderRadius: "8px",
        fontSize: "14px",
        zIndex: "999999",
        opacity: "0",
        transition: "opacity 0.3s"
    });

    document.body.appendChild(toast);

    setTimeout(() => (toast.style.opacity = "1"), 10);

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 1000);
}
