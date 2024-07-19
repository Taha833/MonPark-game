import { useContext } from 'react'
import UserDataContext from '../Context/userDataContext'

function useUserData() {
    return useContext(UserDataContext)
}


export default useUserData