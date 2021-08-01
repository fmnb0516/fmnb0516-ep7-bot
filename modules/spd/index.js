const fs = require('fs').promises;
const current = __dirname;

const zv = (num) => {
    return num > 0 ? num : 0;
};

module.exports = async (context) => {
    return async (message, client, commands) => {
        if(commands.length !== 4) {
            message.reply("\r\n" + "[USAGE]" + "\r\n"
                + "  @[botname] [キャラ名] [目標速度]");
            return;
        }

        const target = commands[2].replace(/\s+/g, "");;
        const goalSpd = parseInt(commands[3]);
        const targetId = await context["st"]["toId"](target);

        if(targetId === undefined) {
            message.reply("\r\n" + "Not Found : " + target);
            return;
        }
        if (isNaN(goalSpd)) {
            message.reply("\r\n" + "Invalid Speed : " + goalSpd);
            return;
        }

        const json = await context["st"]["loadData"](targetId);
        const targetSpd = json.calculatedStatus.lv60SixStarFullyAwakened.spd;
        const targetSpdsetSpd = parseInt((targetSpd * 1.25));

        const SPD_REG = (goalSpd - (targetSpdsetSpd + 45)) / 5;
        const SPD_NO_REG = (goalSpd - targetSpdsetSpd) / 6;
        const OTHER_REG =  (goalSpd - (targetSpd + 45)) / 5;
        const OTHER_NO_REG = (goalSpd - targetSpd) / 6;

        const description = "" +
            "**BASE SPD**     : " +targetSpd+ "(" + targetSpdsetSpd + ") => " + goalSpd + "\r\n" +
            "**SPD+REG**      : " + zv(SPD_REG.toFixed(1)) + "\r\n" +
            "**SPD+NO-REG**   : " + zv(SPD_NO_REG.toFixed(1)) + "\r\n" +
            "**OTHER+REG**    : " + zv(OTHER_REG.toFixed(1)) + "\r\n" +
            "**OTHER+NO-REG** : " + zv(OTHER_NO_REG.toFixed(1)) + "\r\n";
            
        message.reply({
            embed : {
                color: 16757683,
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: "©️ fmnb0516-ep7-bot"
                },
                description : description
            }
        });
        
    };
};