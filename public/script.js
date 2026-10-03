const form = document.getElementById("urlForm");

const input = document.getElementById("urlInput");

const result = document.getElementById("result");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    result.textContent = "Creating short URL...";

    try {

        const response = await fetch("/shorten", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                url: input.value
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        const shortUrl =
            `${window.location.origin}${data.shortUrl}`;

        result.innerHTML = `
            Short URL:
            <a href="${shortUrl}" target="_blank">
                ${shortUrl}
            </a>
        `;

    } catch (error) {

        result.textContent = error.message;

    }

});