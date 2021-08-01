const fs = require('fs').promises;
const current = __dirname;

const ROLE_MAP = {
    "knight" : "ナイト",
    "warrior" : "ウォリアー",
    "assassin" : "アサシン",
    "mage" : "メイジ",
    "manauser" : "プリースト",
    "ranger" : "アーチャー"
};

const ATTR_MAP = {
    "wind" : "木",
    "fire" : "火",
    "ice"  : "氷",
    "light": "光",
    "dark" : "闇"
};

module.exports = async (context) => {
    const names = {};
    (await fs.readFile(current + '\\name.properties', 'utf-8')).split("\n").forEach(text => {
        const entries = text.split("=");
        if(entries.length == 2) {
            names[entries[0].trim()] = entries[1].trim();
        }
    });

    context["st"] = {
        toId : async (name) => {
            return names[name];
        },

        loadData : async (id) => {
            const json = JSON.parse(await fs.readFile(current + '\\json\\' + id + ".json", 'utf-8'));
            return json;
        }
    };

    return async (message, client, commands) => {
        const name = commands[2].replace(/\s+/g, "");;

        const heroid = names[name];
        if(heroid === undefined) {
            message.reply(name + "の情報は存在しません。").catch(console.error);
            return;
        }
    
        const json = JSON.parse(await fs.readFile(current + '\\json\\' + heroid + ".json", 'utf-8'));
        const status = json.calculatedStatus.lv60SixStarFullyAwakened;
    
        const description = "" +
            "```" + "\r\n" +
            "[status]" + "\r\n" +
            "  攻撃　　:"+ status.atk + "\r\n" +
            "  防御　　:"+ status.def + "\r\n" +
            "  生命　　:"+ status.hp + "\r\n" +
            "  スピード:"+ status.spd + "\r\n" +
            "  クリ発　:"+ (status.chc*100) + "\r\n" +
            "  クリダメ:"+ (status.chd*100) + "\r\n" +
            "  効果命中:"+ (status.eff*100) + "\r\n" +
            "  効果抵抗:"+ (status.efr*100) + "\r\n" +
            "  連携　　:"+ (status.dac*100) + "\r\n" +
            "```"+ "\r\n" +
            "```" + "\r\n" +
            "[skill1]" + "\r\n" +
            " (" + json.localize.skill1.name + ")\r\n" +
            "" + json.localize.skill1.desc
                + (json.localize.skill1.soul_description !== "" ? "\r\n(魂力)" + json.localize.skill1.soul_description : "") + "\r\n" +
            "\r\n"+
            "[skill2]" + "\r\n" +
            "(" + json.localize.skill2.name + ")\r\n" +
            "" + json.localize.skill2.desc
                + (json.localize.skill2.soul_description !== "" ? "\r\n(魂力)" + json.localize.skill2.soul_description : "") + "\r\n" +
            "\r\n"+
            "[skill3]" + "\r\n" +
            "(" + json.localize.skill3.name + ")\r\n" +
            "" + json.localize.skill3.desc
                + (json.localize.skill3.soul_description !== "" ? "\r\n(魂力)" + json.localize.skill3.soul_description : "") + "\r\n" +
            "```"
            "";
    
        message.reply({
            embed : {
                color: 16757683,
                title: "[" +ATTR_MAP[json.attribute]+ "]　" + json.localize.name + "　[" +ROLE_MAP[json.role]+ "]" ,
                url: "https://epicsevendb.com/jp/hero/"+heroid,
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: "©️ fmnb0516-ep7-bot"
                },
                thumbnail: {
                    url: json.assets.icon
                },
                description : description
            }
        });
    };
};
