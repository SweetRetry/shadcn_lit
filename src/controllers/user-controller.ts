import { getUserInfo } from "@/api/user";
import { ExUserInfoModel } from "@/api/user/types";
import { message } from "@/components/ui/ex-message/helper";
import { encryptEmail, encryptStr } from "@/utils/encrypt";
import { ReactiveController, ReactiveControllerHost } from "lit";

let cachedUserInfo: ExUserInfoModel | undefined = void 0;

export class ExUserController implements ReactiveController {
  host: ReactiveControllerHost;

  userInfo?: ExUserInfoModel = void 0;

  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);
  }

  async hostConnected() {
    this.host.requestUpdate();
    this.fetchUserInfo();
  }
  hostDisconnected() {
    this.userInfo = void 0;
    this.host.requestUpdate();
  }

  protected async fetchUserInfo(useCache = false) {
    if (useCache) return cachedUserInfo;
    const { content, statusCode } = await getUserInfo();
    if (statusCode === 200) {
      const data = {
        ...content,
        email: encryptEmail(content.email),
        mobile: encryptStr(content.mobile || "", 3, 4, " **** "),
      };
      this.userInfo = data;
      cachedUserInfo = data;
      this.host.requestUpdate();
    } else {
      message.error("获取用户信息失败");
    }
  }
}
