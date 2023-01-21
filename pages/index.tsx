import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import MintForm from '@/components/MintForm'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Checkstatus from '@/components/CheckStatus'


export default function Home({message} : InferGetStaticPropsType<typeof getStaticProps>) {
  
  return (
    <>
      <Head>
        <title>Create NFT</title>
        <meta name="description" content="Mint your NFT" />        
      </Head>
      <main className="flex flex-col items-center font-Rubik gap-8">
        <h1 className='font-semibold text-2xl mt-8'>Create single NFT</h1>        
        <MintForm/>
        <Checkstatus/>
      </main>
    </>
  )
}

export const getStaticProps : GetStaticProps = async (context) => {
  return {
    props: { message: `Next.js is great` }, // will be passed to the page component as props
  }
}
