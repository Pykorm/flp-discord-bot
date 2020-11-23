const Discord = require('discord.js');
const client = new Discord.Client();
const data = require("./data.json")
const fs=  require('fs');
let currentInscriptionChannel = {}
let welcomeChannelId

const classe = [
    "term-système-numérique",
    "term-gestion-administration",
    "1ere-système-numérique",
    "1ere-gestion-administration",
    "1ere-cap-électricité",
    "1ere-epc",
    "2nd-système-numérique",
    "2nd-gestion-administration",
    "2nd-cap-électricité",
    "2nd-epc",
    "2nd-STMG",
    "2nd-STI2D",
    "BTS-SP",
    "BTS-ELT",
    "BTS-SN",
    "BTS-CI",
    "BTS-SIO",
    "FCIL",
    "Prépa",
    "CPI-MSN",
    "2nd-générale-1",
    "2nd-générale-2",
    "2nd-générale-3",
    "2nd-générale-4",
    "2nd-générale-5",
    "2nd-générale-6",
    "2nd-générale-7",
    "2nd-générale-8",
    "2nd-générale-9",
    "2nd-générale-10",
    "2nd-générale-11",
    "2nd-générale-12",
    "2nd-générale-13",
    "2nd-générale-14",
    "1ere-générale-1",
    "1ere-générale-2",
    "1ere-générale-3",
    "1ere-générale-4",
    "1ere-générale-5",
    "1ere-générale-6",
    "1ere-générale-7",
    "1ere-générale-8",
    "1ere-générale-9",
    "1ere-générale-10",
    "1ere-générale-11",
    "1ere-générale-12",
    "1ere-générale-13",
    "1ere-générale-14",
    "term-générale-1",
    "term-générale-2",
    "term-générale-3",
    "term-générale-4",
    "term-générale-5",
    "term-générale-6",
    "term-générale-7",
    "term-générale-8",
    "term-générale-9",
    "term-générale-10",
    "term-générale-11",
    "term-générale-12",
]



client.on('ready', () => {
  console.log(`Started !`);
});

client.on("message",async message => {
    if (message.author.bot) return;

    if(message.content == "--init" && message.member.hasPermission(8)) {
        formatGuild(message.guild.id)
    }
    else if (message.content == "--delete" && message.member.hasPermission(8)) {
        for(c in data[message.guild.id]) {
            if(!data[message.guild.id]) continue
           for(chanIdIndex in data[message.guild.id][c]) {
                await (await client.channels.fetch(data[message.guild.id][c][chanIdIndex])).delete()       
           }
        }
    }
    else if (message.content == "--convert" && message.member.hasPermission(8)) {
        console.log("conversion !")
        createWelcomeChannelForAll(message)
    }
    else if (message.content == "--test" && message.member.hasPermission(8)) {
        //code you want to test :
        message.guild.roles.cache.each(r => r.delete().catch(console.error))
        //console.log(data[message.guild.id]);
    }
    else if (message.channel.id == data[message.guild.id].welcomeChannelId[0]) {
        if(isNaN(parseInt(message.content))) {
            message.delete()
            return
        }
        else if (parseInt(message.content) <= classe.length) {
            data[message.guild.id][classe[parseInt(message.content) - 1]].forEach(async chanId => {
                let chan = message.guild.channels.cache.get(chanId)
                if(!chan) console.error("Problème en tentant d'ajouter un membre a son channel de classe : Le channel n'existe pas.")
                await chan.createOverwrite(message.author.id, {VIEW_CHANNEL : true})
                .catch(console.error)
            })
            await message.member.roles.add(await message.guild.roles.fetch(data.eleveRoleId))
            message.guild.channels.cache.get(message.channel.id).createOverwrite(message.author.id, {VIEW_CHANNEL: false})
            await message.delete()
        }
        else if (parseInt(message.content) > classe.length){
            message.delete()
            return
        }
    }
})




