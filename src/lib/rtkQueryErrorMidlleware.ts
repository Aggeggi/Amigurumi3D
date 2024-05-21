import type { Middleware } from "@reduxjs/toolkit"
import { isRejectedWithValue } from "@reduxjs/toolkit"

export const rtkQueryErrorMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ([401, 403].includes((action.payload as any).status)) {
      window.location.href = (process.env.NEXT_PUBLIC_AMIGURUMI_FE_URL || "http://localhost:3000") + "/login"
      return
    }
  }

  return next(action)
}
