import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { STITCH_TYPE } from "./amigurumiSlice"
export type AmigurumiLayer = {
  pattern: STITCH_TYPE[]
  times: number
}
export type AmigurumiLayerContainer = {
  layers: AmigurumiLayer[]
  times: number
}
export type AmigurumiModel = {
  name: string
  id: string
  createdAt: Date
  layers: AmigurumiLayerContainer[]
}

export type AmigurumisResponse = {
  id: string
  name: string
}
// Define a service using a base URL and expected endpoints
export const amigurumiApi = createApi({
  reducerPath: "amigurumiApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_AMIGURUMI_URL ?? "http://localhost:8080"}/api/v1`, credentials: "include" }),
  endpoints: (builder) => ({
    getAmigurumiById: builder.query<AmigurumiModel, string>({
      query: (id) => `amigurumi/${id}`,
    }),
    getAmigurumis: builder.query<AmigurumisResponse[], void>({
      query: () => "amigurumi",
    }),
  }),
})

export const { useLazyGetAmigurumiByIdQuery, useGetAmigurumisQuery, useGetAmigurumiByIdQuery } = amigurumiApi
