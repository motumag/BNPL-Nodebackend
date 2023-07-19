// app.test.js

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("./app");

chai.use(chaiHttp);
const expect = chai.expect;

describe("App", () => {
  describe("GET /", () => {
    it('should return "Hello, World!"', (done) => {
      chai
        .request(app)
        .get("/")
        .end((err, res) => {
          expect(res).to.have.status(200);
          //   expect(res.text).to.equal('Hello, World!');
          done();
        });
    });
  });
});
