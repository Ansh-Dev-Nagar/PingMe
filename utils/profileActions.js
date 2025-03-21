import axios from 'axios'
import baseUrl from './baseUrl'
import catchErrors from './catchErrors'
import cookie from 'js-cookie'
import Router from 'next/router'


const Axios = axios.create({ baseURL: `${baseUrl}/api/profile`, headers: { Authorization: cookie.get('token') } })


export const profileUpdate = async (setLoading, setError, profilePicUrl) =>
{
  try
  {
    await Axios.post(`/update`, { profilePicUrl })

    setLoading(false)
   
    Router.reload()
  }
  catch(error)
  {
    setError(catchErrors(error))
    
    setLoading(false)
  }
}

export const updatePassword = async (setLoading, setError, setSuccess, currentPassword, newPassword) => {
  try {
    setLoading(true)
    
    await Axios.post(`/update-password`, { currentPassword, newPassword })
    
    setSuccess(true)
    setLoading(false)
  }
  catch(error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
    setLoading(false)
  }
}