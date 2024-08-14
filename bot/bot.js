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



const ngrok = 'https://c6f0-38-137-59-249.ngrok-free.app'

app.use(cors({
    origin: [
        'https://monpark.xyz',
        'http://localhost:3000',
        ngrok
    ]
}))


app.post('/upgradeLevel', async (req, res) => {
    const { tgId, foodEaten, foodLeft } = req.body

    db.runTransaction(async (transaction) => {
        const docRef = db.collection('users').doc(tgId)
        const doc = await docRef.get()
        const docData = await doc.data()
        const feedToNextLevel = docData.level === 0 ? 5000 : Math.floor(docData.feedToNextLevel * 1.35) // 35% increase in prev value

        const lastLevelUpTime = docData.lastLevelUpTime || 0
        const currentTime = Date.now()
        if (currentTime - lastLevelUpTime < 1000) { // 1 second cooldown
            // throw new Error("Level up too frequent. Please wait.")
            res.json({ message: 'Level upgrade error' })
        }

        if (docData.level === 0) {
            const pets = ['creature1', 'creature2', 'creature3', 'creature4']
            const selectedPet = pets[Math.floor(Math.random() * 4)]

            const updatedData = {
                petAssigned: selectedPet,
                level: docData.level + 1,
                feedToNextLevel,
                foodEaten,
                foodLeft,
                lastLevelUpTime: currentTime
            };

            // await docRef.update(updatedData);
            transaction.update(docRef, updatedData)
            const mergedData = { ...docData, ...updatedData };
            res.json({ message: 'level upgraded', mergedData })
        } else if (docData.level !== 0) {
            const refLim = Math.floor(docData.refLim * 1.5)


            const updatedData = {
                level: docData.level + 1,
                feedToNextLevel,
                foodEaten,
                foodLeft,
                refLim,
                lastLevelUpTime: currentTime
            };

            // await docRef.update(updatedData);
            transaction.update(docRef, updatedData)
            console.log('transaction end')

            const mergedData = { ...docData, ...updatedData };
            res.json({ message: `level upgraded to ${updatedData.level}`, mergedData })
        }

    })
    // console.log(req.body)
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

        if (userTotalIncome < cost) {
            return res.json({ message: 'Not enough money to buy' })
        }

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

app.post('/buy', async (req, res) => {
    const { item, userData } = req.body
    try {
        const userDb = db.collection('users').doc(userData.tgId)
        const userRef = await userDb.get()
        const userShop = userRef.data().shop

        const alreadyBought = userShop.find(shopItem => shopItem.name === item.name) && true

        // check if eligible to buy
        // eligibility -> Level, money
        if (!alreadyBought && userRef.data().level < item.unlockAge) {
            return res.json({ message: 'Not old enough to buy', type: 'age' });
        }
        if (!alreadyBought && userRef.data().totalIncome < item.baseCost) return res.json({ message: 'Not enough money to buy', type: 'money' })

        if (alreadyBought && userRef.data().totalIncome < item.upgCost) return res.json({ message: 'Not enough money to buy', type: 'money' })

        const calculateUpgCost = () => {
            const newCost = item.baseCost * Math.pow(1.5, item.currLevel || 0)
            console.log(newCost)
            return Math.floor(newCost)
        }

        const calculateUpgIncome = () => {
            const newIncome = item.baseRev * Math.pow(1.15, item.currLevel || 0)
            console.log(newIncome)
            return Math.floor(newIncome)
        }

        const upgCost = calculateUpgCost()
        const upgIncome = calculateUpgIncome()

        const itemIndex = userShop.findIndex(shopItem => shopItem.name === item.name)

        if (itemIndex === -1) {

            userShop.push({
                name: item.name,
                incomePerHour: item.baseRev,
                currLevel: 1,
                upgCost,
                upgIncome,
                baseCost: item.baseCost,
                baseRev: item.baseRev,
                photoURL: item.photoURL
            })
        } else {
            userShop[itemIndex] = {
                ...userShop[itemIndex],
                name: item.name,
                incomePerHour: item.upgIncome,
                currLevel: item.currLevel + 1,
                upgCost,
                upgIncome,
            }
        }

        console.log(userShop)

        const totalIncome = alreadyBought ? userRef.data().totalIncome - item.upgCost : userRef.data().totalIncome - item.baseCost

        // const incomePerHour = alreadyBought ? userRef.data().incomePerHour + (item.upgIncome - item.incomePerHour) : userRef.data().incomePerHour + item.baseRev
        const incomePerHour = alreadyBought && item.upgIncome === item.incomePerHour ? userRef.data().incomePerHour + item.upgIncome : alreadyBought && item.upgIncome !== item.incomePerHour ? userRef.data().incomePerHour + (item.upgIncome - item.incomePerHour) : userRef.data().incomePerHour + item.baseRev;
        await userDb.update({
            shop: userShop,
            totalIncome,
            incomePerHour

        })

        const mergedData = {
            ...userRef.data(),
            shop: userShop,
            incomePerHour,
            totalIncome
        }
        console.log(item.name, ' bought')
        res.json({ message: 'bought', userData: mergedData })
        // res.json({ message: 'got it' })
    } catch (err) {
        console.error(err)
        res.json(err)
    }


})

app.post('/income', async (req, res) => {
    const { userData } = req.body
    try {
        console.log('/income ', userData)
        const userDb = db.collection('users').doc(userData.tgId)
        const userRef = await userDb.get()
        const incomePerHour = await userRef.data().incomePerHour
        // use income per hour only if income perHour > 0 
        if (incomePerHour > 0) {

            const { lastActive } = await userRef.data()
            const currDate = new Date()
            const diff = currDate - await lastActive.toDate() // milliseconds
            const diffSeconds = Math.floor(diff / 1000) // seconds
            const incomeGenerated = Math.floor((incomePerHour / 3600) * diffSeconds)

            // x income -> 60 min
            // 60 min -> 3600 seconds
            // 3600 seconds -> x income
            // 1 second -> x/3600

            // use poop only if level > 0
            if (userRef.data().level > 0) {

                const poopPerHour = 1
                const totalPoop = Math.floor(diffSeconds / 3600) * poopPerHour
                const totalTestPoop = Math.floor(diffSeconds) * poopPerHour

                const totalIncomeDb = userRef.data().totalIncome + incomeGenerated

                if (totalPoop >= 48) {
                    // decrease age
                    await userDb.update({ totalIncome: totalIncomeDb, level: userRef.data().level - 1, totalPoop, totalTestPoop })
                    res.json({ diffSeconds, incomeGenerated, totalPoop, totalTestPoop, level: userRef.data().level - 1 })
                } else {
                    await userDb.update({ totalIncome: totalIncomeDb, totalPoop, totalTestPoop })
                    res.json({ diffSeconds, incomeGenerated, totalPoop, totalTestPoop })
                }

            } else {
                res.json({ diffSeconds, incomeGenerated })

            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

const calculateFoodCost = async (tgId, foodUserWant) => {
    const userDb = db.collection('users').doc(tgId)
    const userRef = await userDb.get()
    const userAge = userRef.data().level
    const userTotalIncome = userRef.data().totalIncome
    const basePrice = 5 // per food

    if (!foodUserWant) {
        const foodAmt = [100, 200, 500]
        const foodPriceArr = []

        for (const food of foodAmt) {
            const price = Math.floor(food * (basePrice) * (1 + 0.05 * userAge) * (1 + 0.01 * Math.log10(userTotalIncome)))

            const key = foodAmt[foodAmt.indexOf(food)]
            foodPriceArr.push({ [key]: price })
        }

        const resultArr = [...foodPriceArr]
        return resultArr
    } else {
        const price = Math.floor(foodUserWant * (basePrice) * (1 + 0.05 * userAge) * (1 + 0.01 * Math.log10(userTotalIncome)))

        return { price, userRef, userDb }
    }
}

app.post('/buyFood', async (req, res) => {
    const { food, tgId, } = req.body
    console.log(tgId)
    try {
        console.log(food)
        const result = await calculateFoodCost(tgId, food)
        const { price, userRef, userDb } = result
        const userTotalIncome = userRef.data().totalIncome
        const foodLeft = userRef.data().foodLeft
        if (userTotalIncome < price) return res.json({ message: 'Not enough money to buy' });

        await userDb.update({
            foodLeft: foodLeft + food,
            totalIncome: userTotalIncome - price
        })

        const userData = {
            ...userRef.data(),
            foodLeft: foodLeft + food,
            totalIncome: userTotalIncome - price
        }

        res.json({ message: `${food} successfully bought`, userData })

        console.log(price)
        console.log(userTotalIncome)

    } catch (err) {
        console.log(err)
    }

})


app.get('/foodPrice/:tgId', async (req, res) => {
    const { tgId } = req.params
    try {
        const resultArr = await calculateFoodCost(tgId)
        res.json({ foodPrice: resultArr })

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

app.post('/generate-invite', async (req, res) => {
    const { tgId } = req.body
    // const inviteLink = `https://t.me/monparkTest_bot?start=ref_${tgId}`
    const inviteLink = `https://t.me/MonPark_bot/monpark?startapp=ref_${tgId}`
    res.json({ inviteLink })

})

app.post('/ref', async (req, res) => {
    const { refUserId, tgId } = req.body
    const userRef = db.collection('users').doc(String(tgId)) // new user
    const refUserDb = db.collection('users').doc(String(refUserId))
    const refUserDoc = await refUserDb.get()
    const refData = await refUserDoc.data()
    userRef.get().then(doc => {
        if (doc.exists) { // new user already exists, no need to reward
            console.log('user exists ', doc.data())
            return res.json({ message: 'user already exists', userData: doc.data() })
        } else {
            console.log('added new friend')
            const timestamp = firebase.default.firestore.FieldValue.serverTimestamp()
            const rewardOldUser = 250
            const rewardNewUser = 50
            const newUserTotalIncome = 2000 + rewardNewUser

            const newData = {
                tgId: String(tgId),
                lastActive: timestamp,
                totalIncome: newUserTotalIncome,
                incomePerHour: 0,
                shop: [],
                level: 0,
                foodLeft: 1000,
                foodEaten: 0,
                refLim: 500,
                petAssigned: '',
                foodPerTap: 1,
                feedToNextLevel: 3000,
                friends: []
            }


            const friends = [...refData.friends]
            // dont decrease the age (in poop feature) if the current level is 0
            // dont add friend if already there
            friends.push({

                frTgId: tgId
            })

            userRef.set({ ...newData }) // added new users
            console.log(newUserTotalIncome)


            refUserDb.update({ friends, totalIncome: refData.totalIncome + rewardOldUser }) // updated old user
            res.json({ message: 'New user joined!', userData: newData });
            // res.json({ message: 'New user' })
        }
    })
    console.log(refUserId, tgId)
})

app.post('/follow/:social', async (req, res) => {
    const { social } = req.params
    const { tgId } = req.body
    const userRef = await db.collection('users').doc(tgId)
    const userDoc = await userRef.get()


    try {
        if (social === "twitter" && userDoc.twtFollow !== true) {
            userRef.update({ twtFollow: true, totalIncome: userDoc.data().totalIncome + 150 })
            res.json({ social, twtFollow: true, totalIncome: userDoc.data().totalIncome + 150 })
        } else if (social === "telegram" && userDoc.tgFollow !== true) {
            userRef.update({ tgFollow: true, totalIncome: userDoc.data().totalIncome + 200 })
            res.json({ social, tgFollow: true, totalIncome: userDoc.data().totalIncome + 200 })
        } else if (social === "tweetTask" && userDoc.twtTask !== true) {
            userRef.update({ twtTask: true, totalIncome: userDoc.data().totalIncome + 250 })
            res.json({ social, twtTask: true, totalIncome: userDoc.data().totalIncome + 250 })
        } else {
            res.status(500).send('invalid')
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }


})

app.post('/earn/friends', async (req, res) => {
    const { tgId } = req.body
    const userRef = await db.collection('users').doc(tgId)
    const userDoc = await userRef.get()
    try {
        const noOfriends = userDoc.data()['friends'].length
        if (userDoc.friendsTask !== true && noOfriends >= 2) {
            userRef.update({ friendsTask: true, totalIncome: userDoc.data().totalIncome + 300 })
            res.json({ friendsTask: true, totalIncome: userDoc.data().totalIncome + 300 })
        } else {
            res.status(400).json({ error: 'invalid' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
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
                            url: 'https://monpark.xyz/waitlist'
                            // url: ngrok + '/waitlist'
                        }
                    }]]
                }
            })
    }
})

//nitishvermaldh01@gmail.com

Bot.command('play', async (ctx) => {
    console.log(ctx)
    ctx.reply('Play game now test',
        {
            reply_markup: {
                inline_keyboard: [[{
                    text: 'Open', web_app: {
                        url: process.env.NODE_ENV === "production" ? 'https://monpark.xyz' : ngrok
                        // url: 'https://monpark.xyz'
                    }
                }]]
            }
        })
});


Bot.command('id', async (ctx) => {
    const id = ctx.message.from.id
    console.log(id)
    ctx.reply('This is your id - ' + id)
})


Bot.launch()