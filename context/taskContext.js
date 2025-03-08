import React, {
    createContext,
    useEffect,
    useState
} from "react";
//context
import { AuthContext } from "./authContext";
import { useContext } from "react";
const TaskContext = createContext()

const TaskProvider = ({
    children
}) => {
    //state
    const [Loading, setLoading] = useState(false)
    const [tasks, setTasks] = useState([])
    const [state] = useContext(AuthContext);
    const { token } = state;


    //get
    const getTasks = async () => {
        setLoading(false)
        try {
            let result = await fetch(`http://${url}:5000/api/v1/dailyTask/get`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            result = await result.json();
            if (result) {
                setTasks(result?.dailyTasks);
            } else {
                setTasks([]);
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    //initial tasks:
    useEffect(() => {
        getTasks()
    }, [])

    return (<TaskContext.Provider value={[tasks, setTasks]}>
        {children}
    </TaskContext.Provider>
    )
}

export {
    TaskContext,
    TaskProvider
}