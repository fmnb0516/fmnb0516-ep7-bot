const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs').promises;

const current = __dirname;

const run = async () => {
    const $heros = cheerio.load(await request("https://epicsevendb.com/jp/heroes")); 

    const urls = [];
    $heros(".hero-list-ul li").each( (i, elm) => {
        const element = $heros(elm);
        urls.push(element.find("a").attr("href"));
    });

    for(let i=0; i<urls.length; i++) {
        const url = urls[i];
        const json = await getHeroData(url, "https://epicsevendb.com" + url);
        const text = JSON.stringify(json, null , "\t");
        await fs.writeFile(current + '\\json\\' + json._id + '.json', text, 'utf-8');
        console.log(json.localize.name + "=" + json._id);
    }
};

const getHeroData = async (name, url) => {
    const id = url.substring(url.lastIndexOf("/") + 1);
    const json = JSON.parse(await request("https://api.epicsevendb.com/hero/" + id)).results[0];
    const localize = await request(url);
    const $ = cheerio.load(localize); 

    const skill1 = json.skills[0];
    const skill2 = json.skills[1];
    const skill3 = json.skills[2];

    json.localize = {
        name :  $(".profile h1").text().trim(),
        skill1 : {
            name : $("#スキル\\-\\#1 .skill-name").text().trim(),
            desc : $($("#スキル\\-\\#1 .skill-desc").get(0)).text().trim(),
            soul_description : skill1.soul_description ? $($("#スキル\\-\\#1 .skill-desc").get(2)).text().trim() : ""
        },
        skill2 : {
            name : $("#スキル\\-\\#2 .skill-name").text().trim(),
            desc : $($("#スキル\\-\\#2 .skill-desc").get(0)).text().trim(),
            soul_description : skill2.soul_description ? $($("#スキル\\-\\#2 .skill-desc").get(0)).text().trim() : ""
        },
        skill3 : {
            name : $("#スキル\\-\\#3 .skill-name").text().trim(),
            desc : $($("#スキル\\-\\#3 .skill-desc").get(0)).text().trim(),
            soul_description : skill3 && skill3.soul_description ? $($("#スキル\\-\\#3 .skill-desc").get(0)).text().trim() : ""
        }
    };

    return json;
};

run();