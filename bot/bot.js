require('dotenv').config();
const { Telegraf } = require('telegraf');
const db = require('./firebase');
const firebase = require("firebase/compat/app");

db.collection('users').get().then(data => data.forEach(doc => {
    console.log(doc.data())
}))

const Token = process.env.BOT_API
const Bot = new Telegraf(Token)

Bot.start((ctx) => {
    const userId = ctx.message.from.id.toString();
    console.log('telegram uid ', userId)
    ctx.reply('Welcome to the MonPark🐾',
        {
            reply_markup: {
                inline_keyboard: [[{
                    text: 'Join Waitlist', web_app: {
                        url: 'https://monpark.xyz'
                    }
                }]]
            }
        })
})

Bot.command('play', async (ctx) => {
    const tg_id = ctx.message.from.id.toString();
    const timestamp = firebase.firestore.FieldValue.serverTimestamp()
    // await db.collection('users').doc(tg_id).set({
    //     tg_id,
    //     last_active: timestamp,
    //     feed_left: 100,
    //     total_income: 0,
    //     level: 1,
    //     income_per_hour: 0,
    //     shop: []
    // })

    ctx.reply('Play game',
        {
            reply_markup: {
                inline_keyboard: [[{
                    text: 'Open', web_app: {
                        url: 'https://345d-38-137-17-106.ngrok-free.app/house'
                    }
                }]]
            }
        })
});

Bot.launch()