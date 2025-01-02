import { ReactiveController, ReactiveControllerHost } from "lit";
import { debounce } from "lodash-es";
interface ScreenSize {
  width: number;
  height: number;
}

export class ScreenController implements ReactiveController {
  private host: ReactiveControllerHost;
  screenSize: ScreenSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  orientation: "portrait" | "landscape" = window.matchMedia(
    "(orientation: portrait)",
  ).matches
    ? "portrait"
    : "landscape";

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    this.host.addController(this);

    this._debouncedUpdate = this._debouncedUpdate.bind(this);
  }

  // Called when the host is connected to the DOM
  hostConnected(): void {
    window.addEventListener("resize", this._debouncedUpdate);

    // Initialize screen size and orientation
    this._updateScreenSize();
    this._updateOrientation();
  }

  // Called when the host is disconnected from the DOM
  hostDisconnected(): void {
    window.removeEventListener("resize", this._debouncedUpdate);
  }

  // Debounced resize handler
  private _debouncedUpdate(): void {
    debounce(() => {
      this._updateScreenSize();
      this._updateOrientation();
    }, 200);
  }

  // Update screen size
  private _updateScreenSize(): void {
    this.screenSize = { width: window.innerWidth, height: window.innerHeight };
    this.host.requestUpdate(); // Notify host to re-render
  }

  // Update orientation
  private _updateOrientation(): void {
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    this.orientation = isPortrait ? "portrait" : "landscape";
    this.host.requestUpdate(); // Notify host to re-render
  }

  // Optional: Add helper methods for responsive design
  get isMobile(): boolean {
    return this.screenSize.width <= 768;
  }

  get isTablet(): boolean {
    return this.screenSize.width > 768 && this.screenSize.width <= 1024;
  }

  get isDesktop(): boolean {
    return this.screenSize.width > 1024;
  }
}
