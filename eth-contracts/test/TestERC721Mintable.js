var ERC721Mintable = artifacts.require("ERC721Mintable");

contract("TestERC721Mintable", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  const account_three = accounts[2];

  describe("match erc721 spec", function () {
    beforeEach(async function () {
      this.contract = await ERC721Mintable.new({ from: account_one });

      // TODO: mint multiple tokens
      await this.contract.mint(account_one, 1, { from: account_one });
      await this.contract.mint(account_one, 2, { from: account_one });
      await this.contract.mint(account_two, 3, { from: account_one });
      await this.contract.mint(account_two, 4, { from: account_one });
      await this.contract.mint(account_two, 5, { from: account_one });
    });

    it("should return total supply", async function () {
      let totalSupply = await this.contract.totalSupply();

      assert.equal(totalSupply, 5, "Total supply should be 5");
    });

    it("should get token balance", async function () {
      let balanceAccOne = await this.contract.balanceOf(account_one);
      let balanceAccTwo = await this.contract.balanceOf(account_two);

      assert.equal(balanceAccOne, 2, "account one should have a balance of 2");
      assert.equal(balanceAccTwo, 3, "account two should have a balance of 3");
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function () {
      let uriOne =
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1";
      let uriFour =
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/4";
      let tokenURIOne = await this.contract.tokenURI(1);
      let tokenURIFour = await this.contract.tokenURI(4);

      assert.equal(tokenURIOne, uriOne, "invalid token uri");
      assert.equal(tokenURIFour, uriFour, "invalid token uri");
    });

    it("should transfer token from one owner to another", async function () {
      await this.contract.transferFrom(account_two, account_three, 5, {
        from: account_two,
      });
      let balanceAccThree = await this.contract.balanceOf(account_three);

      assert.equal(balanceAccThree, 1, "token was not transfered");
    });
  });

  describe("have ownership properties", function () {
    beforeEach(async function () {
      this.contract = await ERC721Mintable.new({ from: account_one });
    });

    it("should fail when minting address is not contract owner", async function () {
      let failed = false;
      try {
        await this.contract.mint(account_one, 1, { from: account_two });
      } catch (error) {
        if (error) failed = true;
      }

      assert.equal(failed, true, "only owner should be able to mint tokens");
    });

    it("should return contract owner", async function () {
      let owner = await this.contract.owner.call();

      assert.equal(
        owner,
        account_one,
        "contract owner is not the equal to accounts[0]"
      );
    });
  });
});
