require('dotenv').config();
const { Telegraf } = require('telegraf');
const db = require('./firebase');
const port = process.env.PORT || 8000;
const firebase = require("firebase/compat/app");

const express = require('express');
const cors = require('cors')
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.userAgent = req.headers['user-agent'];
    next();
});

const ngrok = 'https://5220-101-0-50-163.ngrok-free.app'

app.use(cors({
    origin: [
        'https://monpark.xyz',
        'http://localhost:3000',
        ngrok
    ]
}))


app.post('/upgradeLevel', async (req, res) => {
    const { tgId, foodEaten, foodLeft } = req.body
    const docRef = db.collection('users').doc(tgId)
    const doc = await docRef.get()
    const docData = await doc.data()
    const feedToNextLevel = docData.level === 0 ? 5000 : Math.floor(docData.feedToNextLevel * 1.35) // 35% increase in prev value

    if (docData.level === 0) {
        const pets = ['creature1', 'creature2', 'creature3', 'creature4']
        const selectedPet = pets[Math.floor(Math.random() * 4)]

        const updatedData = {
            petAssigned: selectedPet,
            level: docData.level + 1,
            // foodPerTap: docData.foodPerTap + 1,
            feedToNextLevel,
            foodEaten,
            foodLeft
        };

        await docRef.update(updatedData);
        const mergedData = { ...docData, ...updatedData };
        res.json({ message: 'level upgraded', mergedData })
    } else if (docData.level !== 0) {
        const refLim = Math.floor(docData.refLim * 1.5)


        const updatedData = {
            level: docData.level + 1,
            // foodPerTap: docData.foodPerTap + 1,
            feedToNextLevel,
            foodEaten,
            foodLeft,
            refLim
        };

        await docRef.update(updatedData);
        const mergedData = { ...docData, ...updatedData };
        res.json({ message: `level upgraded to ${updatedData.level}`, mergedData })
    }


    console.log(req.body)
})

const calculateFeedPerTapCost = (foodPerTap) => {
    const cost = Math.floor(150 * Math.pow(1.4, foodPerTap - 1))
    return cost
}

app.get('/feedpertap/:tgId', async (req, res) => {
    const { tgId } = req.params
    try {
        const docRef = db.collection('users').doc(tgId)
        const doc = await docRef.get()
        const docData = await doc.data()
        const foodPerTap = docData.foodPerTap
        const cost = calculateFeedPerTapCost(foodPerTap)
        res.json({ cost })

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }

})

app.post('/upgrade/feedpertap', async (req, res) => {
    const { tgId } = req.body
    try {
        const docRef = db.collection('users').doc(tgId)
        const doc = await docRef.get()
        const docData = await doc.data()
        const foodPerTap = docData.foodPerTap
        const userTotalIncome = docData.totalIncome
        const cost = calculateFeedPerTapCost(foodPerTap)

        await docRef.update({
            foodPerTap: foodPerTap + 1,
            totalIncome: userTotalIncome - cost
        })

        const userData = {
            ...docData,
            foodPerTap: foodPerTap + 1,
            totalIncome: userTotalIncome - cost
        }

        res.json({ userData, message: 'FeedTap upgraded to level ' + foodPerTap })

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }

})

app.post('/api', async (req, res) => {
    const { data } = req.body;
    try {
        if (typeof data === 'object') {
            const docRef = db.collection('users').doc(data.tgId)
            const timestamp = firebase.default.firestore.FieldValue.serverTimestamp()

            await docRef.update({ ...data, lastActive: timestamp })
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







// db.collection('users').get().then(data => data.forEach(doc => {
//     console.log(doc.data())
// }))

const Token = process.env.NODE_ENV === 'production' ? process.env.BOT_API : process.env.TEST_API
const Bot = new Telegraf(Token)

Bot.start((ctx) => {
    const userId = ctx.message.from.id.toString();
    console.log('telegram uid ', userId)
    console.log(ctx)
    const startType = ctx.message.text?.split(' ')[1]?.split('_')

    if (startType && startType[0] === "ref") {
        const refUserId = startType[1].split('=')[1]
        // check if ref user exists
        // check if the new user exists

        console.log(refUserId)
        ctx.reply('Welcome to the MonPark🐾',
            {
                reply_markup: {
                    inline_keyboard: [[{
                        text: 'Join Waitlist', web_app: {
                            // url: 'https://monpark.xyz/ref/' + refUserId
                            url: 'https://938b-101-0-50-228.ngrok-free.app/ref/' + refUserId
                        }
                    }]]
                }
            })
    } else {
        ctx.reply('Welcome to the MonPark🐾',
            {
                reply_markup: {
                    inline_keyboard: [[{
                        text: 'Join Waitlist', web_app: {
                            // url: 'https://monpark.xyz'
                            url: ngrok + '/waitlist'
                        }
                    }]]
                }
            })
    }
})


Bot.command('play', async (ctx) => {
    console.log(ctx)
    ctx.reply('Play game now test',
        {
            reply_markup: {
                inline_keyboard: [[{
                    text: 'Open', web_app: {
                        url: ngrok
                    }
                }]]
            }
        })
});



Bot.launch()