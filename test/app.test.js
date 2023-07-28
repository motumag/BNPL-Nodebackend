const request = require("supertest");
const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();
describe("Payment Service Creation API", () => {
  it("should be conflict", (done) => {
    const newPaymentServices = {
      serviceName: "STRIPE",
    };

    chai
      .request(app)
      .post("/api/paymentService")
      .send(newPaymentServices)
      .end((req, res) => {
        res.should.have.status(409);
        res.body.should.be.a("object");
        done();
      });
  });
  it("should be bad request", (done) => {
    const newPaymentServices = {
      serviceName: "ASTRIPE",
    };

    chai
      .request(app)
      .post("/api/paymentService")
      .send(newPaymentServices)
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        done();
      });
  });

});
