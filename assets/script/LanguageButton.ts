import LanguageManager from "./LanguageManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LanguageButton extends cc.Component {
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
            this.label.string = LanguageManager.t("lang_button");
        }
        this.node.on("click", () => {
            const next = LanguageManager.current === "zh" ? "en" : "zh";
            LanguageManager.setLanguage(next);
            if (this.label) {
                this.label.string = LanguageManager.t("lang_button");
            }
        });
        LanguageManager.onChange(() => {
            if (this.label) {
                this.label.string = LanguageManager.t("lang_button");
            }
        });
    }
}

