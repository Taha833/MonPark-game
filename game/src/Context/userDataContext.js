import { createContext, useEffect, useState } from 'react'
import { setReturningUser } from '../Utils'
import db from '../firebase'
import firebase from 'firebase/compat/app';

const UserDataContext = createContext()
const tg = window.Telegram.WebApp


export const UserDataProvider = ({ children, navigate, location }) => {
    const [userData, setUserData] = useState([])
    const [initLoad, setInitLoad] = useState(false)
    const [isRefUser, setIsRefUser] = useState('')

    useEffect(() => {
        if (window.location.pathname !== "/waitlist" && [5941578108, 347557266, 1657939157, 7089063746, 7256386391].some(id => tg.initDataUnsafe.user.id === id)) {

            console.log('context', userData)
            const checkUser = () => {

                const initData = tg.initData
                const query = new URLSearchParams(initData)
                const tgUserData = JSON.parse(query.get('user'))
                const tgId = String(tgUserData.id)

                const checkDoc = async () => {
                    const docRef = db.collection('users').doc(tgId)
                    const doc = await docRef.get()
                    if (doc.exists) {
                        setUserData(userData.length === 0 ? doc.data() : userData)
                        console.log('data', doc.data())
                    }
                    return doc.exists
                }
                checkDoc()
                    .then(exists => {
                        if (exists) {
                            setReturningUser() // set user to localStorage
                            console.log('exists', exists)
                            if (location.pathname === "/" || location.pathname.includes('/ref')) navigate('/house')


                        } else if (isRefUser !== false) {
                            // setUserData(userData)
                            // const getData = async () => {
                            //     const docRef = await db.collection('users').doc(tgId)
                            //     const doc = await docRef.get()
                            //     setUserData(await doc?.data()?.length !== 0 && doc.data())
                            // }
                            // getData()
                            navigate('/house')
                        } else {
                            console.log('not exist')
                            const timestamp = firebase.firestore.FieldValue.serverTimestamp()

                            const newData = {
                                tgId,
                                lastActive: timestamp,
                                totalIncome: 2000,
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

                            db.collection('users').doc(tgId).set(newData).then(() => {
                                console.log('changed')
                                setUserData(newData)
                                setTimeout(() => {
                                    navigate('/house')
                                }, 2000)
                            })

                        }
                    })
                    .catch(err => console.error(err))

            }
            checkUser()
        }
        // eslint-disable-next-line
    }, [navigate])

    return (
        <UserDataContext.Provider value={{ userData, setUserData, initLoad, setInitLoad, isRefUser, setIsRefUser }}>
            {children}
        </UserDataContext.Provider>
    )
}

export default UserDataContext