import { alerts } from "@/utils/alerts"
import { NextComponentType } from "next"
import { useForm, SubmitHandler } from 'react-hook-form'


interface CheckStatusInput {
    id: string
}
const Checkstatus: NextComponentType = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CheckStatusInput>({
        defaultValues: {
            id : ''
        }
    })
    const onSubmit: SubmitHandler<CheckStatusInput> = async data => {
        const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET
        const project_id = process.env.NEXT_PUBLIC_API_KEY
        const reqHeader = new Headers();
        reqHeader.append("x-client-secret", client_secret!);
        reqHeader.append("x-project-id", project_id!);

        const requestOptions = {
            method: 'GET',
            headers: reqHeader,
        };

        const url = 'https://staging.crossmint.com/api/2022-06-09/collections/default-solana/nfts/'+data.id
        fetch(url, requestOptions)
        .then(res => res.json())
        .then(result => alerts({
            icon: 'info',
            title: 'NFT Status',
            text: result.metadata?.name 
                ?'Your NFT '+result.metadata.name+' is minted, congrats'
                :'Your NFT is in status: '+result.onChain.status
                ,
            toast: true
        }))
        .catch(err => alerts({
            icon: 'error',
            title: 'Ups, something is wrong.',
            text: err.message,
            toast: true
        }))
    }

    return (
        <div className="w-full mt-8 p-4">
            <h2 className="font-semibold">Check your minted NFT status</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-row w-full">
                    <label className="my-2 py-2 gap-8 mr-4">ID: </label>
                    <input 
                        type='text' 
                        className="input my-2"
                        placeholder="Type your NFT id"
                        {...register('id', {
                            required: true
                        })}
                        />
            </div>
            {errors.id?.type === 'required' ? (
                <p className="text-red-500 text-xs italic">
                    ID is mandatory
                </p>
            ) : null}
            <button
                className="w-32 font-Rubik py-3 mt-6 text-white bg-blue-600 hover:bg-blue-400 hover:text-black hover:border hover:border-black font-semibold uppercase rounded-lg shadow-2xl"                
                type="submit">
                Check status
            </button>
            </form>
        </div>
        )
}

export default Checkstatus;