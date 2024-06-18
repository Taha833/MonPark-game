require('dotenv').config();
const { Telegraf } = require('telegraf');
const db = require('./firebase');
const firebase = require("firebase/compat/app");
const port = process.env.PORT || 8000;


const express = require('express');
const cors = require('cors')
const app = express();
app.use(express.json());

app.use(cors({
    origin: [
        'https://monpark.xyz',
        'http://localhost:3000',
        'https://2ca5-38-137-17-71.ngrok-free.app'
    ]
}))

app.post('/api', (req, res) => {
    console.log('api working ', req.body)
    res.json({ message: 'Hello from API!' });
})

app.get('/', (req, res) => {
    res.send('Hello from my Express server!');
});

app.listen(port, () => {
    console.log('Server is running on port ', port);
})







db.collection('users').get().then(data => data.forEach(doc => {
    console.log(doc.data())
}))

const Token = process.env.NODE_ENV === 'production' ? process.env.BOT_API : process.env.TEST_API
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

    ctx.reply('Play game now',
        {
            reply_markup: {
                inline_keyboard: [[{
                    text: 'Open', web_app: {
                        url: 'https://2ca5-38-137-17-71.ngrok-free.app/'
                    }
                }]]
            }
        })
});

Bot.launch()