document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("chat-form");
    const input = document.getElementById("message-input");
    const chatBox = document.getElementById("chat-box");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const message = input.value.trim();
        if (!message) return;

        appendMessage("You", message, "user");

        const formData = new FormData();
        formData.append("message", message);
        formData.append("user", "tanmay@gmail.com")
        const response = await fetch("/get_message", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        appendMessage("Bot", data.reply, "bot");

        input.value = "";
    });

    function appendMessage(sender, text, className) {
        const msg = document.createElement("div");
        msg.classList.add(className);
        msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatBox.appendChild(msg);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

