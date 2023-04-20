import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { existsUsername,
         getProfilePhotoUrl,
         getUserPublicProfileInfo 
        } from "../firebase/firebase";
import PublicLink from "../components/publicLink";

import style from "./publicProfileView.module.css";
import styleLinks from "../components/publicLink.module.css";

export default function PublicProfileView(){
    const params = useParams();
    const [profile, setProfile] = useState(null);
    const [url, setUrl] = useState("");
    const [state, setState] = useState(0);

    useEffect(() => {
        //obtengo el perfil
        getProfile();
        async function getProfile(){
            //saco el username
            const username = params.username;
            try {
                //reviso si existe o no
                const userUid = await existsUsername(username);

                if (userUid) {
                    const userInfo = await getUserPublicProfileInfo(userUid);
                    setProfile(userInfo);

                    const url = await getProfilePhotoUrl(
                        userInfo.profileInfo.profilePicture
                    );

                    setUrl(url);
                }else{
                    setState(7);
                }

            } catch (error) {           
            }
        }     
    }, [params]);

    if (state == 7) {
        return (
            <div>
                <h1>Username doesn't exist</h1>
            </div>
        );
    }

    return ( 
    <div className={style.profileContainer}>
        <div className={style.profilePicture}>
            <img src={url} alt="" />
        </div>
        <h2>{profile?.profileInfo.username}</h2>
        <h3>{profile?.profileInfo.displayName}</h3>
        <div className={styleLinks.publicLinksContainer}>
            {profile?.linksInfo.map((link) =>(
                <PublicLink key={link.docId} url={link.url} title={link.title}/>
            ))}
        </div>
    </div>
    );
}