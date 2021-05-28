# NEAR paper wallets sweeper

[Paper Wallets](https://privacypros.io/wallets/paper/) are great way to onboard new users.
They are also a great way to save funds off-chain (cold storage).

Technically it is not a difficult task - just **two QR codes with public and private key**. However some sweeping functionality need to be added to the real wallets.

Current application will read the secret QR code of NEAR paper wallets, created for example with [NEAR Paper Wallets Generator](https://github.com/zh/near-paper-web), and send the funds to some NEAR account.


## Used libraries and services

The paper wallet sweeper is implemented as a SPA React application. Used libraries:

- [near-api-js](https://github.com/near/near-api-js) - A JavaScript/TypeScript library for development of DApps on the NEAR platform
- [react-st-modal](https://github.com/Nodlik/react-st-modal) - A simple and flexible library for implementing modal dialogs.
- [react-qr-reader](https://github.com/JodusNodus/react-qr-reader) - A React component for reading QR codes from the webcam. 


## Installation

```sh
git clone https://github.com/zh/near-paper-sweep
cd near-paper-sweep
yarn install
```

## Usage

Start the application with

```sh
yarn start
```

You can also build it as static HTML pages (for example from deploying on IPFS):

```
yarn build
```

On visit to the front page a text box for the **receiver account** (will get it from the real wallet in the future) and a button to scan QR codes are available.

Clicking on **'Scan QR code'** will open QR reader modal dialog. Scan the **secret QR code** of your paper wallet. This will display wallet name and NEAR balance in it.

Press **'Sweep'** to confirm or **'Close'** to cancel.

Funds will be send to the account, provided on the main page.


