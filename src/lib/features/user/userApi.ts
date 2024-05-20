import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
type UserRequest = {
  username: string
  password: string
}
// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_AMIGURUMI_URL ?? "http://localhost:8080"}/api/v1`, credentials: "include" }),
  endpoints: (builder) => ({
    login: builder.query<boolean, UserRequest>({
      query: (body) => ({
        url: `login`,
        method: "POST",
        body,
      }),
    }),
  }),
})

export const { useLazyLoginQuery } = userApi
