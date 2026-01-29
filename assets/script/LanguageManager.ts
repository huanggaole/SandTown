const { ccclass } = cc._decorator;

export type Lang = "zh" | "en";

@ccclass
export default class LanguageManager extends cc.Component {
    static current: Lang = "zh";
    static listeners: Array<() => void> = [];

    static setLanguage(lang: Lang) {
        this.current = lang;
        for (const cb of this.listeners) cb();
    }

    static onChange(cb: () => void) {
        this.listeners.push(cb);
    }

    static t(key: string, params: Record<string, any> = {}): string {
        console.log(this.current);
        const dict = this.current === "zh" ? this.zh : this.en;
        let s = dict[key] ?? key;
        for (const k in params) {
            s = s.replace(new RegExp("\\{" + k + "\\}", "g"), params[k]);
        }
        return s;
    }
    static findKeyByValue(value: string): string | null {
        for (const k in this.zh) {
            if (this.zh[k] === value) return k;
        }
        for (const k in this.en) {
            if (this.en[k] === value) return k;
        }
        return null;
    }


    static getPlantIntro(index: number): string {
        const arr = this.current === "zh" ? this.plantIntroZh : this.plantIntroEn;
        return arr[index] || "";

    static getBuildIntro(index: number): string {
        const arr = this.current === "zh" ? this.buildIntroZh : this.buildIntroEn;
        return arr[index] || "";
    }

    static getCultureName(index: number): string {
        const arr = this.current === "zh" ? this.cultureNameZh : this.cultureNameEn;
        return arr[index] || "";
    }

    static getCultureIntro(index: number): string {
        const arr = this.current === "zh" ? this.cultureIntroZh : this.cultureIntroEn;
        return arr[index] || "";
    }

    static zh: Record<string, string> = {
        round_label: "第 {n} 回合",
        research_already: "(已研究)",
        research_need_cost: "需要花费{cost}点文化点数。",
        research_unlock_pre: "(完成\"{name}\"以解锁此研究。)",
        lang_button: "中文",
        title_start: "开始游戏",
        title_intro: "规则介绍",
        intro_label1: "《沙漠小镇》是一款通过防沙治沙绿化环境改善区域生物多样性的同时，提升当地居民经济与幸福度的游戏。游戏采用策略回合制的方式。游戏开始时，地图上只有一个沙漠中的小村庄、少量的人口及自给自足的庄稼。玩家的目标是每回合在地图上进行地块的绿化与城镇的建设工作，在人口、经济、文化、幸福度与生态多样性五个参数中做管理与权衡。游戏根据五个参数达到不同的目标，可以达到不同的城镇发展结局。\n\n进入游戏后的游戏画面如下所示：",
        intro_label2: "操作方式：\n按住屏幕后上下左右拖动可以滚动视窗，查看地图其他位置。\n\n",
        title_close: "关闭",
    };

    static en: Record<string, string> = {
        round_label: "Round {n}",
        research_already: "(Researched)",
        research_need_cost: "Costs {cost} culture points.",
        research_unlock_pre: "(Complete \"{name}\" to unlock.)",
        lang_button: "EN",
        title_start: "Start",
        title_intro: "Rules",
        intro_label1: "Desert Town is a game that boosts regional biodiversity through desertification prevention, control and environmental greening, while simultaneously elevating local residents' economic prosperity and sense of well-being. It features a turn-based strategy gameplay. At the start of the game, the map has nothing but a small village in the desert, a sparse population, and self-sufficient crops. The player’s objective is to carry out land greening and town development on the map each turn, and manage and strike a balance between the five core parameters: population, economy, culture, well-being, and ecological diversity. The game unlocks distinct developmental outcomes for the town based on the different goals accomplished across these five parameters.\n\nThe in-game interface after launching the game is shown as follows:",
        intro_label2: "Controls:\nPress and hold the screen, then drag it up, down, left or right to pan the viewport and view other areas of the map.\n\n",
        title_close: "Close",
    };

    static plantIntroZh = [
        "清除植物：可以将一个地块上的植物清除。需要花费1点金币。不能清除石头或建筑物。",
        "梭梭树：可以在一个空地块上种植梭梭树。需要花费2点金币。梭梭树每回合需要人工维护，否则容易被动物啃食。",
        "沙棘：可以在一个空地块上种植沙棘。需要花费2点金币。沙棘每个工人能提高生存率且每回合能获得1点粮食。",
        "花棒：可以在一个空地块上种植花棒。需要花费2点金币。花棒需要人工维护，否则容易被动物啃食或生病。",
        "沙地云杉：可以在一个空地块上种植沙地云杉。需要花费2点金币。沙地云杉不需要人工维护，但生长较慢。",
        "侧柏：可以在一个空地块上种植侧柏。需要花费2点金币。侧柏不需要人工维护，但必须种在泥地或草地上。",
        "农田：可以在一个空地块上种植农田。需要花费2点金币。农田每个工人获得2点粮食，但只能种在草地上。",
        "高级农田：可以在一个空地块上种植农田。需要花费200点金币。高级农田每个工人获得10点粮食与10枚金币，但只能种在草地上。",
    ];

    static plantIntroEn = [
        "Remove Plant: Clear plants on a tile. Costs 1 coin. Cannot clear rocks/buildings.",
        "Saxaul: Plant saxaul on an empty tile. Costs 2 coins. Needs maintenance each turn.",
        "Sea Buckthorn: Plant on an empty tile. Costs 2 coins. Each worker increases survival; +1 food per turn.",
        "Cactus Column: Plant on an empty tile. Costs 2 coins. Needs maintenance each turn.",
        "Spruce: Plant on an empty tile. Costs 2 coins. No maintenance, slow growth.",
        "Thuja: Plant on an empty or green/dirt tile. Costs 2 coins. No maintenance, must be on dirt/grass.",
        "Farm: Plant on an empty tile. Costs 2 coins. Each worker produces 2 food; only on grass.",
        "Advanced Farm: Plant on an empty tile. Costs 200 coins. Each worker produces 10 food and 10 coins; only on grass.",
    ];

    static buildIntroZh = [
        "清除建筑：可以将一个建筑用地上的建筑清除。不能清除植物。研究\"岩土工程\"后可以清除岩石。",
        "建设用地：可以将泥地或草地改建为建设用地。所有的建筑必须建在建设用地上。",
        "建设水体：可以草地改建为水体。水体有助于灌溉周围的植物，并为野生动物提供饮水。",
        "复土还绿：可以将建设用地或水体根据土壤含水率重新恢复为泥土或绿地。",
        "棚屋：本地的传统住宅，能容纳5个居民，为住户提供10点幸福度。",
        "平房小院：农村常见的住宅，能容纳7个居民，为住户提供20点幸福度。",
        "洋房别墅：新农村建设时期流行的住宅，能容纳10个居民，为住户提供40点幸福度。",
        "公寓楼：城市化初期很受欢迎的住宅，能容纳12个居民，为住户提供20点幸福度。",
        "高层住宅：深度城市化后流行的住宅，能容纳20个居民，为住户提供30点幸福度。",
        "垂直森林：面向未来的生态主义住宅，能容纳15个居民，为住户提供40点幸福度。",
        "商店街：可以采购商品。每位工作人员可以产生2点金钱，2格内的住宅建筑提供5点幸福度。",
        "公园：市民放松身心的地点。每位工作人员产生2点文化，3格内的住宅建筑提供5点幸福度。",
        "快餐店：为市民提供餐饮与娱乐。每位工作人员产生5点金钱，3格以内的住宅建筑提供5点幸福度。",
        "大礼堂：文化场所。每位工作人员产生5点文化、5点金钱，5格以内的住宅建筑提供5点幸福度。",
        "运动场：每位工作人员产生5点文化、5点金钱，6格以内的住宅建筑提供5点幸福度。",
        "生态度假区：每位工作人员产生5点文化、10点金钱，6格以内的住宅建筑提供5点幸福度。",
        "学校：每位工作人员产生5点文化，花费2点金钱。",
        "活动室：每位工作人员产生8点文化，花费4点金钱。",
        "图书馆：每位工作人员产生12点文化，花费6点金钱。",
        "研究所：每位工作人员产生20点文化，花费8点金钱。",
        "文化产业园：每位工作人员产生20点文化，5点金钱。",
        "木材厂：每位工作人员产生5点金钱；每邻接一棵云杉/侧柏，收入+1。",
        "采石场：每位工作人员产生5点金钱；每邻接一格岩石，收入+3。",
        "风力磨坊：每位工作人员产生10点金钱。",
        "手工加工厂：每位工作人员产生20点金钱。",
        "重工厂：每位工作人员产生40点金钱。",
        "高新产业园：每位工作人员产生40点金钱。",
        "固碳车间：每位工作人员产生60点金钱。",
    ];

    static buildIntroEn = [
        "Remove Building: Clear a building on a construction tile. Cannot clear plants. Research \"Geotechnical\" to clear rocks.",
        "Construction Land: Convert dirt/grass to construction land. All buildings must be on it.",
        "Build Water: Convert grass to water. Water irrigates nearby plants and provides drinking source.",
        "Restore Green: Convert construction/water back to dirt/grass based on soil moisture.",
        "Shed: Houses 5 residents, provides 10 happiness.",
        "Courtyard House: Houses 7 residents, provides 20 happiness.",
        "Villa: Houses 10 residents, provides 40 happiness.",
        "Apartment: Houses 12 residents, provides 20 happiness.",
        "High-rise: Houses 20 residents, provides 30 happiness.",
        "Vertical Forest: Houses 15 residents, provides 40 happiness.",
        "Shopping Street: Each worker produces 2 coins; +5 happiness to houses within 2 tiles.",
        "Park: Each worker produces 2 culture; +5 happiness to houses within 3 tiles.",
        "Fast Food: Each worker produces 5 coins; +5 happiness to houses within 3 tiles.",
        "Auditorium: Each worker produces 5 culture, 5 coins; +5 happiness within 5 tiles.",
        "Stadium: Each worker produces 5 culture, 5 coins; +5 happiness within 6 tiles.",
        "Eco Resort: Each worker produces 5 culture, 10 coins; +5 happiness within 6 tiles.",
        "School: Each worker produces 5 culture; costs 2 coins.",
        "Activity Room: Each worker produces 8 culture; costs 4 coins.",
        "Library: Each worker produces 12 culture; costs 6 coins.",
        "Research Institute: Each worker produces 20 culture; costs 8 coins.",
        "Culture Industry Park: Each worker produces 20 culture and 5 coins.",
        "Lumber Mill: Each worker produces 5 coins; +1 income per adjacent spruce/thuja.",
        "Quarry: Each worker produces 5 coins; +3 income per adjacent rock.",
        "Windmill: Each worker produces 10 coins.",
        "Handicraft Factory: Each worker produces 20 coins.",
        "Heavy Industry: Each worker produces 40 coins.",
        "High-tech Park: Each worker produces 40 coins.",
        "Carbon Capture Workshop: Each worker produces 60 coins.",
    ];

    static cultureNameZh = [
        "三农改革","旱地培育","农业代加工","技术教育","美丽乡村","新农村建设","农业机械化","农民职业化","文化建设","便民生活圈","城镇化","岩土工程","工业自动化","普及\n公共服务","精神文明\n建设","城市化","清洁能源","产业升级","科技创新","全民健身","生态文明\n建设","生物科技","碳中和贸易","全民科普","绿色服务业",
    ];

    static cultureNameEn = [
        "Rural Reform","Dryland Cultivation","Agro-processing","Technical Education","Beautiful Countryside","New Rural Construction","Agricultural Mechanization","Farmer Professionalization","Cultural Development","Convenience Life Circle","Urbanization","Geotechnical Engineering","Industrial Automation","Universal\nPublic Services","Spiritual Civilization\nConstruction","Urbanization","Clean Energy","Industrial Upgrade","Technological Innovation","National Fitness","Ecological Civilization\nConstruction","Biotechnology","Carbon-neutral Trade","Popular Science","Green Services",
    ];

    static cultureIntroZh = [
        "目标是农民增收、农业发展、农村稳定。完成此研究将解锁建筑“平房小院”，并将“村委会”的最大工作人员数提升至4人，幸福度的影响范围提升至3单元格。",
        "旱地培育：研究此技术后，农田与高级农田可以建设在土壤含水量≥10%的泥土块上。",
        "农业代加工：研究此技术后，将解锁建筑“风力磨坊”。",
        "技术教育：研究此技术后，将解锁建筑“学校”。",
        "美丽乡村：研究此技术后，将解锁建筑“公园”。",
        "建设改善农民衣食住行，建设基础设施以及农民的生活保障机制。完成此研究将解锁建筑\"洋房别墅\"，并将\"村委会\"的最大工作人员数提升至6人，幸福度的影响范围提升至4单元格。",
        "农业机械化：研究此技术后，将解锁种植“高级农田”。",
        "农民职业化：研究此技术后，将解锁建筑“手工加工厂”。",
        "文化建设：研究此技术后，将解锁建筑“活动室”。",
        "便民生活圈：研究此技术后，将解锁建筑“快餐店”。",
        "将农村人口转化为城镇人口的过程。完成此研究将解锁建筑\"公寓\"，\"村委会\"改名为“镇政府”，最大工作人员数提升至8人，幸福度的影响范围提升至5单元格。",
        "岩土工程：研究此技术后，可以移除岩石，可以解锁建筑“修建水体”。",
        "工业自动化：研究此技术后，将解锁建筑“重工厂”。",
        "普及公共服务：研究此技术后，将解锁建筑“图书馆”。",
        "精神文明建设：研究此技术后，将解锁建筑“大礼堂”。",
        "进一步完成现代城市转型，完成此研究将解锁建筑\"高层住宅\"，并将\"镇政府\"的最大工作人员数提升至9人，幸福度的影响范围提升至6单元格。",
        "清洁能源：研究此技术后，所有工业建筑对环境产生的幸福度降低影响变为原来的1/5。“风力磨坊”可以发电，每位工人产出的金币变为30。",
        "产业升级：研究此技术后，将解锁建筑“高新产业园”。",
        "科技创新：研究此技术后，将解锁建筑“研究所”。",
        "全民健身：研究此技术后，将解锁建筑“体育馆”。",
        "打造可持续发展的、面向未来的城市。完成此研究将解锁建筑\"高层住宅\"，并将\"镇政府\"的幸福度影响范围提升至9单元格。",
        "生物科技：所有防风固沙、水土保持植物在没有工人时的存活率提升至100%，所有植物的食物产量翻倍。",
        "碳中和贸易：研究此技术后，将解锁建筑“固碳车间”。",
        "全民科普：研究此技术后，将解锁建筑“文化产业园”。",
        "绿色服务业：研究此技术后，将解锁建筑“生态度假区”。",
    ];

    static cultureIntroEn = [
        "Increase rural income, develop agriculture, stabilize countryside. Unlocks Courtyard House; increases Village Committee max workers to 4; happiness range +3.",
        "Dryland Cultivation: Farms and Advanced Farms can be built on tiles with soil moisture ≥10%.",
        "Agro-processing: Unlocks Windmill.",
        "Technical Education: Unlocks School.",
        "Beautiful Countryside: Unlocks Park.",
        "Improve rural living and infrastructure. Unlocks Villa; Village Committee max workers to 6; happiness range +4.",
        "Agricultural Mechanization: Unlocks Advanced Farm.",
        "Farmer Professionalization: Unlocks Handicraft Factory.",
        "Cultural Development: Unlocks Activity Room.",
        "Convenience Life Circle: Unlocks Fast Food.",
        "Urbanization: Unlocks Apartment; Village Committee renamed Town Government; max workers to 8; happiness range +5.",
        "Geotechnical Engineering: Allows removing rocks; unlocks Build Water.",
        "Industrial Automation: Unlocks Heavy Industry.",
        "Universal Public Services: Unlocks Library.",
        "Spiritual Civilization Construction: Unlocks Auditorium.",
        "Further urban transformation: Unlocks High-rise; Town Government max workers to 9; happiness range +6.",
        "Clean Energy: Industrial negative happiness reduced to 1/5; Windmill produces 30 coins per worker.",
        "Industrial Upgrade: Unlocks High-tech Park.",
        "Technological Innovation: Unlocks Research Institute.",
        "National Fitness: Unlocks Stadium.",
        "Ecological Civilization Construction: Unlocks High-rise; Town Government happiness range +9.",
        "Biotechnology: All sand-control plants have 100% survival without workers; all plant food production doubled.",
        "Carbon-neutral Trade: Unlocks Carbon Capture Workshop.",
        "Popular Science: Unlocks Culture Industry Park.",
        "Green Services: Unlocks Eco Resort.",
    ];
}
