import LanguageManager from "./LanguageManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LocalizedSprite extends cc.Component {
    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    @property(cc.SpriteFrame)
    zhSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    enSprite: cc.SpriteFrame = null;

    start() {
        if (!this.sprite) {
            this.sprite = this.node.getComponent(cc.Sprite);
        }
        this.applyFrame();
        LanguageManager.onChange(() => {
            this.applyFrame();
        });
    }

    applyFrame() {
        if (!this.sprite) return;
        if (LanguageManager.current === "zh" && this.zhSprite) {
            this.sprite.spriteFrame = this.zhSprite;
        } else if (LanguageManager.current === "en" && this.enSprite) {
            this.sprite.spriteFrame = this.enSprite;
        }
    }
}

