import { createSlice, configureStore } from '@reduxjs/toolkit'


const userHistory = { userHistoryData: [], userCreditUsage: 0, toggleCreditHistoryUpdate: false }

const userHistorySlice = createSlice({
    name: 'history',
    initialState: userHistory,
    reducers: {
        toggleCreditHistoryUpdate(state, action) {
            console.log("-------Hellow from redux -----------''")
            console.log(`usercredit usage payload ${action.payload}`)
            state.toggleCreditHistoryUpdate = action.payload
        },
        /* @ts-ignore */
        updateCreditUsage(state, action) {
            console.log("--- redux store-> updateCreditUsage----",action.payload)
            const params = action.payload.params
            if (state.userCreditUsage < action.payload.responseLength) {
                return state.userCreditUsage
            }
            if (params === "initiate") {
                state.userCreditUsage = action.payload.totalRemainingCredits
            } else if (params === "update") {
                state.userCreditUsage = state.userCreditUsage - action.payload.responseLength
            }
        }


    }

})

const userSubscription = {plan: 'free', active:false, date:null, }

const userSubscriptionSlice = createSlice({
    name:'userSubs',
    initialState: userSubscription,
    reducers: {
        updateUserSubscription(state, action){
            state.plan = action.payload.plan
            state.active = action.payload.active
            state.date = action.payload.date
        }
    }
})

const initialAiResponse = { aiResponseContent: '', }

const aiResponseSlice = createSlice({
    name: 'aiResponse',
    initialState: initialAiResponse,
    reducers: {
        updateAiResponse(state, action) {
            state.aiResponseContent = action.payload
        }
    }
})


const initialAuthstate = { isAuth: false }

const authSlice = createSlice({
    name: ' auth',
    initialState: initialAuthstate,
    reducers: {
        login(state) {
            state.isAuth = true
        },
        logout(state) {
            state.isAuth = false
        }
    }
})

const reduxStore = configureStore({
    reducer: {
        auth: authSlice.reducer,
        history: userHistorySlice.reducer,
        aiResponse: aiResponseSlice.reducer,
        userSubs:userSubscriptionSlice.reducer
    }
})

export const historyAction = userHistorySlice.actions
export const aiResponseAction = aiResponseSlice.actions
export const userSubscriptionAction = userSubscriptionSlice.actions
export const authAction = authSlice.actions

export default reduxStore
