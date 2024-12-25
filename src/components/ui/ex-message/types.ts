import { ExMessage, ExMessageBox } from "./element";

export type MessageType = "info" | "success" | "error";

declare global {
  interface HTMLElementTagNameMap {
    "ex-message-box": ExMessageBox;
    "ex-message": ExMessage;
  }
}
