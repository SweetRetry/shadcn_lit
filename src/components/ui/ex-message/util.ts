import { TemplateResult } from "lit";
import { v4 as uuidV4 } from "uuid";
import { ExMessageBox } from "./element";
import { MessageType } from "./types";

class ExMessage {
  messageIds: string[] = [];

  messageBox: ExMessageBox;

  defaultOptions = {
    duration: 1500,
    type: "info" as MessageType,
  };

  constructor() {
    const messageBox = document.createElement("ex-message-box");
    document.body.appendChild(messageBox);
    this.messageBox = messageBox;
  }
  show = (
    message: string | TemplateResult,
    options?: {
      duration?: number;
      type?: MessageType;
    },
  ) => {
    const _options = Object.assign({}, this.defaultOptions, options);
    const id = uuidV4();
    const messageElement = document.createElement("ex-message");
    messageElement.id = id;
    messageElement.message = message;
    messageElement.duration = _options.duration;
    messageElement.type = _options.type;
    this.messageIds.push(id);
    this.messageBox.appendChild(messageElement);
  };

  info = (
    message: string | TemplateResult,
    options: Omit<Parameters<typeof this.show>[1], "type">,
  ) => {
    return this.show(message, { ...options, type: "info" });
  };

  error = (
    message: string | TemplateResult,
    options: Omit<Parameters<typeof this.show>[1], "type">,
  ) => {
    return this.show(message, { ...options, type: "error" });
  };

  remove = (id: string) => {
    const messageElements = this.messageBox.querySelectorAll("ex-message");

    messageElements.forEach((item) => {
      if (item.id === id) {
        item.remove();
      }
    });

    this.messageIds.splice(this.messageIds.indexOf(id), 1);

    messageElements.forEach((item) => {
      if (item.id !== id) {
        item.requestUpdate();
      }
    });
  };

  findIndex(id: string) {
    return this.messageIds.indexOf(id);
  }
}

export const exMessage = new ExMessage();
