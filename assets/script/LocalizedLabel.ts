import LanguageManager from "./LanguageManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LocalizedLabel extends cc.Component {
    @property
    key: string = "";

    @property(cc.Label)
    label: cc.Label = null;

    private unsubscribeLanguage: () => void = null;

    onDestroy() {
        if (this.unsubscribeLanguage) {
            this.unsubscribeLanguage();
            this.unsubscribeLanguage = null;
        }
    }

    start() {
        if (!this.label) {
            const own = this.node.getComponent(cc.Label);
            if (own) {
                this.label = own;
            } else {
                const child = this.node.getChildByName("Label");
                if (child) {
                    this.label = child.getComponent(cc.Label);
                }
            }
        }
        if (!this.label) {
            return;
        }
        // 场景里没有显式配置 key 时，用当前显示文本反查 key
        if (!this.key || this.key.length === 0) {
            const initText = (this.label.string || "").trim();
            const found = LanguageManager.findKeyByValue(initText);
            this.key = found || initText;
        }
        if (this.key && this.key.length > 0) {
            this.label.string = LanguageManager.t(this.key);
        }
        this.unsubscribeLanguage = LanguageManager.onChange(() => {
            if (this.label && this.key) {
                this.label.string = LanguageManager.t(this.key);
            }
        });
    }
}
