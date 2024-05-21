import { configureStore } from "@reduxjs/toolkit"
import amigurumiSlice from "./features/amigurumi/amigurumiSlice"
import { amigurumiApi } from "./features/amigurumi/amigurumiApi"
import { userApi } from "./features/user/userApi"
import { rtkQueryErrorMiddleware } from "./rtkQueryErrorMidlleware"

export const makeStore = () => {
  return configureStore({
    reducer: {
      amigurumi: amigurumiSlice,
      [amigurumiApi.reducerPath]: amigurumiApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rtkQueryErrorMiddleware).concat(amigurumiApi.middleware).concat(userApi.middleware),
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
