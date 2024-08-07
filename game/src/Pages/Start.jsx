import React, { useEffect, useState } from 'react'
import Loading from './Loading';
import Egg from './Egg';
import useUserData from '../Hooks/useUserData';
import { useParams } from 'react-router-dom';


function Start() {
    const { refUserId } = useParams()
    const { userData } = useUserData()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (Object.keys(userData).length !== 0) {
            console.log(refUserId)
            // alert(Object.keys(userData).length)

            setIsLoading(false)
        }
        // eslint-disable-next-line
    }, [userData])

    return (
        <div>
            {!isLoading ?
                <>
                    <Egg />
                </>
                : <Loading />}

        </div>
    )
}

export default Start