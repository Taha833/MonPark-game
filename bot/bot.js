require('dotenv').config();
const { Telegraf } = require('telegraf');
const db = require('./firebase');
const port = process.env.PORT || 8000;


const express = require('express');
const cors = require('cors')
const app = express();
app.use(express.json());

app.use(cors({
    origin: [
        'https://monpark.xyz',
        'http://localhost:3000',
        'https://c369-38-137-17-71.ngrok-free.app'
    ]
}))

app.post('/api', async (req, res) => {
    const { data } = req.body;

    try {
        if (typeof data === 'object') {

            // console.log(req.body)
            // console.log(data, data.tgId)
            const docRef = db.collection('users').doc(data.tgId)
            await docRef.update(data)
            res.json({ message: 'data saved' });
        }
    } catch (err) {
        console.log('api err', err)

        res.status(500).json({ err })
    }

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
    ctx.reply('Play game now test',
        {
            reply_markup: {
                inline_keyboard: [[{
                    text: 'Open', web_app: {
                        url: 'https://c369-38-137-17-71.ngrok-free.app'
                    }
                }]]
            }
        })
});

Bot.launch()