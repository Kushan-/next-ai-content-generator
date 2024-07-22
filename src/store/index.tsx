import { createSlice, configureStore} from '@reduxjs/toolkit'


const userHistory = {userHistoryData:[], userCreditUsage:0, updateCreditUsage:false}

const userHistorySlice = createSlice( {
    name: 'history',
    initialState: userHistory,
    reducers: {
        upadateCreaditUsage (state, action){
            console.log("-------Hellow from redux -----------''")
            console.log(`usercredit usage payload ${action.payload}`)
            state.updateCreditUsage = action.payload        
        }


    }

} )

const initialAiResponse = {aiResponseContent:'',}

const aiResponseSlice = createSlice({
    name:'aiResponse',
    initialState: initialAiResponse,
    reducers:{
        updateAiResponse(state, action){
            state.aiResponseContent = action.payload
        }
    }
})


const initialAuthstate = {isAuth :  false}

const authSlice = createSlice( {
    name: ' auth',
    initialState: initialAuthstate,
    reducers : {
        login(state){
            state.isAuth=true
        },
        logout(state){
            state.isAuth=false
        }
    }
} )

const reduxStore = configureStore( {
    reducer : {
        
        auth: authSlice.reducer,
        history: userHistorySlice.reducer,
        aiResponse: aiResponseSlice.reducer
    }
})

export const historyAction = userHistorySlice.actions
export const aiResponseAction = aiResponseSlice.actions
export const authAction = authSlice.actions

export default reduxStore
