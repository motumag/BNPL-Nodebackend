const app = require("../index");
const request = require("supertest");
const { expect } = require("chai");

describe("Access Control Middleware Integration Test", () => {
  it("should allow access to the protected route with a valid Token", (done) => {
    const validToken = "your_secret_api_key";
    request(app)
      .get("/api/items/getAll")
      .set("Authorization", validToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // expect(res.body).to.deep.equal({
        //   message: "Access granted! This is a protected route.",
        // });
        done();
      });
  });

  it("should deny access to the protected route with an invalid API key", (done) => {
    const invalidToken = "invalid_api_key";
    request(app)
      .get("/api/items/getAll")
      .set("Authorization", invalidToken)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
