import React, {
    createContext,
    useEffect,
    useState
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

//context
const AuthContext = createContext()

//provider
const AuthProvider = ({children}) => {
    const [state, setState] = useState({
        user: null,
        token: "",
    });

    //initial local storage data
    useEffect(() => {
        const loadLocalStorageData = async () => {
            try {
                let value = await AsyncStorage.getItem('@auth');
                if (value !== null) {
                    console.log(`stored data: ${value}`);
                    let loginData = JSON.parse(value)
                    setState({...state, user: loginData?.user, token: loginData?.token })
                }
            } catch (e) {
                console.log(e);
            }
        };
        loadLocalStorageData()
    }, [])

    return(
        <AuthContext.Provider value = {[state, setState]}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext, AuthProvider}