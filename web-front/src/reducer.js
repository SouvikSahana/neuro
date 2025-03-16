export const initialState={
    user: null
}

const reducer= (state,action)=>{
    switch(action.TYPE){
        case "SET_USER":
            return {
                ... state,
                user: action.PAYLOAD
            }
    }
}

export default reducer