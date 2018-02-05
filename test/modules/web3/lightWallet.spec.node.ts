import { expect } from "chai";
import {
  createNewLightWallet,
  deserializeLightWallet,
  getWalletKey,
} from "../../../app/modules/web3/LightWallet";
import { expectToBeRejected } from "../../testUtils";

describe("LightWallet", () => {
  const hdPathString = "m/44'/60'/0'";
  const password = "password";
  const customSalt = "salt";
  const expectedSeed =
    "author foster awkward faint script unique letter tag meadow garment elite drip";

  describe("Create LightWallet", () => {
    it("should create a new serialized wallet", async () => {
      const serializedLightWallet = await createNewLightWallet({
        password,
        hdPathString,
        customSalt,
      });

      expect(serializedLightWallet.walletInstance).to.deep.include("addresses");
      expect(serializedLightWallet.walletInstance).to.deep.include("encHdRootPriv");
      expect(serializedLightWallet.walletInstance).to.deep.include("encPrivKeys");
      expect(serializedLightWallet.walletInstance).to.deep.include("encSeed");
      expect(serializedLightWallet.walletInstance).to.deep.include("hdIndex");
      expect(serializedLightWallet.walletInstance).to.deep.include("hdPathString");
      expect(serializedLightWallet.salt).to.equal("salt");
    });

    it("should deserialize a lightWallet instance", async () => {
      const walletInstance = (await createNewLightWallet({
        password,
        hdPathString,
      })).walletInstance;
      const deserializedInstance = await deserializeLightWallet(walletInstance, "salt");
      //TODO: change test to equal see  https://github.com/Neufund/eth-lightwallet/issues/3
      expect(deserializedInstance).to.deep.include(JSON.parse(walletInstance));
    });
  });

  describe("Recover LightWallet", () => {
    it("should recover a 24 word mnemonic and generate a nano compatible BIP39", async () => {
      const recoverSeed =
        "butter clean pledge exist gym busy shove pyramid cereal bird unique bar anger hazard weapon shoe clog possible spider convince object mind beef music";
      const expectedAddress = "07dc3a64a5fd98d23776c54f02c53d0a28b61515";

      const lightWalletObject = await createNewLightWallet({
        password,
        hdPathString,
        recoverSeed,
      });
      const walletInstance = JSON.parse(lightWalletObject.walletInstance);

      expect(walletInstance.addresses[0]).to.equal(expectedAddress);
    });

    it("should recover a 12 word mnemonic and a BIP44 compatible derivation path", async () => {
      const recoverSeed =
        "author foster awkward faint script unique letter tag meadow garment elite drip";
      const expectedAddress = "47fde38dc660f9d935c41b4f3a2a6e62d2e823eb";

      const lightWalletObject = await createNewLightWallet({
        password,
        hdPathString,
        recoverSeed,
      });
      const walletInstance = JSON.parse(lightWalletObject.walletInstance);

      expect(walletInstance.addresses[0]).to.equal(expectedAddress);
    });
  });

  describe("Unlock/Use LightWallet", () => {
    it("should unlock the lightwallet if salt and password are correct", async () => {
      const walletInstance = (await createNewLightWallet({
        password,
        hdPathString,
        recoverSeed: expectedSeed,
        customSalt,
      })).walletInstance;
      const deserializedInstance = await deserializeLightWallet(walletInstance, customSalt);
      const obtainedSeed = deserializedInstance.getSeed(
        await getWalletKey(deserializedInstance, password),
      );

      expect(obtainedSeed).to.equal(expectedSeed);
    });

    it("should throw if salt is not correct", async () => {
      const walletInstance = (await createNewLightWallet({
        password,
        hdPathString,
        recoverSeed: expectedSeed,
        customSalt,
      })).walletInstance;
      const deserializedInstance = await deserializeLightWallet(walletInstance, "wrongsalt");

      await expectToBeRejected(
        async () => deserializedInstance.getSeed(await getWalletKey(deserializedInstance, "test")),
        new Error("Incorrect derived key!"),
      );
    });

    it("should throw if password is not correct", async () => {
      const walletInstance = (await createNewLightWallet({
        password,
        hdPathString,
        recoverSeed: expectedSeed,
        customSalt,
      })).walletInstance;
      const deserializedInstance = await deserializeLightWallet(walletInstance, "salt");

      await expectToBeRejected(
        async () =>
          deserializedInstance.getSeed(await getWalletKey(deserializedInstance, "wrongpassword")),
        new Error("Incorrect derived key!"),
      );
    });
  });
});
