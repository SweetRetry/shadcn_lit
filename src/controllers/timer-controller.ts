import {
  ReactiveController,
  ReactiveControllerHost,
  TemplateResult,
} from "lit";

export class TimerController implements ReactiveController {
  host: ReactiveControllerHost;

  timeout: number;

  // 是否正在计时
  isRunning = false;

  private _timerID?: number;

  constructor(host: ReactiveControllerHost, timeout = 60) {
    (this.host = host).addController(this);

    this.timeout = timeout;
  }
  hostConnected() {}
  hostDisconnected() {
    this.end();
  }

  start() {
    if (this._timerID) return;
    this.isRunning = true;
    this._timerID = window.setInterval(() => {
      this.timeout--;
      if (this.timeout === 0) {
        this.end();
      }
      // Update the host with new value
      this.host.requestUpdate();
    }, 1000);
  }

  end() {
    this.isRunning = false;
    clearInterval(this._timerID);
    this._timerID = undefined;
  }

  render(text: string | TemplateResult) {
    return this.isRunning ? this.timeout : text;
  }
}
