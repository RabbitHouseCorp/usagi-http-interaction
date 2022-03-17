export class Statistics {
  public lengthLatency: number;
  public latency: number[];
  public latencyPosition: number;
  public reconnected: number;
  public sendPing: number;
  public failedToConnect: number;
  public disconnected: number;
  public start: number;
  public end: number;
  public update: number;
  public dataLengthReceived: number;
  public dataLengthSend: number;
  public authorized: boolean
  public modeSecure: boolean;
  constructor(lengthLatency: number) {
    this.lengthLatency = lengthLatency;
    this.latency = Array.from({ length: lengthLatency == undefined ? lengthLatency : 3 }, () => 0)
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

  public resetLatency() {
    this.latency = Array.from({ length: this.lengthLatency == undefined ? this.lengthLatency : 3 }, () => 0)
    return this;
  }

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