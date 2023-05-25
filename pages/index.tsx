import { useState, useEffect} from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/Home.module.css';
import autoLogin from '@/utils/Connect';
import ChatView from './chatview';
import Image from 'next/image';
import { getCookie, setCookie } from 'typescript-cookie';

export default function Home() {
  const [address, setAddress] = useState<string | undefined>(globalThis.userAddress);
  const [error, setError] = useState<string | null>(null);

  async function getConnection() {
    console.log("called", "getconnection1")
    setError(null);
    setAddress(undefined);
    const { error, address } = await autoLogin()
    if (error) {
      setError(error);
    } else {
      setAddress(address);
      globalThis.userAddress = String(address);
    }
  };
  async function handleNewChat() {
    var reload = false
    if(globalThis.userAddress == undefined){
      reload = true 
    }
    await getConnection()
    if(reload){
      window.location.reload()
    }
  }
  useEffect(() => {
    autoLogin().then( ()=> {
      getConnection()
    })
  }, []);

  return (
    <>
      <Layout>
        <div className="mx-auto flex flex-col gap-4">
          <div className='mx-auto center flex gap-4'>
          <Image
            src="/pinky-logo.jpg"
            alt="Save the prompt to the blockchain"
            width="100"
            height="60"
            className={styles.usericon}
            priority
          />
          </div>
          <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter text-center">
            Save the prompt to the blockchain
          </h1>
          {address ? (
            <>
            <ChatView />
            </>
          ) : (
              <main className={styles.main}>
                  <button className="border border-green-400 rounded-md p-4" onClick={handleNewChat}> New Chat </button>
                {error && (
                  <div className="border border-red-400 rounded-md p-4">
                    <p className="text-red-500">{error}</p>
                  </div>
                )}
              </main>
          )
          }
        </div>
        <footer className="m-auto p-4">
          <a href="">
            Powered by LangChainAI.
          </a>
        </footer>
      </Layout>
    </>
  );
}
