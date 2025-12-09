let bookmark = null;
let lastJumpWasToBookmark = false;

let leftClickDown = false;
let rightClickDown = false;

// Prevent default context menu so right + left works cleanly
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
}, true);

// Prevent Chrome auto-scroll on middle click
document.addEventListener("mousedown", (e) => {
    if (e.button === 1) {
        e.preventDefault();
        e.stopPropagation();
    }
}, true);

// Detect ChatGPT scroll container
function getChatContainer() {
    let box = document.querySelector("main .overflow-y-auto, main div[slot='messages']");
    if (box) return box;

    let candidates = Array.from(document.querySelectorAll("div"))
        .filter(d => d.scrollHeight > d.clientHeight + 50);

    if (candidates.length > 0) {
        candidates.sort((a, b) => b.scrollHeight - a.scrollHeight);
        return candidates[0];
    }

    return null;
}

// Create bookmark
function createBookmark() {
    const box = getChatContainer();
    if (!box) return;

    bookmark = box.scrollTop;
    lastJumpWasToBookmark = false;

    showToast("📌 NEW Bookmark Set!");
}

// Track button presses
document.addEventListener("mousedown", (e) => {
    if (e.button === 0) leftClickDown = true;     // Left
    if (e.button === 2) rightClickDown = true;    // Right

    // If both pressed at same time → new bookmark
    if (leftClickDown && rightClickDown) {
        createBookmark();
    }
}, true);

document.addEventListener("mouseup", (e) => {
    if (e.button === 0) leftClickDown = false;
    if (e.button === 2) rightClickDown = false;

    // Middle-click handler (jumping)
    if (e.button === 1) {
        const box = getChatContainer();
        if (!box) return;

        if (bookmark === null) {
            createBookmark();
            return;
        }

        if (lastJumpWasToBookmark) {
            box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
            lastJumpWasToBookmark = false;
            showToast("⬇️ Bottom");
        } else {
            box.scrollTo({ top: bookmark, behavior: "smooth" });
            lastJumpWasToBookmark = true;
            showToast("📍 Jumped to Bookmark");
        }
    }
}, true);

// Toast popup
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
