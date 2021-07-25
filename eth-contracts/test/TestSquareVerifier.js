const Verifier = artifacts.require("Verifier");
const Proof = require("../../zokrates/code/square/proof1.json");

contract("TestSquareVerifier", (accounts) => {
  let account_one = accounts[0];
  let {
    proof: { a1, b1, c1 },
    inputs1,
  } = Proof;

  describe("Verifier Test", function () {
    beforeEach(async function () {
      this.contract = await Verifier.new({ from: account_one });
    });

    // Test verification with correct proof
    // - use the contents from proof.json generated from zokrates steps
    it("should verify correct proof", async function () {
      let verify = await this.contract.verifyTx.call(a1, b1, c1, inputs1);

      assert.equal(verify, true, "verification of correct proof failed");
    });

    // Test verification with incorrect proof
    it("should not verify incorrect proof", async function () {
      let verify = await this.contract.verifyTx.call(a1, b1, c1, [
        "0x0000000000000000000000000000000000000000000000000000000000000008",
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      ]);

      assert.equal(verify, false, "verification of incorrect proof passed");
    });
  });
});
