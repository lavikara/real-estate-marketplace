const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const Verifier = artifacts.require("Verifier");
const Proof = require("../../zokrates/code/square/proof.json");

contract("TestSolnSquareVerifier", (accounts) => {
  let account_one = accounts[0];
  let account_two = accounts[1];
  let account_three = accounts[2];
  let {
    proof: { a, b, c },
    inputs,
  } = Proof;

  describe("SolnSquareVerifier Test", function () {
    before(async function () {
      this.verifier = await Verifier.new({ from: account_one });
      this.contract = await SolnSquareVerifier.new(this.verifier.address, {
        from: account_one,
      });
    });

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it("should mint token for contract", async function () {
      await this.contract.mintToken(account_two, 2, a, b, c, inputs, {
        from: account_one,
      });
      let key = await this.contract.generateKey(a, b, c, inputs);
      let solutionOwner = await this.contract.getSolution(key);

      assert.equal(solutionOwner, account_two, "token was not minted");
    });

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it("should add new solution", async function () {
      let key = await this.contract.generateKey.call(a, b, c, inputs);
      let solutionOwner = await this.contract.getSolution.call(key);

      assert.equal(solutionOwner, account_two, "solution was not added");
    });

    it("should not mint if proof has already been used", async function () {
      let failed = false;
      try {
        await this.contract.mintToken(account_three, 3, a, b, c, inputs, {
          from: account_one,
        });
      } catch (error) {
        if (error) failed = true;
      }

      assert.equal(failed, true, "token minting should fail");
    });
  });
});