async function formatGuild(unformated){
    const guild = await client.guilds.fetch(unformated)
    //make roles
    data.eleveRoleId = (await guild.roles.create({
        data:{
            name: "élève",
            color: "BLUE"
        }
    })).id
    await guild.roles.create({
        data:{
            name: "première",
            color: "AQUA"
        }
    })
    await guild.roles.create({
        data:{
            name: "seconde",
            color: "AQUA"
        }
    })
    await guild.roles.create({
        data:{
            name: "terminale",
            color: "AQUA"
        }
    })
    await guild.roles.create({
        data:{
            name: "Pas a Dantec",
            color: "AQUA"
        }
    })

    //make categories
    let category = await guild.channels.create("tes-salons", {type: "category", permissionOverwrites: [
        {
            id: guild.roles.everyone.id,
            deny: ["VIEW_CHANNEL"]
        }
    ]})
    let category2 = await guild.channels.create("tes-salons", {type: "category", permissionOverwrites: [
        {
            id: guild.roles.everyone.id,
            deny: ["VIEW_CHANNEL"]
        }
    ]})
    let category3 = await guild.channels.create("tes-vocaux", {type: "category", permissionOverwrites: [
        {
            id: guild.roles.everyone.id,
            deny: ["VIEW_CHANNEL"]
        }
    ]})
    let category4 = await guild.channels.create("tes-vocaux", {type: "category", permissionOverwrites: [
        {
            id: guild.roles.everyone.id,
            deny: ["VIEW_CHANNEL"]
        }
    ]})

    //make channels
    let welcomeChannel = await guild.channels.create("welcome", {type: "text", permissionOverwrites: [
        {
            id: guild.roles.everyone.id,
            allow: ["VIEW_CHANNEL"]
        },
        {
            id: data.eleveRoleId,
            deny: ["VIEW_CHANNEL"]
        }
    ]})

    const this_guild = {
        "category": [category.id, category2.id, category3.id, category4.id],
        welcomeChannelId: [welcomeChannel.id]
    }
    for(index in classe) {
        let c = classe[index]
        this_guild[c] = [
            (await guild.channels.create(c, {
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: ["VIEW_CHANNEL"]
                    }
                ],
                parent: index <= 19 ? category : category2
            })).id,
            (await guild.channels.create(c, {
                type: "voice",
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: ["VIEW_CHANNEL"]
                    }
                ],
                parent: index <= 19 ? category3 : category4
            })).id
        ]
    }
    data[guild.id] = this_guild
    fs.writeFileSync("./data.json", JSON.stringify(data))
    
    await welcomeChannel.send(`@everyone Bienvenue sur le discord du lycée Félix Le Dantec !
    Écrit le numéro de ta classe pour rejoindre le discord.
    1- term-système-numérique
    2- term-gestion-administration
    3- 1ere-système-numérique
    4- 1ere-gestion-administration
    5- 1ere-cap-électricité
    6- 1ere-epc
    7- nd-système-numérique
    8- 2nd-gestion-administration
    9- 2nd-cap-électricité
    10- 2nd-epc
    11- 2nd-STMG
    12- 2nd-STI2D
    13- BTS-SP
    14- BTS-ELT
    15- BTS-SN
    16- BTS-CI
    17- BTS-SIO
    18- FCIL
    19- Prépa
    20- CPI-MSN
    21- 2nd-générale-1
    22- 2nd-générale-2
    23- 2nd-générale-3
    24- 2nd-générale-4
    25- 2nd-générale-5
    26- 2nd-générale-6
    27- 2nd-générale-7
    28- 2nd-générale-8
    29- 2nd-générale-9
    30- 2nd-générale-10
    31- 2nd-générale-11
    32- 2nd-générale-12
    33- 2nd-générale-13
    34- 2nd-générale-14
    35- 1ere-générale-1
    36- 1ere-générale-2
    37- 1ere-générale-3
    38- 1ere-générale-4
    39- 1ere-générale-5
    40- 1ere-générale-6
    41- 1ere-générale-7
    42- 1ere-générale-8
    43- 1ere-générale-9
    44- 1ere-générale-10
    45- 1ere-générale-11
    46- 1ere-générale-12
    47- 1ere-générale-13
    48- 1ere-générale-14
    49- term-générale-1
    50- term-générale-2
    51- term-générale-3
    52- term-générale-4
    53- term-générale-5
    54- term-générale-6
    55- term-générale-7
    56- term-générale-8
    57- term-générale-9
    58- term-générale-10
    59- term-générale-11
    60- term-générale-12   
    `)
}



client.login('Nzc5OTkyNDYyNjA0NjMyMDg2.X7omlg.sxtATeE2I0pp0Efl5Gq3yapjXSE');