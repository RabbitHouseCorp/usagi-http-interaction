export class Statistics {
  /**
   * @description The size of metrics
   */
  public lengthLatency: number;
  /**
   * @description Metrics
   */
  public latency: number[];
  /**
   * @description Metrics position you can sync where the ping updated recently!
   */
  public latencyPosition: number;
  /**
   * @description How many times the library reconnected
   */
  public reconnected: number;
  /**
   * @description How many ping requests did the library ask for
   */
  public sendPing: number;
  /**
   * @description Failed to connect to the library may have probably generated some error in part of the library.
   */
  public failedToConnect: number;
  /**
   * @description Connection fail
   */
  public disconnected: number;
  /**
   * @description When the library connects to the API
   */
  public start: number;
  /**
   * @description When the connection was successfully made!
   */
  public end: number;
  /**
   * @description When the ping was sent
   */
  public update: number;
  /**
   * @description Data received from the library
   */
  public dataLengthReceived: number;
  /**
   * @description Data sent to library
   */
  public dataLengthSend: number;
  /**
   * @description When the connection was authenticated to the API
   */
  public authorized: boolean
  /**
   * @description Identification for secure connection.
   */
  public modeSecure: boolean;
  constructor(lengthLatency: number) {
    this.lengthLatency = lengthLatency;
    this.latency = Array.from({ length: lengthLatency == undefined ? 3 : lengthLatency }, () => 0)
    this.reconnected = 0;
    this.failedToConnect = 0;
    this.dataLengthReceived = 0;
    this.dataLengthSend = 0;
    this.sendPing = 0;
    this.start = 0;
    this.end = 0;
    this.disconnected = 0;
    this.authorized = false;
    this.modeSecure = false;
    this.latencyPosition = -1;
    this.update = 0;
  }
  /**
   * @description Reset metrics
   * @returns 
   */
  public resetLatency() {
    this.latency = Array.from({ length: this.lengthLatency == undefined ? this.lengthLatency : 3 }, () => 0)
    return this;
  }

  /**
   * 
   * @param newLatency To update latency
   */
  public updateLatency(newLatency: number) {
    if (this.latencyPosition == -1) {
      this.latencyPosition++;
    } else if (this.latencyPosition + 1 >= this.latency.length) {
      this.latencyPosition = 0
    } else {
      this.latencyPosition++;
    }

    this.latency[this.latencyPosition] = newLatency - this.update;
  }
}
