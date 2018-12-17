# dEXonation

> An DXN donate service for streamers, based on smart contract.

## Demo
<img src="./assets/images/demo.gif">

Viewers donate through DekuSan, and the donate message immediately pops up on top of the stream!

## How it works
### Donate
<img src="https://i.imgur.com/XGmh2XR.png" width="600px">

Viewers donate through the link the streamer provides. Fill in the basic information, click on the "donate" button and this triggers DekuSan.

Confirming the transaction and BOOM, you successfully completed the donation!

### Notification
<img src="https://i.imgur.com/nrcufBp.png" width="480px">

Streamer setups browser source for streaming with the Notification link, then the donate messages will pop up on the stream once a transaction is confirmed.

> Browser Source Example
> <img src="https://i.imgur.com/R9NvhL2.png" width="600px">


### History
<img src="https://i.imgur.com/rSLzS0p.png" width="480px">

All the donate records are stored on the blockchain. Streamers can easily check their top donors.


## Features
* Low fee, Low Latency
* High TPS, Fully Decentralized by DEXON
* 0 setup, no API keys required
* Enter your address and get started!

## Setup
### Development
```sh
$ git clone https://github.com/CryoliteZ/dEXonation.git
$ npm install
$ npm run dev
```

### Deployment
```sh
$ npm run build
```

## License
[MIT License](LICENSE)
