const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("solve", () => {
    test("valid str", done => {
      chai.request(server).post("/api/solve").send({puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."}).end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.solution, "135762984946381257728459613694517832812936745357824196473298561581673429269145378");
        done();
      });
    });

    test("missing str", done => {
      chai.request(server).post("/api/solve").send({}).end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.error, "Required field missing");
        done();
      });
    });

    test("invalid chars", done => {
      chai.request(server).post("/api/solve").send({puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914abcd"}).end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.error, "Invalid characters in puzzle");
        done();
      });
    });

    test("too short", done => {
      chai.request(server).post("/api/solve").send({puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16..."}).end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.error, "Expected puzzle to be 81 characters long");
        done();
      });
    });

    test("unsolvable", done => {
      chai.request(server).post("/api/solve").send({puzzle: "9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."}).end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.error, "Puzzle cannot be solved");
        done();
      });
    });
  });

  suite("check", () => {
    test("all fields", done => {
      chai.request(server).post("/api/check").send({puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", coordinate: "A2", value: "3"}).end((err, res) => {
        console.log(res.text);
        assert.strictEqual(res.status, 200);
        assert.isTrue(res.body.valid);
        done();
      });
    });

    test("single conflict", done => {
      chai.request(server).post("/api/check").send({puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", coordinate: "A2", value: "8"}).end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.include(res.body.conflict, "row");
        done();
      });
    });

    test("multi conflict", done => {
      chai.request(server).post("/api/check").send({puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", coordinate: "A2", value: "5"}).end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.include(res.body.conflict, "row");
        assert.include(res.body.conflict, "region");
        done();
      });
    });

    test("all conflict", done => {
      chai.request(server).post("/api/check").send({puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", coordinate: "A2", value: "2"}).end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.include(res.body.conflict, "row");
        assert.include(res.body.conflict, "column");
        assert.include(res.body.conflict, "region");
        done();
      });
    });
    
    test("missing fields", done => {
      chai.request(server).post("/api/check").send({}).end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.error, "Required field(s) missing");
        done();
      });
    });

    test("invalid chars", done => {
      chai.request(server).post("/api/check").send({puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914abcd", coordinate: "A2", value: "3"}).end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.error, "Invalid characters in puzzle");
        done();
      });
    });

    test("too short", done => {
      chai.request(server).post("/api/check").send({puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914", coordinate: "A2", value: "3"}).end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.error, "Expected puzzle to be 81 characters long");
        done();
      });
    });

    test("invalid coord", done => {
      chai.request(server).post("/api/check").send({puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", coordinate: "Z9", value: "3"}).end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.error, "Invalid coordinate");
        done();
      });
    });

    test("invalid val", done => {
      chai.request(server).post("/api/check").send({puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", coordinate: "A2", value: "tardigrade"}).end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.error, "Invalid value");
        done();
      });
    });
  });
});

