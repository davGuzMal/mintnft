export const mediaUploader = async(files:File[]) => {
    const upload_preset= process.env.NEXT_PUBLIC_UPLOAD_PRESET;
    const cloud_name = process.env.NEXT_PUBLIC_CLOUD_NAME;
    const media = []
 
    for (const file of files){
        
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', upload_preset!)
        formData.append('cloud_name', cloud_name!)        
        try{
            const res = await fetch('https://api.cloudinary.com/v1_1/dgjpk6ovz/upload', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            media.push(data.secure_url)

        }catch(err:any){
            console.log(err)
        }
    }
    return media;
}