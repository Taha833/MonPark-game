import { createContext, useState } from 'react'
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase';

const ImageContext = createContext({});

export const ImageProvider = ({ children }) => {
    const [img, setImg] = useState({ normal: null, messy: null });

    const getImgUrl = async (imgName) => {

        const normalPetImg = ref(storage, `game/pets/${imgName}`)
        const messyPetImg = ref(storage, `game/pets/messy/${imgName}`)

        const normalImageUrl = await getDownloadURL(normalPetImg);
        const messyImageUrl = await getDownloadURL(messyPetImg);

        setImg({
            normal: normalImageUrl,
            messy: messyImageUrl,
        });
    }

    return (
        <ImageContext.Provider value={{ getImgUrl, img }}>
            {children}
        </ImageContext.Provider>
    )
}
export default ImageContext