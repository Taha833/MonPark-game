import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ShopItems from '../Components/ShopItems';
import db from '../firebase'
import useUserData from '../Hooks/useUserData';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function Shop({ server }) {
    const { userData, setUserData } = useUserData()

    const { section } = useParams();
    const [shop, setShop] = useState([])
    const [selected, setSelected] = useState(false)
    const [selectedItem, setSelectedItem] = useState({})
    useEffect(() => {
        setShop([])
        const userShop = userData.shop
        console.log('user ', userShop)

        const getShopData = async () => {
            const sectionRef = db.collection('shop').doc(section)
            const sectionDoc = await sectionRef.get().then(doc => doc.data())
            const subCollections = sectionDoc.items
            const shopArr = []
            for (const subCollection of subCollections) {
                // console.log(subCollection)
                const nestedCol = await db.collection('shop').doc(section).collection(subCollection).doc(subCollection).get().then(doc => doc.data())
                shopArr.push(nestedCol)
                // setShop(prev => [...prev, nestedCol])
            }
            console.log('userData', userShop)
            console.log('shop', shopArr)
            const filteredShop = shopArr.filter(obj1 => !userShop.some(obj2 => obj2.name === obj1.name))
            const filteredUserShop = userShop.filter(obj1 => shopArr.some(obj2 => obj2.name === obj1.name))
            // console.log(filteredUserShop)
            let final;

            if (filteredShop.length === shopArr.length) { // nothing is filtered

                final = [...filteredShop].sort((a, b) => a.index - b.index)
            } else { // shopArr was filtered
                final = [...filteredUserShop, ...filteredShop].sort((a, b) => a.index - b.index)

            }
            console.log('final ', final)
            setShop(final)
        }

        getShopData()
        console.log(section)
    }, [section, userData.shop])

    useEffect(() => {
        console.log(selectedItem)
    }, [selectedItem])


    const buyItem = async (item) => {
        // const userDb = db.collection('users').doc(userData.tgId)
        // const userRef = await userDb.get()
        // const userShop = userRef.data().shop
        // console.log(userShop, item)

        await fetch(server + '/buy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ item, userData }),
        }).then(res => res.json()).then(data => {
            if (data.message === "bought") {
                setUserData(data.userData)
                toast.success(item.name + ' bought', {
                    autoClose: 5000,
                    closeOnClick: true,
                    theme: "dark",
                })
                setSelected(false)
                setSelectedItem({})
            } else {
                const err = data.type !== undefined
                toast.error(err ? data.message : 'error occured', {
                    autoClose: 5000,
                    closeOnClick: true,
                    theme: "dark",
                })
            }
            console.log(data.message)
        })
    }

    return (
        <div className={`mt-5 flex-1 ${selected && 'overflow-hidden'}`}>
            <ToastContainer />
            {!selected &&
                <>
                    <nav className='flex max-w-[325px] mx-auto justify-between w-full bg-[#321B55] rounded-2xl py-2 px-2 items-center sticky top-0'>
                        <Link className={section === 'product' ? `text-white bg-[#412072] rounded-xl px-2 py-1` : 'text-gray-400 px-2 py-1'} to="/shop/product" >product</Link>
                        <Link className={section === 'skill' ? `text-white bg-[#412072] rounded-xl px-2 py-1` : 'text-gray-400 px-2 py-1'} to="/shop/skill">skill</Link>
                        <Link className={section === 'team' ? `text-white bg-[#412072] rounded-xl px-2 py-1` : 'text-gray-400 px-2 py-1'} to="/shop/team">team</Link>
                        <Link className={section === 'ecosystem' ? `text-white bg-[#412072] rounded-xl px-2 py-1` : 'text-gray-400 px-2 py-1'} to="/shop/ecosystem">ecosystem</Link>
                    </nav>
                    <section className='max-w-[325px] mx-auto mt-3 flex flex-wrap justify-evenly gap-3 flex-1'>
                        {shop.length !== 0 && shop.map(item => (<>
                            <ShopItems item={item} setSelectedItem={setSelectedItem} setSelected={setSelected} userData={userData} />
                        </>))}
                        {shop.length === 0 && <h1 className='text-gray-400 text-2xl'>Loading...</h1>}
                    </section>
                </>
            }
            {selected && <div className='fixed w-full text-white text-center border-[#492188] border-2 flex flex-col gap-3 items-center py-4 mx-auto'>
                <img src='/assets/cross.png' alt="cross" width="25px" className='absolute right-0 cursor-pointer top-0 m-2' onClick={() => {
                    setSelected(false)
                    setSelectedItem({})
                }} />
                <h1 className='text-2xl text-white'>{selectedItem.name || 'shop item'}</h1>
                <p>Profit per hour</p>
                <div className='flex items-center justify-center'>
                    <img src="/assets/game/tabler_coin-filled.svg" alt="coin" width="20px" />
                    <span>+{(selectedItem.upgIncome - selectedItem.incomePerHour) || selectedItem.baseRev}</span>
                </div>
                <div className='flex items-center justify-center'>
                    <img src="/assets/game/tabler_coin-filled.svg" alt="coin" width="40px" />
                    <h1 className='text-2xl'>{selectedItem.upgCost || selectedItem.baseCost}</h1>
                </div>
                <button className='bg-[#492188] py-2 px-4 text-xl cursor- rounded-md w-max hover:bg-[#8d5ae0]' onClick={() => buyItem(selectedItem)}>Go ahead</button>
            </div>}
        </div>
    )
}

export default Shop