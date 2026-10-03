const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();

const DATA_DIR = process.env.DATA_DIR || __dirname;
const DATA_FILE = path.join(DATA_DIR, "urls.json");

function loadUrls() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return {};
        }

        return JSON.parse(
            fs.readFileSync(DATA_FILE, "utf8")
        );
    } catch {
        return {};
    }
}

function saveUrls(urls) {
    fs.mkdirSync(DATA_DIR, { recursive: true });

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(urls, null, 2)
    );
}

app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK"
    });
});

app.post("/shorten", (req, res) => {

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            error: "URL is required"
        });
    }

    try {

        const parsed = new URL(url);

        if (
            !["http:", "https:"].includes(
                parsed.protocol
            )
        ) {
            return res.status(400).json({
                error: "Only HTTP and HTTPS URLs are allowed"
            });
        }

    } catch {

        return res.status(400).json({
            error: "Invalid URL"
        });

    }

    const code =
        crypto.randomBytes(4).toString("hex");

    const urls = loadUrls();

    urls[code] = url;

    saveUrls(urls);

    res.status(201).json({
        code,
        shortUrl: `/r/${code}`
    });
});

app.get("/r/:code", (req, res) => {

    const urls = loadUrls();

    const originalUrl =
        urls[req.params.code];

    if (!originalUrl) {
        return res
            .status(404)
            .send("Short URL not found");
    }

    res.redirect(302, originalUrl);
});

module.exports = app;