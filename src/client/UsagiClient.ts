import { EventEmitter } from 'events';
import { WebSocket } from 'ws';
import { decodeData, encodeData } from '../utils/MessageData';
import { Statistics } from '../utils/Statistics';
/**
 * It is not necessary to download the library
 * we will just use this interface to connect the other functions of Client Discord.
 */
export interface IClientEris {
  /**
   * Collect ID Bot by Client
   */
  user?: any;
}

/**
 * It is not necessary to download the library
 * we will just use this interface to connect the other functions of Client Discord.
 */
export interface IClientDJS {
  /**
   * Collect ID Bot by Client
   */
  user?: any;
}

/**
 * @description Websocket Settings
 */
export interface IWebsocketClientOptions {
  /**
   * @description Allow the library to reconnect the API when there is a disconnect or a missed call or an API error occurs.
   */
  reconnect: boolean;
  /**
   * @description The time to reconnect and also mention by milliseconds for example (5 * 1000 = 5 seconds). The library counts and adds triple the value.
   */
  time: number;
  /**
   * @description Returning negative value is significant to disable this option which is the limit for how many connections you can reconnect.
   */
  maxReconnect: number; // -1 = Disabled
}

/**
  * @description Settings to connect to API!
  */
export interface IClientOptions {
  /**
   * @description What kind of service do you want to work in the API if it is in secure mode (https://) or in non-secure mode (http://)
   */
  protocol?: string;
  /**
   * @description What is the IP or URL to receive API interactions. (127.0.0.1)
   */
  ip: string;
  /**
   * @description What is the port to access API you can return null to disable this mode if it is a domain with no port.
   */
  port?: string;
  /**
   * @description Public key is required to receive interactions!
   */
  publicKey: string;
  /**
   * @description A strong key that is generated by you that is placed in the .env
   */
  secret: string;
  /**
   * @description You can use just two library which is Discord.js or Eris.js or you can use another library which contains EventEmitter and UserBot to collect bot ID to connect.
   */
  client?: IClientDJS | IClientEris | any;
  /**
   * @description Which event name do you want to add to your Client.
   */
  eventName: string[];
  /**
   * @description Array size -> Lantecy (default: 3)
   */
  lengthLatency: number;
  /**
   * @description Websocket Settings!
   * @requires This is mandatory to configure websocket to be able to connect the API.
   */
  websocketOptions: IWebsocketClientOptions;
}


export class UsagiClient extends EventEmitter {
  /**
   * @description Settings to connect to API!
   */
  public options: IClientOptions;
  /**
   * @description Websocket
   */
  public ws?: WebSocket | null;
  /**
   * @description Statistics to have more report about the API connection.
   */
  public stats: Statistics;
  /**
   * @description This is to maintain the connection don't mess with it.
   */
  public updateLatency?: any;
  constructor(options: IClientOptions) {
    super();
    if (options == undefined) throw Error('ClientUsagi:  IClientOptions({\nprotocol=string;\nip=string;\nport?=string;\npublicKey=string;\nclient?=IClientDJS | IClientEris\n})'); this.options = options;
    if (this.options.protocol == undefined) throw Error('ClientUsagi: You need to add field to put the protocol type!');
    if (this.options.websocketOptions == undefined) throw Error('ClientUsagi: You need to add field to put the websocketOptions!');
    if (this.options.websocketOptions.maxReconnect == undefined) throw Error('ClientUsagi: You need to add field to put the websocketOptions.maxReconnect!');
    if (this.options.websocketOptions.reconnect == undefined) throw Error('ClientUsagi: You need to add field to put the websocketOptions.reconnect!');
    if (this.options.websocketOptions.time == undefined) throw Error('ClientUsagi: You need to add field to put the websocketOptions.time!');
    if (typeof this.options.websocketOptions.maxReconnect !== 'number') throw Error('ClientUsagi: (maxReconnect): Enter the value of type number.');
    if (typeof this.options.websocketOptions.reconnect !== 'boolean') throw Error('ClientUsagi: (reconnect): Enter the value of type number.');
    if (typeof this.options.websocketOptions.time !== 'number') throw Error('ClientUsagi: (time): Enter the value of type number.');
    if (this.options.protocol.startsWith('https://') && this.options.protocol.startsWith('http://')) throw Error('I couldn\'t identify the protocol! https? or http://?');
    if (this.options.ip == undefined) throw Error('ClientUsagi: You need to add field to put the IP!');
    if (this.options.port == undefined) {
      this.options.port = 'null'
    }
    if (this.options.publicKey == undefined) throw Error('ClientUsagi: You need to add field to put the public_key!');
    this.stats = new Statistics(options.lengthLatency == undefined ? 3 : options.lengthLatency)
    this.updateLatency = null;
    this.listenerClass()
  }

