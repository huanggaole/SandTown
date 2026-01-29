import LanguageManager from "./LanguageManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LocalizedLabel extends cc.Component {
    @property
    key: string = "";

    @property(cc.Label)
    label: cc.Label = null;

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
        if (this.label) {
            if (!this.key || this.key.length === 0) {
                const initText = (this.label.string || "").trim();
                const found = LanguageManager.findKeyByValue(initText);
                if (found) {
                    this.key = found;
                } else {
                    this.key = initText;
                }
                console.log(this.key)
            }
            if (this.key && this.key.length > 0) {
                this.label.string = LanguageManager.t(this.key);
            }
        LanguageManager.onChange(() => {
            if (this.label && this.key) {
                console.log(LanguageManager.t(this.key))
                this.label.string = LanguageManager.t(this.key);
            }
        });
    }
}
