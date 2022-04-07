### usagi-http-interaction
A library for interacting with Http Interaction API (API for receiving interactions.)


### Install
Github: **`npm install RabbitHouseCorp/usagi-http-interaction#main`**.

It is necessary that you have Git **installed** on the **machine**.

### Example of how to connect 
```js
const { UsagiClient } = require('usagi-http-interaction')

const usagiClient = new UsagiClient({
  protocol: 'http://',
  ip: '127.0.0.1',
  secret: 'key secret 👀',
  publicKey: 'PublicKey',
  client: client,
  eventName: 'interactionCreate',
  lengthLatency: 10,
  websocketOptions: {
    reconnect: true,
    time: 1 * 1000,
    maxReconnect: 10
  }

  // Events
  //
  // reconnecting
  // connected
  // open
  // close
  // message
  // unexpected-response
  // upgrade
  // interaction
  // httpGateway
  clientUusagiClientsagi.on('interaction', (interactionData) => {
    // ... your code!
  })

  usagiClient.connect() // For connect!
})

```


### Download API
[Click Here](https://github.com/RabbitHouseCorp/http-interaction) (https://github.com/RabbitHouseCorp/http-interaction)

