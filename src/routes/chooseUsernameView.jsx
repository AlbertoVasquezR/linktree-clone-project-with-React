import AuthProvider from "../components/authProvider";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { existsUsername, updateUser } from "../firebase/firebase";
import style from './chooseUsername.module.css';

export default function ChooseUsernameView() {

    //hooks
    const navigate = useNavigate();
    const [state, setState] = useState(0);
    const [currentUser, setCurrentUser] = useState({});
    const [username, setUsername] = useState('');

    function handleUserLoggedIn(user) {
        navigate('/dashboard');
    }

    function handleUserNotRegistered(user) {
        setCurrentUser(user);
        setState(3);
    }

    function handleUserNotLoggedIn() {
        navigate("/login");
    }

    function handleInputUsername(e){
        setUsername(e.target.value);
    }

    async function handleContinue(){
        if(username != ''){
            const exists = await existsUsername(username);
            if (exists) {
                setState(5);
            }else{
                const tmp = {...currentUser};
                tmp.username = username;
                tmp.processCompleted = true;
                await updateUser(tmp);
                setState(6);
            }
        }
    }

    if (state == 3 || state == 5) {
        return (
            <div className={style.chooseUsernameContainer}>
                <h1>Bienvenido {currentUser.displayName} </h1>
                <p>Para terminar el proceso elige un nombre de usuario</p>
                {state == 5? <p>El nombre de usuario ya existe, escoge otro</p>: ""}
                <div>
                    <input className="input" type="text" onChange={handleInputUsername}/>
                </div>

                <div>  
                    <button className="btn" onClick={handleContinue}>Continue</button>
                </div>
            </div>
        );
    }

    if (state == 6) {
        return <div className={style.chooseUsernameContainer}>
            <h1>Felicidades! ya puedes ir al dashboard a crear tus links</h1>
            <Link to="/dashboard">Continuar</Link>
        </div>
    }


    return (
        <AuthProvider
            onUserLoggedIn={handleUserLoggedIn}
            onUserNotRegistered={handleUserNotRegistered}
            onUserNotLoggedIn={handleUserNotLoggedIn}
        ></AuthProvider>
    );
}