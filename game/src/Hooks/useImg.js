import { useContext } from 'react'
import ImageContext from '../Context/imgProvider'

function useImg() {
    return useContext(ImageContext)
}


export default useImg