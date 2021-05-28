import { utils, KeyPair } from 'near-api-js';
import getConfig from './config.js';

const nearConfig = getConfig(process.env.NODE_ENV || 'testnet');
const minAmount = 0.0001; // less than this amount cause sweep error

class PaperWallet {
  constructor(props) {
    const { near, wallet } = props;
    this.api = near;
    this.wallet = wallet;
  }

  async balance(paperId, privateKey) {
    const account = this.wallet.account();
    const keyStore = account.connection.signer.keyStore;
    const keyPair = KeyPair.fromString(privateKey);
    await keyStore.setKey(nearConfig.networkId, paperId, keyPair);
    const paperAccount = await this.api.account(paperId);
    const balance = await paperAccount.getAccountBalance();
    return balance.available;
  }

  async sweep(paperId, privateKey, receiver) {
    try {
      const account = this.wallet.account();
      const keyStore = account.connection.signer.keyStore;
      const keyPair = KeyPair.fromString(privateKey);
      await keyStore.setKey(nearConfig.networkId, paperId, keyPair);
      const paperAccount = await this.api.account(paperId);
      const balance = await paperAccount.getAccountBalance();
      console.log(`balance: ${JSON.stringify(balance.available, null, 2)}`);
      const numericBalance = utils.format.formatNearAmount(
        balance.available,
        6
      );
      if (numericBalance < minAmount) throw new Error('Not enough funds');
      const sendAmount = utils.format.parseNearAmount(
        (numericBalance - minAmount).toString()
      );
      const result = await paperAccount.sendMoney(receiver, sendAmount);
      // console results
      console.log('Transaction Results: ', result.transaction);
    } catch (error) {
      throw error;
    }
  }
}

export default PaperWallet;
