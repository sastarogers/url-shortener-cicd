const request = require("supertest");

const app = require("../app");

describe("URL Shortener API", () => {

    test("Health endpoint should return OK", async () => {

        const response =
            await request(app).get("/health");

        expect(response.statusCode).toBe(200);

        expect(response.body.status).toBe("OK");
    });


    test("Should create a short URL", async () => {

        const response =
            await request(app)
                .post("/shorten")
                .send({
                    url: "https://example.com"
                });

        expect(response.statusCode).toBe(201);

        expect(response.body.code).toBeDefined();

        expect(response.body.shortUrl).toContain("/r/");
    });


    test("Should reject invalid URLs", async () => {

        const response =
            await request(app)
                .post("/shorten")
                .send({
                    url: "this-is-not-a-url"
                });

        expect(response.statusCode).toBe(400);
    });

});