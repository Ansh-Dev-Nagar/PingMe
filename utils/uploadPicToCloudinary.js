import axios from 'axios'

const uploadPic = async media =>
{
  try
  {
    const form = new FormData()
    form.append('file', media)
    form.append('upload_preset', 'personal-chat')
    form.append('cloud_name', 'dqs3cld9t')

    const res = await axios.post('https://api.cloudinary.com/v1_1/dqs3cld9t/image/upload', form)
  
    return res.data.url
  }
  catch (error)
  {
    console.error("Error uploading image:", error.message || "Unknown error")
    return null
  }
}

export default uploadPic
