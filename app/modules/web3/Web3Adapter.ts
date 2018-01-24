import { BigNumber } from "bignumber.js";
import { promisify } from "bluebird";
import * as Web3 from "web3";

export class Web3Adapter {
  constructor(public readonly web3: Web3) {}

  public async getNetworkId(): Promise<string> {
    return promisify<string>(this.web3.version.getNetwork)();
  }

  public async getBalance(address: string): Promise<BigNumber> {
    return promisify<BigNumber, string>(this.web3.eth.getBalance)(address);
  }

  public async getAccountAddress(): Promise<string> {
    const getAccounts = promisify<string[]>(this.web3.eth.getAccounts);
    const accounts = await getAccounts();
    return accounts[0];
  }
}