  public update() {
    this.updateLatency = setTimeout(() => {
      this.stats.update = Date.now();
      this.send({ type: 89, message: '' });
    }, 5 * 1000)
  }
  public reconnect() {
    if (this.options.client?.user?.id == undefined) throw Error('ClientUsagi: I couldn\'t find the bot ID!');
    if (typeof this.options.client?.emit !== 'function') throw Error('ClientUsagi: This doesn\'t appear to be EventEmitter');
    if (this.options.websocketOptions.reconnect !== undefined) {
      if (this.options.websocketOptions.reconnect == true) {
        const max = this.options.websocketOptions.maxReconnect == undefined ? 10 : this.options.websocketOptions.maxReconnect;
        if (!(this.stats.reconnected >= max)) {
          const time = this.options.websocketOptions.time == undefined ? 5 * 1000 : this.options.websocketOptions.time;
          this.options.websocketOptions.time += time
          setTimeout(() => {
            this.connect()
            this.emit('reconnecting', (true))
            this.stats.reconnected++
          }, time)
        } else {
          this.emit('reconnecting', (false))
        }
      }
    }
  }

  private listenerClass() {
    this.on('open', () => {
      this.stats.end = Date.now();
      this.stats.update = Date.now();
      this.send({ type: 89, message: '' })
      this.emit('connected', (this.stats.start, this.stats.end))
    })
    this.on('close', (code, reason) => {
      this.stats.failedToConnect++;
      this.stats.disconnected++;
      this.ws = null;
      this.emit('disconnected', (code, reason))
      this.reconnect()
    })
    this.on('message', (message: Buffer) => {
      this.stats.dataLengthReceived += message.byteLength ?? 0
      const time = Date.now()
      const json = decodeData(message)
      this.emit('in', (message, time))
      if (json.type == 200) {
        this.stats.authorized = true;
        this.stats.updateLatency(Date.now())
        this.update()
      }
      this.emit('interaction', json)
    })
  }

  public send(data: any) {
    if (this.options.client?.user?.id == undefined) throw Error('ClientUsagi: I couldn\'t find the bot ID!');
    if (typeof this.options.client?.emit !== 'function') throw Error('ClientUsagi: This doesn\'t appear to be EventEmitter');
    if (this.ws == null) return
    if (this.ws == undefined) return
    if (!(this.ws instanceof WebSocket)) return
    const message = encodeData(typeof data === 'string' ? JSON.stringify(data) : data)
    if (this.ws !== undefined) {
      const time = Date.now()
      this.stats.dataLengthSend += message.byteLength
      this.emit('out', (message, time))
      this.ws?.send(message)
    }
    return message
  }

  public connect() {
    if (this.options.client?.user?.id == undefined) throw Error('ClientUsagi: I couldn\'t find the bot ID!');
    if (typeof this.options.client?.emit !== 'function') throw Error('ClientUsagi: This doesn\'t appear to be EventEmitter');
    if (this.options.protocol == undefined) this.options.protocol = 'http://'
    const protocol = this.options.protocol?.replace('https://', 'wss://').replace('http://', 'ws://');
    this.options.ip = this.options.ip?.replace('https://', '').replace('http://', '')
    const url = `${protocol}${this.options.ip}${this.options.port == undefined ? this.options.port : ''}/ws_interaction`;
    if (url.startsWith('wss://')) {
      this.stats.modeSecure = true;
    }
    const ws = new WebSocket(url, {
      perMessageDeflate: true,
      headers: {
        'Identification-Id': this.options.client?.user?.id,
        'Secret': this.options.secret,
        'Public-Key': this.options.publicKey,
        'Shard-In': 0,
        'Shard-Total': 1
      },
      timeout: 3 * 1000,
      handshakeTimeout: 4 * 1000,
      sessionTimeout: 4 * 1000
    });

    this.stats.start = Date.now();

    this.ws = ws;
    ws.on('open', () => this.emit('open', true));
    ws.on('close', args => this.emit('close', args));
    ws.on('error', args => this.emit('error', args));
    ws.on('message', args => this.emit('message', args));
    ws.on('unexpected-response', args => this.emit('unexpected-response', args));
    ws.on('upgrade', args => this.emit('upgrade', args));
  }
}
