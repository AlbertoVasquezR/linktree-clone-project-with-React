import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, userExists } from "../firebase/firebase";

import { useNavigate } from "react-router-dom";
import AuthProvider from "../components/authProvider";

import style from "./loginView.module.css";

export default function LoginView(){
        const navigate = useNavigate();
        //const [currentUser, setCurrentUser] = useState(null);
        /*
            State
            0: Inicializado
            1: Loading
            2: Login completo
            3: Login pero sin registro
            4: No hay nadie logueado
            5: Ya existe el username
            6: nuevo username, click para continuar
            7: username no existe
         */
        const [state, setCurrentState] = useState(0);

/*         useEffect(()=> {
            setCurrentState(1);
            onAuthStateChanged(auth, async (user) =>{
                if(user){
                    const isRegistered = await userExists(user.uid);
                    if (isRegistered) {
                        //TODO: redirigir a Dashboard
                        navigate('/dashboard');
                        setCurrentState(2);
                    }else{
                        //TODO: redirigir a choose username
                        navigate("/choose-username");
                        setCurrentState(3);
                    }
    
                    console.log(user.displayName);
                }else{
                    setCurrentState(4);
                    console.log("No hay nadie autenticado...");
                }
            });
        }, [navigate]); */

        async function handleOnClick(){
            const googleProvider = new GoogleAuthProvider();
            await signInWithGoogle(googleProvider);
        }

        async function signInWithGoogle(googleProvider){
            try {
                const res = await signInWithPopup(auth, googleProvider);
                console.log(res);
            } catch (error) {
                console.error(error);
            }
        }

        function handleUserLoggedIn(user){
            navigate('/dashboard');
        }

        function handleUserNotRegistered(user){
            navigate('/choose-username');
        }

        function handleUserNotLoggedIn(){
            setCurrentState(4);
        }

       



    if (state ==2) {
        return <div>Estás autenticado y registrado</div>;
    }

    if (state ==3) {
        return <div>Estás autenticado pero no registrado</div>;
    }

    if (state ==4) {
        return (
            <div className={style.loginView}>
                <div>
                    <h1>Link Tree</h1>
                </div>
                <button className={style.provider} onClick={handleOnClick}>Login with Google</button>
            </div>
        );
    }

/*     if (state ==5) {
        return (
            <div>
                <button onClick={handleOnClick}>Login with Google</button>
            </div>
        );
    } */

    return(
        <AuthProvider
            onUserLoggedIn={handleUserLoggedIn}
            onUserNotRegistered={handleUserNotRegistered}
            onUserNotLoggedIn={handleUserNotLoggedIn}
        >
            <div>Loading ...</div>
        </AuthProvider>
    );
   
}