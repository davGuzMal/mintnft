import { useState, useEffect } from "react"
import { NextComponentType } from "next"
import { useForm, SubmitHandler } from 'react-hook-form'
import { IoCloseCircle } from 'react-icons/io5'
import { alerts } from "@/utils/alerts"
import { FileUploader } from "react-drag-drop-files"
import { mediaUploader } from "@/utils/mediaUploader"
import FilePreview from "./FileViewer"

interface MintFormInput {
    name: string
    description: string
    media: string[]
    properties: {}[]
}

const MintForm: NextComponentType = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<MintFormInput>({
        defaultValues: {
            name: '',
            description: '',
            media: [],
            properties: []
        }
    })
    //Estado para guardar media
    const fileTypes = ["JPG", "PNG", "GIF", "MP3", "MP4", "SVG", "WEBP"];
    const [media, setMedia] = useState<File[]>([])
    const handleFileChange = (uploadedFile : any) =>{
        setMedia(uploadedFile)        
    }
    //Estado para agregar o quitar propiedades
    const [inputList, setInputList] = useState([
        {
          trait_type: 'glasses',
          value: ''
        }
    ])    
    const [isDisabled, setIsDisabled] = useState(false)
    //funcion para guardar valores en el estado de inputList
    const handleInputChange = (e :React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, i: number) => {
        const newInputList = [... inputList]
        if(e.target.name==="trait_type"){
            newInputList[i].trait_type = e.target.value
                       
        }
        else if (e.target.name==="value"){
            newInputList[i].value = String(e.target.value)
        }
        setInputList(newInputList)        
    }

    //funcion para agregar inputProperty
    const handleListAdd = (e :React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setInputList([
          ...inputList,
          {
            trait_type: 'glasses',
            value: ''
          }
        ])
    }
    //funcion para remover inputProperty
    const handleRemoveItem = (i: number) => {
        const newList = [...inputList]        
        newList.splice(i, 1)
        setInputList(newList)
    }    
    //submit
    const onSubmit: SubmitHandler<MintFormInput> = async data => {
        let urlMedia = []
        if (media.length > 0) {
            urlMedia = await mediaUploader(media)            
        }
        data = {
            ...data,
            media : urlMedia ? urlMedia : [],
            properties : inputList
        }
        //Mintear NFT
        const url = 'https://staging.crossmint.com/api/2022-06-09/collections/default-solana/nfts';
        //headers
        const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET
        const project_id = process.env.NEXT_PUBLIC_API_KEY
        const reqHeader = new Headers();
        reqHeader.append("x-client-secret", client_secret!);
        reqHeader.append("x-project-id", project_id!);
        reqHeader.append("Content-Type", "application/json");
        //body
        const recipient = "email:dgm051195@gmail.com:solana"
        const reqBody = JSON.stringify({
            "metadata": {
              "name": data.name,
              "image": data.media[0],
              "description": data.description,
              "attributes" : data.properties,
              "properties" : {
                "files" : data.media,
                "category" : "image",
                "creators" : []
              }
            },
            "recipient": recipient
        });

        const options = {
            method: 'POST',
            headers: reqHeader,
            body : reqBody,
            
        };

        fetch(url, options)
        .then(res => res.json())
        .then(result => alerts({
            icon: 'success',
            title: 'Congratulations.',
            text: 'Your NFT has been minted successfully. Check its status with this id: '+result.id,
            toast: true
        }))
        .catch(err => alerts({
            icon: 'error',
            title: 'Ups, something is wrong.',
            text: 'Your NFT could not be minted by the following reasons: '+err.message,
            toast: true
        }))

    }
    useEffect(() => {
        if (inputList.length > 0) {
          inputList[inputList.length - 1].trait_type === ""
            ? setIsDisabled(true)
            : setIsDisabled(false)
        }        
      }, [inputList])

    return(
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="font-semibold">Upload files</h2>
                <div>
                    <FileUploader
                        handleChange={(file: File)=>handleFileChange(file)}
                        multiple
                        hoverTitle = 'Drop here'
                        maxSize = '50'                        
                        types = {fileTypes}                                            
                    />
                    {/* <Image src={imgUpload} alt="upload" height={50} width={50} />
                    <input 
                        id="fileSelect" 
                        type="file" 
                        multiple 
                        onChange={e => handleMediaChange(e)}
                        accept="image/*"
                    /> */}
                    {media.length < 1 ? (
                        <p className="text-red-500 text-xs italic">
                            At least 1 media item is mandatory
                        </p>
                    ) : media.length > 0 ? (
                        <FilePreview
                        fileData={media}
                        />
                    ): null}
                </div>
                <div className="text-gray-400 text-xs italic">
                    <p>You can select multiple Files</p>
                    <p>Max 50 MB per individual file</p>
                    <p>Upload up to 6 files</p>
                    <p>We support image, audio and video files</p>
                </div>
                <br/>
                <div className="flex flex-col">
                    <h2 className="font-semibold">Token details</h2>
                    {/* NAME*/}
                    <input 
                        type='text' 
                        className="input my-2"
                        placeholder="Dislay name (max 60)"
                        {...register('name', {
                            required: true,
                            maxLength: 60
                        })}
                    />
                    {errors.name?.type === 'required' ? (
                        <p className="text-red-500 text-xs italic">
                            Name is mandatory
                        </p>
                    ) : null}
                    {errors.name?.type === 'maxLength' ? (
                        <p className="text-red-500 text-xs italic">
                            Name must contain less than 60 characters
                        </p>
                    ) : null}
                    {/* DESCRIPTION */}
                    <textarea 
                        placeholder="Token description (max 150)"
                        className="input my-2"
                        {...register('description', {
                            required: true,
                            maxLength: 150
                        })}
                    />
                    {errors.description?.type === 'required' ? (
                        <p className="text-red-500 text-xs italic">
                            Description is mandatory
                        </p>
                    ) : null}
                    {errors.description?.type === 'maxLength' ? (
                        <p className="text-red-500 text-xs italic">
                            Description must contain less than 150 characters
                        </p>
                    ) : null}
                    {/* PROPERTIES */}
                    <label className="font-semibold">Properties</label>
                    {inputList.map((row: any, i)=>
                        <div key={"trait_type "+i} className='grid grid-cols-1 gap-1 md:grid-cols-4'>
                            <select
                            name='trait_type'                                                                               
                            placeholder="trait_type"
                            className="input my-2"
                            onChange={(e)=>handleInputChange(e, i)}
                            >
                                <option value="glasses">Glasses</option>
                                <option value="body">Body</option>
                                <option value="accessories">Accessories</option>
                            </select>
                            <div className='grid grid-cols-1 col-span-3 gap-1 md:grid-cols-8'>
                                <input
                                name='value'
                                className="input col-span-7 my-2"
                                onChange={(e)=>handleInputChange(e, i)}
                                type='text'
                                placeholder="Property description"
                                ></input>
                                <button 
                                    className='top-5 left-5 text-3xl text-pwgreen-800 cursor-pointer hover:text-pwgreen-600 transition-all hover:rounded-full justify-self-center'
                                    onClick={() => handleRemoveItem(i)}
                                    disabled={inputList.length<=1 ? true : false}
                                    >
                                    <span role="img" aria-label="x emoji">
                                    <IoCloseCircle />
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
                    <button 
                        className="w-1/2 ml-32 font-Rubik py-3 bg-gray-200 border border-solid border-black hover:border-inherit hover:bg-blue-400 font-semibold uppercase rounded-lg shadow-2xl"
                        onClick={(e)=>handleListAdd(e)} 
                        disabled={isDisabled}
                        >
                        Add another property
                    </button>
                    <button
                        className="w-auto font-Rubik py-3 mt-6 text-white bg-blue-600 hover:bg-blue-400 hover:text-black hover:border hover:border-black font-semibold uppercase rounded-lg shadow-2xl"
                        disabled = {media.length<1}
                        type="submit">
                        Mint
                    </button>
                </div>
            </form>
      </div>
    )
}

export default MintForm;