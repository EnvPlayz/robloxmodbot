require("dotenv").config();
const axios = require('axios').default
const token = process.env.token
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.MessageContent,GatewayIntentBits.GuildMessages] });
var badthing = "hoe, daddy, mom, hot, cker, shet, facker, shat, nigg, nagg"
var sensList = [
"facker",
"fock",
"focking",
"motherfock",
"motherfack",
"motherfacking",
"motherfocking",
"sussy",
 "baka",
 "nae",
 "nie",
 "focker",
 "adopted",
 "credit card",
 "phone number",
 "ip",
 "lmfao",
"maniac",
"moron",
"dog water",
"stfu",
"lemfao",
"lmao",
"lemao",
]
const usersMap = new Map();
const LIMIT = 7;
const DIFF = 5000;
function hasNumber(myString) {
    return /\d/.test(myString);
}
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // channel.send("hi im online wsg")
});

client.on('messageCreate',async message => {
    if (message.author.bot) return;
    if(message.content=="are you online bot"){
        message.reply(`yes <@${message.author.id}>`)
    }else if(message.content=="$getfilterbase$"){
        stringofbad = badthing
        for(var badextra of sensList){
            stringofbad+=badextra+" "
        }
        message.reply(stringofbad);
        (await message.channel.send("e")).url
    }
    else{
        moderate(message)
    }
});
client.on('messageUpdate', (oldMessage, newMessage) => {
    if (newMessage.author.bot) return;
    moderate(newMessage)
})
function moderate(message){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    axios.get(`https://www.purgomalum.com/service/containsprofanity?text=${message.content}&add=${badthing}`).then(async res => {
        if (res.data == true || hasNumber(message.content)) {
            message.delete().catch(function (err) {
                message.reply("Something went wrong filtering message")
            })
            axios.get(`https://www.purgomalum.com/service/json?text=${message.content}&add=${badthing}`).then(async filterdata => {
                if (filterdata.data.result == undefined) {
                    message.reply(`❌ Uh oh Error occured on message sent by <@${message.author.id}>: ${filterdata.data.error}`)
                    return false
                }
                var numReplaced = filterdata.data.result.replace(/[0-9]/g, "#");
                var tagged = numReplaced.replaceAll("*", "#")
                var sickmsg = (await message.channel.send(message.author.username + ": " + tagged))
                var dmMsg = `Our content monitors have determined that your behavior in this server has been in violation of our Terms of Use.\nReviewed: **${today}**\n**Moderator Note**: Do not swear, use profanity or otherwise say inappropriate things in this server.\nReview your message here: ${sickmsg.url}`
                message.author.send(dmMsg)
            }).catch(function () {
                console.log("Something went wrong while moderating in block 2.");
            })
        }else{
            var tagged = message.content.toLowerCase()
            var isBad = false
            for (var sensItem of sensList) {
                // var checkFilter = sensItem.toLowerCase()
                if (message.content.toLowerCase().includes(sensItem)) {
                    tagged = tagged.replace(sensItem, writeCharTillLength("#",sensItem.length))
                    isBad=true
                }
            }
            if(isBad){
                message.delete().catch(function(){
                    message.reply("Something went wrong filtering message")
                })
                var sickmsg = (await message.channel.send(message.author.username + ": " + tagged))
                var dmMsg = `Our content monitors have determined that your behavior in this server has been in violation of our Terms of Use.\nReviewed: **${today}**\n**Moderator Note**: Do not swear, use profanity or otherwise say inappropriate things in this server.\nReview your message here: ${sickmsg.url}`
                message.author.send(dmMsg)
            }
        }
    }).catch(function(err){
        console.log("Something went wrong while moderating. "+err);
    })
}
function writeCharTillLength(char,length){
    var returnRes=""
    if(length==undefined||length<1){
        length=1
    }
    for (let index = 0; index < length; index++) {
        returnRes+=char
    }
    return returnRes
}
client.login(token);