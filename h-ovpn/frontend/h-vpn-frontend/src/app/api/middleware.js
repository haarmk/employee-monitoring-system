import { isRejectedWithValue } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'



/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger = (api) => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
  if (isRejectedWithValue(action)) {
    console.warn('We got a rejected action!')
    toast("hello")
    
  }

  return next(action)
}