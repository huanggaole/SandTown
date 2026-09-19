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

    /**
     * 注册语言切换回调，返回取消注册的函数。
     * 组件必须在 onDestroy() 里调用返回的函数，否则场景切换后
     * listeners 里会残留指向已销毁节点的回调，触发空引用。
     */
    static onChange(cb: () => void): () => void {
        this.listeners.push(cb);
        return () => {
            const idx = this.listeners.indexOf(cb);
            if (idx >= 0) {
                this.listeners.splice(idx, 1);
            }
        };
    }

    /** 兜底清空全部监听（正常流程应由各组件 onDestroy 自行注销） */
    static clearListeners() {
        this.listeners = [];
    }

    static t(key: string, params: Record<string, any> = {}): string {
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
    }
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

    static getPlantName(index:number):string{
        const arr = this.current === "zh" ? this.plantNameZh : this.plantNameEn;
        return arr[index] || "";
    }

    static getBuildName(index:number):string{
        const arr = this.current === "zh" ? this.buildNameZh : this.buildNameEn;
        return arr[index] || "";
    }

    static getTileName(index:number):string{
        const arr = this.current === "zh" ? this.tileNameZh : this.tileNameEn;
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
        next_round: "下一回合",
        start_research: "开始研究",
        intro_sand: "土壤含水量小于10%时为沙地，可以通过种植防风固沙植物提高沙地的土壤含水量。",
        intro_dirt: "土壤含水量在10%~15%之间为泥地，可以通过种植植物提高泥地的土壤含水量。泥地可被建设为建设用地。",
        intro_grass: "土壤含水量在15%以上为草地，草地上可以种植庄稼。草地可以被建设为建设用地。草地可以被建设为水体。",
        intro_water: "水体可以被改建为泥地或草地。当土壤含水量降至15%以下时，水体会退化为泥地。",
        soil_moisture: "土壤含水量:",
        // device_title: "{tile} · {device}",
        worker_count: "工作人员个数：",
        per_worker_prefix: "每位工作人员可以产生",
        per_worker_survival: " 每位工作人员提升{val}%存活率，",
        per_turn_swc_up_to: " 每回合土壤含水量 +{swc}%，上限为{max}%。",
        per_worker_food: " 每位工作人员产生{val}点粮食，",
        per_worker_culture: " 每位工作人员产生{val}点文化，",
        per_worker_money: " 每位工作人员产生{val}点金钱，",
        per_worker_cost_money: " 每位工作人员花费{val}点金钱，",
        lumber_adj_bonus: " 每相邻一棵云杉/侧柏，收入 +1。",
        quarry_adj_bonus: " 每相邻一格岩石，收入 +3。",
        happiness_range_label: "{range}格以内住宅幸福度",
        effect_culture_plus: "文化 + {val}",
        effect_food_plus: "粮食 + {val}",
        effect_money_plus: "金钱 + {val}",
        effect_money_minus: "金钱 - {val}",
        happiness_plus: " + {val}。",
        happiness_minus: " - {val}。",
        check_population: "查看人口&幸福度",
        check_worker: "查看工人分配情况",
        check_culture: "查看文化产出",
        check_money: "查看金币产出",
        check_food: "查看粮食产出",
        check_swc: "查看土壤含水量",
        intro_label1: "《沙漠小镇》是一款通过防沙治沙绿化环境改善区域生物多样性的同时，提升当地居民经济与幸福度的游戏。游戏采用策略回合制的方式。游戏开始时，地图上只有一个沙漠中的小村庄、少量的人口及自给自足的庄稼。玩家的目标是每回合在地图上进行地块的绿化与城镇的建设工作，在人口、经济、文化、幸福度与生态多样性五个参数中做管理与权衡。游戏根据五个参数达到不同的目标，可以达到不同的城镇发展结局。\n\n进入游戏后的游戏画面如下所示：",
        intro_label2: "操作方式：\n按住屏幕后上下左右拖动可以滚动视窗，查看地图其他位置。\n\n",
        title_close: "关闭",
        village_committee_name: "村委会",
        dlg_geotech_needed: "在研究“岩土工程”之后，方可用此功能铲平岩石。",
        dlg_no_building: "此处没有建筑，请选择一处有建筑物的图块才能进行清除建筑操作。",
        dlg_government_unclearable: "此建筑为小镇的政府建筑，不能被清除。",
        dlg_clear_building_not_for_plants: "“清除建筑”按钮不能用于清除植物，清除植物请使用“种植”功能下的“清除植物”按钮。",
        dlg_clear_rock_before_construction: "在将土地改建为建设用地前，请先清除此地块上的岩石清除。需要研究“岩土工程”。",
        dlg_clear_plants_before_construction: "在将土地改建为建设用地前，请先清除此地块上的植物。",
        dlg_already_construction: "当前土地块已经是建设用地了。",
        dlg_water_to_grass_or_dirt_before_construction: "在将土地改建为建设用地前，请先将水体改建成草地或泥地。",
        dlg_sand_cannot_construct: "沙土松散，无法进行建设。请先提高土壤含水量。",
        dlg_clear_rock_before_water: "在将土地改建为水体前，请先清除此地块上的岩石。需要研究“岩土工程”。",
        dlg_already_water: "当前土地块已经是水体了。",
        dlg_clear_plants_or_building_before_water: "在将土地改建为水体前，请先清除此地块上的植物或建筑。",
        dlg_restore_green_before_build_water: "在将建设用地改建为水体前，请先“退建还草”，将建设用地改建为草地或泥地。",
        dlg_only_restore_on_construction_or_water: "只能对建设用地或水体进行复土还绿操作。",
        dlg_clear_building_before_restore: "在将建设用地复土还绿前，请先清除此地块上的建筑。",
        dlg_build_on_construction_required: "建筑必须建造在建设用地上，请先将此地块改造为建设用地。",
        dlg_construction_has_building: "此建筑用地上已有其他建筑，请先清除原有建筑才能建造新建筑。",
        dlg_no_plant_here: "此处没有植物，请选择一处有植物的图块才能进行清除植物操作。",
        dlg_clear_plant_not_for_construction: "“清除植物”按钮不能用于清除建筑用地，清除建筑用地请使用“建筑”功能下的“清除建筑”按钮。",
        dlg_cannot_plant_on_rock: "不能将植物种在岩石上。",
        dlg_cannot_plant_on_construction: "不能将植物种在建筑用地上。",
        dlg_cannot_plant_on_water: "不能将植物种在水体上。",
        dlg_cannot_plant_on_other_plant: "不能将植物种在其他植物上。",
        dlg_farm_requires_grass_pre_research: "目前，农田必须种在绿地（土壤含水量≥15%）上。研究“旱地培育”技术后，可以将农田种在泥地（土壤含水量≥10%）上。",
        dlg_farm_requires_dirt_or_grass_post_research: "目前，农田必须种在泥地或草地（土壤含水量≥10%）上。",
        dlg_thuja_requires_dirt_or_grass: "侧柏必须种在泥地或草地（土壤含水量≥10%）上。",
        dlg_labour_deficit_no_progress: "小镇当前的可用劳动人力点数为赤字，本回合无法推进。请调节工作地点的人力分配，解决可用劳动人力点数的赤字问题后方可继续下一回合。",
        dlg_buy_food_cost: "人口数多于小镇自产的食物数，花费{cost}点金币为小镇人口采购足够的粮食。",
        dlg_sell_food_gain: "小镇自产的食物数多于人口数，卖掉多于的粮食，额外获得{gain}点金币。",
        dlg_game_over_no_population: "很遗憾，你的城镇已经无人居住，沦为了一座鬼城。在{round}回合的坚持后，你的本轮游戏失败了。",
        dlg_game_over_bankrupt: "很遗憾，你的城镇由于连续3回合财政赤字，不得不宣布破产。在经过{round}回合的坚持后，你的本轮游戏失败了。",
        dlg_debt_warning: "目前小镇拥有的金币数为赤字。请在{round}回合内扭亏为盈，否则小镇破产，游戏结束。",
        dlg_committee_destroyed: "很遗憾，你的{name}受土地沙漠化的影响被损毁了。在经过{round}回合的坚持后，你的本轮游戏失败了。",
        dlg_plants_dead: "由于恶劣环境的影响，沙地上有{num}颗植物死亡了。",
        erosion_improve_prefix: "在人工治理的努力下",
        erosion_up_sand_to_dirt: "，有{n}个沙地块改善为泥土块",
        erosion_up_dirt_to_grass: "，有{n}个泥土块改善为草地块",
        erosion_degrade_prefix: "受恶劣环境的影响",
        erosion_down_dirt_to_sand: "，有{n}个泥土块退化为沙地块",
        erosion_down_grass_to_dirt: "，有{n}个草地块退化为泥地块",
        erosion_water_to_dirt: "，有{n}个水体块退化为泥地块",
        erosion_stone_to_sand: "，有{n}处建设用地退化为沙地块，其上的建筑均被损坏",
        period_full_stop: "。",
        soil_moisture_increase_prefix: "每回合土壤含水量 + ",
        soil_moisture_increase_suffix: "提升土壤含水量上限为",
        population_label: "存活率：",
        need_labors: "小镇当前已没有多余的人力点数。请先减少其他工作场所的工作人员以增加可用的人力点数。",
        residential_intro: "此建筑为住宅建筑，可以吸引{num}名工作人员前来居住。",
        residential_happiness_gain: "住在这个建筑中的居民可获得{val}点幸福度。",
        lodger_residents: "居住的人数：{num}",
        lodger_happiness_here: "此处幸福度：{val}",
        lodger_sources_header: "幸福度来源：",
        lodger_house_self: "{val}由住宅本身提供",
        lodger_source_item: "{val}来自{dist}格外的{name}",
    };

    static en: Record<string, string> = {
        round_label: "Round {n}",
        research_already: "(Researched)",
        research_need_cost: "Costs {cost} culture points.",
        research_unlock_pre: "(Complete \"{name}\" to unlock.)",
        lang_button: "EN",
        title_start: "Start",
        title_intro: "Rules",
        next_round: "Next Round",
        start_research: "Start Research",
        intro_sand: "Sand: Soil moisture below 10%. Plant windbreak/sand-fixation species to increase moisture.",
        intro_dirt: "Dirt: Soil moisture between 10% and 15%. Plant species to improve moisture. Dirt can be converted to construction land.",
        intro_grass: "Grass: Soil moisture above 15%. You can plant crops. Grass can be converted to construction land or water.",
        intro_water: "Water: Can be converted to dirt or grass. If soil moisture falls below 15%, water degrades to dirt.",
        soil_moisture: "Soil Moisture:",
        // device_title: "{tile} · {device}",
        worker_count: "Workers:",
        per_worker_prefix: "Each worker produces",
        per_worker_survival: " {val}% survival per worker,",
        per_turn_swc_up_to: " SWC +{swc}% per turn, up to {max}%.",
        per_worker_food: " Each worker produces {val} food,",
        per_worker_culture: " Each worker produces {val} culture,",
        per_worker_money: " Each worker produces {val} money,",
        per_worker_cost_money: " Each worker costs {val} money,",
        lumber_adj_bonus: " +1 money per adjacent spruce/thuja.",
        quarry_adj_bonus: " +3 money per adjacent rock.",
        happiness_range_label: "Happiness within {range} tiles",
        effect_culture_plus: "Culture + {val}",
        effect_food_plus: "Food + {val}",
        effect_money_plus: "Money + {val}",
        effect_money_minus: "Money - {val}",
        happiness_plus: " + {val}.",
        happiness_minus: " - {val}.",
        check_population: "View Population & Happiness",
        check_worker: "View Worker Allocation",
        check_culture: "View Culture Output",
        check_money: "View Money Output",
        check_food: "View Food Output",
        check_swc: "View Soil Moisture",
        intro_label1: "Desert Town is a game that boosts regional biodiversity through desertification prevention, control and environmental greening, while simultaneously elevating local residents' economic prosperity and sense of well-being. It features a turn-based strategy gameplay. At the start of the game, the map has nothing but a small village in the desert, a sparse population, and self-sufficient crops. The player’s objective is to carry out land greening and town development on the map each turn, and manage and strike a balance between the five core parameters: population, economy, culture, well-being, and ecological diversity. The game unlocks distinct developmental outcomes for the town based on the different goals accomplished across these five parameters.\n\nThe in-game interface after launching the game is shown as follows:",
        intro_label2: "Controls:\nPress and hold the screen, then drag it up, down, left or right to pan the viewport and view other areas of the map.\n\n",
        title_close: "Close",
        village_committee_name: "Town Hall",
        dlg_geotech_needed: "Research \"Geotechnical Engineering\" before you can clear rocks.",
        dlg_no_building: "No building here. Select a tile with a building to clear.",
        dlg_government_unclearable: "This government building cannot be cleared.",
        dlg_clear_building_not_for_plants: "\"Remove Building\" cannot clear plants. Use \"Plant\" → \"Remove Plant\" instead.",
        dlg_clear_rock_before_construction: "Before converting to construction land, clear rocks first. Requires Geotechnical Engineering.",
        dlg_clear_plants_before_construction: "Before converting to construction land, clear existing plants first.",
        dlg_already_construction: "This tile is already construction land.",
        dlg_water_to_grass_or_dirt_before_construction: "Convert water to grass or dirt before creating construction land.",
        dlg_sand_cannot_construct: "Sand is too loose for construction. Increase soil moisture first.",
        dlg_clear_rock_before_water: "Before creating water, clear rocks first. Requires Geotechnical Engineering.",
        dlg_already_water: "This tile is already water.",
        dlg_clear_plants_or_building_before_water: "Clear plants or buildings before creating water.",
        dlg_restore_green_before_build_water: "Before creating water on construction land, restore it back to grass or dirt.",
        dlg_only_restore_on_construction_or_water: "You can only restore construction land or water.",
        dlg_clear_building_before_restore: "Clear buildings before restoring construction land.",
        dlg_build_on_construction_required: "Buildings must be built on construction land. Convert this tile first.",
        dlg_construction_has_building: "A building already exists here. Clear it before building a new one.",
        dlg_no_plant_here: "No plant here. Select a tile with plants to clear.",
        dlg_clear_plant_not_for_construction: "\"Remove Plant\" cannot clear construction land. Use \"Build\" → \"Remove Building\".",
        dlg_cannot_plant_on_rock: "Cannot plant on rock.",
        dlg_cannot_plant_on_construction: "Cannot plant on construction land.",
        dlg_cannot_plant_on_water: "Cannot plant on water.",
        dlg_cannot_plant_on_other_plant: "Cannot plant on another plant.",
        dlg_farm_requires_grass_pre_research: "Farms must be planted on grass (soil moisture ≥15%). After \"Dryland Cultivation\", farms can be planted on dirt (≥10%).",
        dlg_farm_requires_dirt_or_grass_post_research: "Farms must be planted on dirt or grass (soil moisture ≥10%).",
        dlg_thuja_requires_dirt_or_grass: "Thuja must be planted on dirt or grass (soil moisture ≥10%).",
        dlg_labour_deficit_no_progress: "Labour points are in deficit; this turn cannot proceed. Reallocate workers to resolve the deficit.",
        dlg_buy_food_cost: "Population exceeds self-produced food; spent {cost} coins to purchase enough food.",
        dlg_sell_food_gain: "Self-produced food exceeds population; sold surplus to gain {gain} coins.",
        dlg_game_over_no_population: "Unfortunately, your town is now uninhabited and has become a ghost town. After {round} turns, Game Over.",
        dlg_game_over_bankrupt: "Unfortunately, after 3 consecutive deficit turns, the town declared bankruptcy. After {round} turns, Game Over.",
        dlg_debt_warning: "The town is in deficit. Turn profitable within {round} turns or the town goes bankrupt and the game ends.",
        dlg_committee_destroyed: "Unfortunately, your {name} was destroyed by desertification. After {round} turns, Game Over.",
        dlg_plants_dead: "Due to harsh conditions, {num} plants died in the desert.",
        erosion_improve_prefix: "With restoration efforts",
        erosion_up_sand_to_dirt: ", {n} sand tiles improved to dirt",
        erosion_up_dirt_to_grass: ", {n} dirt tiles improved to grass",
        erosion_degrade_prefix: "Affected by harsh environment",
        erosion_down_dirt_to_sand: ", {n} dirt tiles degraded to sand",
        erosion_down_grass_to_dirt: ", {n} grass tiles degraded to dirt",
        erosion_water_to_dirt: ", {n} water tiles degraded to dirt",
        erosion_stone_to_sand: ", {n} construction tiles degraded to sand; buildings on them were damaged",
        period_full_stop: ".",
        soil_moisture_increase_prefix: "Per turn Soil Moisture + ",
        soil_moisture_increase_suffix: "Max Soil Moisture Raised to ",
        population_label: "Survival Rate: ",
        need_labors: "There are no extra manpower points available in the town at present. Please reduce the staff at other workplaces first to increase your available manpower points.",
        residential_intro: "Residential building, attracts {num} residents.",
        residential_happiness_gain: "Residents gain +{val} happiness.",
        lodger_residents: "Residents: {num}",
        lodger_happiness_here: "Happiness here: {val}",
        lodger_sources_header: "Sources of happiness:",
        lodger_house_self: "{val} from the house itself",
        lodger_source_item: "{val} from {name} at distance {dist}",
    };

    static plantIntroZh = [
        "清除植物：可以将一个地块上的植物清除。需要花费1点金币。不能清除石头或建筑物。",
        "梭梭树：可以在一个空地块上种植梭梭树。需要花费2点金币。梭梭树每回合需要人工维护，否则容易被动物啃食。",
        "沙棘：可以在一个空地块上种植沙棘。需要花费2点金币。沙棘每个工人能提高生存率且每回合能获得1点粮食。",
        "花棒：可以在一个空地块上种植花棒。需要花费2点金币。花棒需要人工维护，否则容易被动物啃食或生病。",
        "沙地云杉：可以在一个空地块上种植沙地云杉。需要花费2点金币。沙地云杉不需要人工维护，但生长较慢。",
        "侧柏：可以在一个空地块上种植侧柏。需要花费2点金币。侧柏不需要人工维护，但必须种在泥地或草地上。",
        "农田：可以在一个空地块上种植农田。需要花费2点金币。农田每个工人获得2点粮食，但只能种在草地上。",
        "高级农田：可以在一个空地块上种植高级农田。需要花费200点金币。高级农田每个工人获得10点粮食与10枚金币，但只能种在草地上。",
    ];

    static plantIntroEn = [
        "Remove Plant: Clear plants on a tile. Costs 1 coin. Cannot clear rocks/buildings.",
        "Saxaul: Plant saxaul on an empty tile. Costs 2 coins. Needs maintenance each turn.",
        "Sea Buckthorn: Plant on an empty tile. Costs 2 coins. Each worker increases survival; +1 food per turn.",
        "Sweetvetch: Plant on an empty tile. Costs 2 coins. Needs maintenance each turn, or it may be grazed or diseased.",
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
        "快餐店：为市民提供餐饮与娱乐。每位工作人员产生5点金钱，4格以内的住宅建筑提供5点幸福度。",
        "大礼堂：文化场所。每位工作人员产生5点文化、5点金钱，5格以内的住宅建筑提供5点幸福度。",
        "体育馆：每位工作人员产生5点文化、5点金钱，6格以内的住宅建筑提供5点幸福度。",
        "生态度假区：每位工作人员产生5点文化、10点金钱，6格以内的住宅建筑提供5点幸福度。",
        "学校：每位工作人员产生5点文化，花费2点金钱。",
        "活动室：每位工作人员产生8点文化，花费4点金钱。",
        "图书馆：每位工作人员产生12点文化，花费6点金钱。",
        "研究所：每位工作人员产生20点文化，花费8点金钱。",
        "文化产业园：每位工作人员产生20点文化，5点金钱。",
        "木材厂：每位工作人员产生5点金钱；每邻接一棵云杉/侧柏，收入+1。受噪声影响，2格以内的住宅幸福度-5。",
        "采石场：每位工作人员产生5点金钱；每邻接一格岩石，收入+3。受噪声与粉尘影响，3格以内的住宅幸福度-5。",
        "风力磨坊：每位工作人员产生10点金钱。受噪声影响，3格以内的住宅幸福度-5。",
        "手工加工厂：每位工作人员产生20点金钱。受噪声影响，3格以内的住宅幸福度-10。",
        "重工厂：每位工作人员产生40点金钱。受噪声影响，3格以内的住宅幸福度-15。",
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
        "Fast Food: Each worker produces 5 coins; +5 happiness to houses within 4 tiles.",
        "Auditorium: Each worker produces 5 culture, 5 coins; +5 happiness within 5 tiles.",
        "Stadium: Each worker produces 5 culture, 5 coins; +5 happiness within 6 tiles.",
        "Eco Resort: Each worker produces 5 culture, 10 coins; +5 happiness within 6 tiles.",
        "School: Each worker produces 5 culture; costs 2 coins.",
        "Activity Room: Each worker produces 8 culture; costs 4 coins.",
        "Library: Each worker produces 12 culture; costs 6 coins.",
        "Research Institute: Each worker produces 20 culture; costs 8 coins.",
        "Culture Industry Park: Each worker produces 20 culture and 5 coins.",
        "Lumber Mill: Each worker produces 5 coins; +1 income per adjacent spruce/thuja; -5 happiness to houses within 2 tiles.",
        "Quarry: Each worker produces 5 coins; +3 income per adjacent rock; -5 happiness to houses within 3 tiles.",
        "Windmill: Each worker produces 10 coins; -5 happiness to houses within 3 tiles.",
        "Handicraft Factory: Each worker produces 20 coins; -10 happiness to houses within 3 tiles.",
        "Heavy Industry: Each worker produces 40 coins; -15 happiness to houses within 3 tiles.",
        "High-tech Park: Each worker produces 40 coins.",
        "Carbon Capture Workshop: Each worker produces 60 coins.",
    ];

    static plantNameZh = [
        "清除植物","梭梭树","沙棘","花棒","沙地云杉","侧柏","农田","高级农田"
    ];
    static plantNameEn = [
        "Remove Plant","Saxaul","Sea Buckthorn","Sweetvetch","Spruce","Thuja","Farm","Advanced Farm"
    ];
    static buildNameZh = [
        "清除建筑","建设用地","建设水体","复土还绿",
        "棚屋","平房小院","洋房别墅","公寓楼","高层住宅","垂直森林",
        "商店街","公园","快餐店","大礼堂","体育馆","生态度假区",
        "学校","活动室","图书馆","研究所","文化产业园",
        "木材厂","采石场","风力磨坊","手工加工厂","重工厂","高新产业园","固碳车间"
    ];
    static buildNameEn = [
        "Remove Building","Construction Land","Build Water","Restore Green",
        "Shed","Courtyard House","Villa","Apartment","High-rise","Vertical Forest",
        "Shopping Street","Park","Fast Food","Auditorium","Stadium","Eco Resort",
        "School","Activity Room","Library","Research Institute","Culture Industry Park",
        "Lumber Mill","Quarry","Windmill","Handicraft Factory","Heavy Industry","High-tech Park","Carbon Capture Workshop"
    ];
    static tileNameZh = ["沙地","泥地","草地","水体","建设用地","沙坡","泥坡","草坡"];
    static tileNameEn = ["Sand","Dirt","Grass","Water","Construction","Sand Hill","Dirt Hill","Grass Hill"];

    static cultureNameZh = [
        "三农改革","旱地培育","农业代加工","技术教育","美丽乡村","新农村建设","农业机械化","农民职业化","文化建设","便民生活圈","城镇化","岩土工程","工业自动化","普及\n公共服务","精神文明\n建设","城市化","清洁能源","产业升级","科技创新","全民健身","生态文明\n建设","生物科技","碳中和贸易","全民科普","绿色服务业",
    ];

    static cultureNameEn = [
        "Rural Reform","Dryland Cultivation","Agro-processing","Technical Education","Beautiful Countryside","New Rural Construction","Agricultural Mechanization","Farmer Professionalization","Cultural Development","Convenience Life Circle","Urbanization","Geotechnical Engineering","Industrial Automation","Universal\nPublic Services","Spiritual Civilization\nConstruction","Metropolitanization","Clean Energy","Industrial Upgrade","Technological Innovation","National Fitness","Ecological Civilization\nConstruction","Biotechnology","Carbon-neutral Trade","Popular Science","Green Services",
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
        "将农村人口转化为城镇人口的过程。完成此研究将解锁建筑\"公寓楼\"，\"村委会\"改名为“镇政府”，最大工作人员数提升至8人，幸福度的影响范围提升至5单元格。",
        "岩土工程：研究此技术后，可以移除岩石，可以解锁建筑“建设水体”。",
        "工业自动化：研究此技术后，将解锁建筑“重工厂”。",
        "普及公共服务：研究此技术后，将解锁建筑“图书馆”。",
        "精神文明建设：研究此技术后，将解锁建筑“大礼堂”。",
        "进一步完成现代城市转型，完成此研究将解锁建筑\"高层住宅\"，并将\"镇政府\"的最大工作人员数提升至9人，幸福度的影响范围提升至6单元格。",
        "清洁能源：研究此技术后，所有工业建筑对环境产生的幸福度降低影响变为原来的1/5。“风力磨坊”可以发电，每位工人产出的金币变为30。",
        "产业升级：研究此技术后，将解锁建筑“高新产业园”。",
        "科技创新：研究此技术后，将解锁建筑“研究所”。",
        "全民健身：研究此技术后，将解锁建筑“体育馆”。",
        "打造可持续发展的、面向未来的城市。完成此研究将解锁建筑\"垂直森林\"，并将\"镇政府\"的幸福度影响范围提升至9单元格。",
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
        "Metropolitanization: Unlocks High-rise; Town Government max workers to 9; happiness range +6.",
        "Clean Energy: Industrial negative happiness reduced to 1/5; Windmill produces 30 coins per worker.",
        "Industrial Upgrade: Unlocks High-tech Park.",
        "Technological Innovation: Unlocks Research Institute.",
        "National Fitness: Unlocks Stadium.",
        "Ecological Civilization Construction: Unlocks Vertical Forest; Town Government happiness range +9.",
        "Biotechnology: All sand-control plants have 100% survival without workers; all plant food production doubled.",
        "Carbon-neutral Trade: Unlocks Carbon Capture Workshop.",
        "Popular Science: Unlocks Culture Industry Park.",
        "Green Services: Unlocks Eco Resort.",
    ];
}
