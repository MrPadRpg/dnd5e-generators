const express = require("express");
const http = require('http');
const https = require('https');
const fs = require('fs');
var seedrandom = require('seedrandom');
const app = express();

app.use( express.static("public") );
app.use( express.urlencoded({ extended: false }) );
app.use( express.json() );

app.set("view engine", "ejs");
app.set("views", "./views");

var HTTPport = 3000;
var HTTPSport = 3443;

// HTTP
http
  .createServer(app)
  .listen(HTTPport, ()=>{
    console.log("Express HTTP server listening on port " + HTTPport);
});

var options = {
  key: fs.readFileSync('./ssl/privatekey.pem'),
  cert: fs.readFileSync('./ssl/certificate.pem'),
};

// HTTPS
https.createServer(options, app).listen(HTTPSport, ()=>{
    console.log("Express HTTPs server listening on port " + HTTPSport);
  });

function getRandomInt(max) {
  var rng = seedrandom('added entropy.', { entropy: true });
  //console.log(Math.floor(rng() * max));
  //return Math.floor(Math.random() * max);
  return Math.floor(rng() * max);
}

function compareName(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

function compareRarety(a, b) {
  if (a.rarety < b.rarety) {
    return -1;
  }
  if (a.rarety > b.rarety) {
    return 1;
  }
  return 0;
}

function comparePrice(a, b) {

  let aPrice = parseInt(a.price);
  let bPrice = parseInt(b.price);

  if (aPrice < bPrice) {
    //console.log(aPrice + "|" + bPrice + "|" + "-1");
    return -1;
  }
  if (aPrice > bPrice) {
    //console.log(aPrice + "|" + bPrice + "|" + "1");
    return 1;
  }
  //console.log(aPrice + "|" + bPrice + "|" + "0");
  return 0;
}

function fieldSorter(fields) {
  return function(a, b) {
    return fields
      .map(function(o) {
        var dir = 1;
        if (o[0] === '-') {
          dir = -1;
          o = o.substring(1);
        }
        if (a[o] > b[o]) return dir;
        if (a[o] < b[o]) return -(dir);
        return 0;
      })
      .reduce(function firstNonZeroValue(p, n) {
        return p ? p : n;
      }, 0);
  };
}

//https://ceryliae.github.io/5edmscreen/#WorldBuilding

//names
let beg_rawdata = fs.readFileSync('data/beginning.json');
let beginning = JSON.parse(beg_rawdata);
let mid_rawdata = fs.readFileSync('data/middle.json');
let middle = JSON.parse(mid_rawdata);
let end_rawdata = fs.readFileSync('data/end.json');
let end = JSON.parse(end_rawdata);

let drakeide_male_name = JSON.parse(fs.readFileSync('data/drakeide_names/male.json'));
let drakeide_female_name = JSON.parse(fs.readFileSync('data/drakeide_names/female.json'));
let drakeide_clan_name = JSON.parse(fs.readFileSync('data/drakeide_names/clan.json'));

let demiorc_male_name = JSON.parse(fs.readFileSync('data/demiorc_names/male.json'));
let demiorc_female_name = JSON.parse(fs.readFileSync('data/demiorc_names/female.json'));

let elfe_male_name = JSON.parse(fs.readFileSync('data/elfe_names/male.json'));
let elfe_female_name = JSON.parse(fs.readFileSync('data/elfe_names/female.json'));
let elfe_children_name = JSON.parse(fs.readFileSync('data/elfe_names/children.json'));
let elfe_family_name = JSON.parse(fs.readFileSync('data/elfe_names/family.json'));

let gnome_male_name = JSON.parse(fs.readFileSync('data/gnome_names/male.json'));
let gnome_female_name = JSON.parse(fs.readFileSync('data/gnome_names/female.json'));
let gnome_clan_name = JSON.parse(fs.readFileSync('data/gnome_names/clan.json'));

let halfling_male_name = JSON.parse(fs.readFileSync('data/halfling_names/male.json'));
let halfling_female_name = JSON.parse(fs.readFileSync('data/halfling_names/female.json'));
let halfling_family_name = JSON.parse(fs.readFileSync('data/halfling_names/family.json'));

let dwarf_male_name = JSON.parse(fs.readFileSync('data/dwarf_names/male.json'));
let dwarf_female_name = JSON.parse(fs.readFileSync('data/dwarf_names/female.json'));
let dwarf_clan_name = JSON.parse(fs.readFileSync('data/dwarf_names/clan.json'));

let tiefflin_male_name = JSON.parse(fs.readFileSync('data/tiefflin_names/male.json'));
let tiefflin_female_name = JSON.parse(fs.readFileSync('data/tiefflin_names/female.json'));
let tiefflin_vertu_name = JSON.parse(fs.readFileSync('data/tiefflin_names/vertu.json'));

//npcs
let pnjs_rawdata = fs.readFileSync('data/pnjs.json');
let pnjs = JSON.parse(pnjs_rawdata);

let npcs_rawdata = fs.readFileSync('data/npc.json');
let npcs = JSON.parse(npcs_rawdata);

//om
let magicItems_rawdata = fs.readFileSync('data/om_sane_price.json');
let magicItems = JSON.parse(magicItems_rawdata);

//wild magic
let wildMagic_rawdata = fs.readFileSync('data/wildmagic.json');
let wildMagic = JSON.parse(wildMagic_rawdata);


app.get("/", function(request, response) {

  response.render("homePage");

});

app.get("/pnj", function(request, response) {

  const fs = require('fs');

  let particularite = pnjs.particularite.values[getRandomInt(20)];

  let ideaux = { 
    good:pnjs.ideaux.good.values[getRandomInt(6)],
    evil:pnjs.ideaux.evil.values[getRandomInt(6)],
    lawful:pnjs.ideaux.lawful.values[getRandomInt(6)],
    chaotic:pnjs.ideaux.chaotic.values[getRandomInt(6)],
    neutral:pnjs.ideaux.neutral.values[getRandomInt(6)],
    other:pnjs.ideaux.other.values[getRandomInt(6)]
  };

  let bond = pnjs.bonds.values[getRandomInt(10)];

  let flaw_secret = pnjs.flaws_secrets.values[getRandomInt(12)];

  let prejudiceNumber=getRandomInt(6);

  let npc = {
    facial_features:{
      eyes:npcs.facial_features.eyes.values[getRandomInt(20)],
      ears:npcs.facial_features.ears.values[getRandomInt(12)],
      mouth:npcs.facial_features.mouth.values[getRandomInt(10)],
      nose:npcs.facial_features.nose.values[getRandomInt(12)],
      chin_jaw:npcs.facial_features.chin_jaw.values[getRandomInt(8)],
      hair:npcs.facial_features.hair.values[getRandomInt(20)],
      other:npcs.facial_features.other.values[getRandomInt(8)]
    },
    physical_traits:{
      height:npcs.physical_traits.height.values[getRandomInt(6)],
      body:npcs.physical_traits.body.values[getRandomInt(20)],
      hands:npcs.physical_traits.hands.values[getRandomInt(6)],
      scars:npcs.physical_traits.scars.values[getRandomInt(4)]
    },
    accessories:{
      tattoo:npcs.accessories.tattoo.values[getRandomInt(12)],
      jewerly:npcs.accessories.jewerly.values[getRandomInt(12)],
      jewelry_made_of:npcs.accessories.jewelry_made_of.values[getRandomInt(8)],
      gemstones:npcs.accessories.jewelry_made_of.gemstones[getRandomInt(12)],
      clothes:npcs.accessories.clothes.values[getRandomInt(8)]
    },
    emotions_attitudes:{
      calm_trait:npcs.emotions_attitudes.calm_trait.values[getRandomInt(32)],
      stress_trait:npcs.emotions_attitudes.stress_trait.values[getRandomInt(32)],
      mood:npcs.emotions_attitudes.mood.values[getRandomInt(20)]
    },
    faith_beliefs:{
      faith:npcs.faith_beliefs.faith.values[getRandomInt(8)],
      prejudice_name:npcs.faith_beliefs.prejudice.values[prejudiceNumber].name,
      prejudice_target:npcs.faith_beliefs.prejudice.values[prejudiceNumber].values[getRandomInt(npcs.faith_beliefs.prejudice.values[prejudiceNumber].values.length)]
    },
    flaws:npcs.flaws.values[getRandomInt(20)]
  };

  response.render("pnjPage", {
    particularite: particularite,
    ideaux: ideaux,
    bond: bond,
    flaw_secret: flaw_secret,
    npc: npc
  });

});

app.get("/abilities", function(request, response) {

  const fs = require('fs');

  let resultStandard = [];

  for(var i=0; i<6; i++){

    let res1 = getRandomInt(6)+1;
    let res2 = getRandomInt(6)+1;
    let res3 = getRandomInt(6)+1;
    let res4 = getRandomInt(6)+1;

    let totalTemp = res1 + res2 + res3 + res4;

    let minValue = Math.min(res1, res2, res3, res4);

    resultStandard.push(totalTemp - minValue);

  }

  let resultMatrix = [];

  for(var i=0; i<9; i++){

    let res1 = getRandomInt(6)+1;
    let res2 = getRandomInt(6)+1;
    let res3 = getRandomInt(6)+1;
    let res4 = getRandomInt(6)+1;

    let totalTemp = res1 + res2 + res3 + res4;

    let minValue = Math.min(res1, res2, res3, res4);

    resultMatrix.push(totalTemp - minValue);

  }

  let resultHard = [];

  for(var i=0; i<6; i++){

    let res1 = getRandomInt(6)+1;
    let res2 = getRandomInt(6)+1;
    let res3 = getRandomInt(6)+1;

    let totalTemp = res1 + res2 + res3;

    resultHard.push(totalTemp);

  }
    
  let resultSoft = [];

  for(var i=0; i<6; i++){

    let res1 = getRandomInt(4)+1;
    let res2 = getRandomInt(4)+1;
    let res3 = getRandomInt(4)+1;
    let res4 = getRandomInt(4)+1;

    let totalTemp = res1 + res2 + res3 + res4 + 4;

    resultSoft.push(totalTemp);

  }
  

  response.render("abilitiesPage", {
    resultStandard: resultStandard,
    resultMatrix: resultMatrix,
    resultHard: resultHard,
    resultSoft: resultSoft
  });

});

app.get("/name", function(request, response) {

  let names = [
    {
      name: beginning.values[getRandomInt(20)] + middle.values[getRandomInt(20)] + end.values[getRandomInt(20)]
    },
    {
      name: beginning.values[getRandomInt(20)] + middle.values[getRandomInt(20)] + end.values[getRandomInt(20)]
    },
    {
      name: beginning.values[getRandomInt(20)] + middle.values[getRandomInt(20)] + end.values[getRandomInt(20)]
    },
    {
      name: beginning.values[getRandomInt(20)] + middle.values[getRandomInt(20)] + end.values[getRandomInt(20)]
    },
    {
      name: beginning.values[getRandomInt(20)] + middle.values[getRandomInt(20)] + end.values[getRandomInt(20)]
    },
    {
      name: beginning.values[getRandomInt(20)] + middle.values[getRandomInt(20)] + end.values[getRandomInt(20)]
    },
    {
      name: beginning.values[getRandomInt(20)] + middle.values[getRandomInt(20)] + end.values[getRandomInt(20)]
    },
    {
      name: beginning.values[getRandomInt(20)] + middle.values[getRandomInt(20)] + end.values[getRandomInt(20)]
    },
    {
      name: beginning.values[getRandomInt(20)] + middle.values[getRandomInt(20)] + end.values[getRandomInt(20)]
    },
    {
      name: beginning.values[getRandomInt(20)] + middle.values[getRandomInt(20)] + end.values[getRandomInt(20)]
    }
  ];

  let drakeide_names = { male:drakeide_male_name.values[getRandomInt(50)],female:drakeide_female_name.values[getRandomInt(50)],clan:drakeide_clan_name.values[getRandomInt(50)]};
  let demiorc_names = { male:demiorc_male_name.values[getRandomInt(50)],female:demiorc_female_name.values[getRandomInt(50)]};
  let elfe_names = { male:elfe_male_name.values[getRandomInt(50)],female:elfe_female_name.values[getRandomInt(50)],children:elfe_children_name.values[getRandomInt(50)],family:elfe_family_name.values[getRandomInt(50)]};
  let gnome_names = { male:gnome_male_name.values[getRandomInt(50)],female:gnome_female_name.values[getRandomInt(50)],clan:gnome_clan_name.values[getRandomInt(50)]};
  let halfling_names = { male:halfling_male_name.values[getRandomInt(50)],female:halfling_female_name.values[getRandomInt(50)],family:halfling_family_name.values[getRandomInt(50)]};
  let dwarf_names = { male:dwarf_male_name.values[getRandomInt(50)],female:dwarf_female_name.values[getRandomInt(50)],clan:dwarf_clan_name.values[getRandomInt(50)]};
  let tiefflin_names = { male:tiefflin_male_name.values[getRandomInt(50)],female:tiefflin_female_name.values[getRandomInt(50)],clan:tiefflin_vertu_name.values[getRandomInt(50)]};
  
  response.render("namePage", {
    names: names,
    drakeide_names: drakeide_names,
    demiorc_names: demiorc_names,
    elfe_names: elfe_names,
    gnome_names: gnome_names,
    halfling_names: halfling_names,
    dwarf_names: dwarf_names,
    tiefflin_names: tiefflin_names
  });

});

app.get("/om", function(request, response) {

  const fs = require('fs');

  let typeFilter = request.query.type;
  let raretyFilter = request.query.rarety;
  let linkFilter = request.query.link;
  let cursedFilter = request.query.cursed;
  let sentientFilter = request.query.sentient;

  let sortingFilter = request.query.sorting;

  let items = magicItems.items;

  if (typeFilter) {
    items = items.filter(item => item.type == typeFilter);
  }
  if (raretyFilter) {
    items = items.filter(item => item.rarety == raretyFilter);
  }
  if (linkFilter) {
    if (linkFilter == "Lien nécessaire") {
      items = items.filter(item => item.link == true);
    } else {
      items = items.filter(item => item.link == false);
    }
  }
  if (cursedFilter) {
    if (cursedFilter == "Maudit") {
      items = items.filter(item => item.cursed == true);
    } else {
      items = items.filter(item => item.cursed == false);
    }
  }
  if (sentientFilter) {
    if (sentientFilter == "Intelligent") {
      items = items.filter(item => item.sentient == true);
    } else {
      items = items.filter(item => item.sentient == false);
    }
  }

  if (sortingFilter == "Prix") {
    items = items.sort(fieldSorter(["price", "name"]));
  } else if (sortingFilter == "Rareté") {
    items = items.sort(fieldSorter(["rarety", "name"]));
  } else {
    items = items.sort(compareName);
  }


  response.render("omPage", {
    magicItems: items,
    typeFilter: typeFilter,
    raretyFilter: raretyFilter,
    linkFilter: linkFilter,
    cursedFilter: cursedFilter,
    sentientFilter: sentientFilter,
    sortingFilter: sortingFilter
  });

});

app.get("/wildmagic", function(request, response) {

  const fs = require('fs');

  let rnd_01 = getRandomInt(100);
  let rnd_02 = getRandomInt(100);
  let rnd_03 = getRandomInt(100);
  let rnd_d20 = (getRandomInt(20) + 1);

  let wm_standard = wildMagic.standard.values[rnd_01];
  let wm_hb1 = wildMagic.homebrew_1.values[rnd_02];
  let wm_hb2_extreme = wildMagic.homebrew_2.values_extreme[rnd_03];
  let wm_hb2_moderate = wildMagic.homebrew_2.values_moderate[rnd_03];
  let wm_hb2_nuisance = wildMagic.homebrew_2.values_nuisance[rnd_03];

  response.render("wildmagicPage", {
    wm_standard: wm_standard,
    wm_hb1: wm_hb1,
    wm_hb2_extreme: wm_hb2_extreme,
    wm_hb2_moderate: wm_hb2_moderate,
    wm_hb2_nuisance: wm_hb2_nuisance,
    wm_standard_result: (rnd_01 + 1),
    wm_hb1_result: (rnd_02 + 1),
    wm_hb2_result: (rnd_03 + 1),
    rnd_d20: rnd_d20
  });

});

app.get("/dice", function(request, response) {

  response.render("dicePage");

});

app.post('/launch', (req, res) => {
  //const click = {clickTime: new Date()};
  //console.log(click);

  /*console.log(req.body.dice_number);
  console.log(req.body.dice_type);
  console.log(getRandomInt(100));*/
  let result = 0;
  let detail = [];

  let number = parseInt(req.body.dice_number);
  let bonus = parseInt(req.body.dice_bonus);

  for(var i=0;i<number;i++){
    var rnd = getRandomInt(req.body.dice_type) + 1;
    result += (rnd);
    detail.push(rnd);
  }

  result += bonus;

  //console.log(result);
  //console.log(detail);
  res.send({result:result,detail:detail,bonus:bonus});
});

/*
let results=[]

for(var i=0;i<100;i++){
  results.push(getRandomInt(20));
}

results.sort();

console.log(results);
*/