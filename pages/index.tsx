import { useState } from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/Home.module.css';
import connect from '@/utils/Connect';
import ChatView from './chatview';

declare global {
  var userAddress: string | undefined
}
export default function Home() {
  const [address, setAddress] = useState<string | undefined>(globalThis.userAddress);
  // const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function getConnection() {
    // setLoading(true)
    setError(null);
    setAddress(undefined);
    const { error, address } = await connect();
    if (error) {
      setError(error);
    } else {
      setAddress(address);
      globalThis.userAddress = String(address);
    }
    // setLoading(false);
  };

  return (
    <>
      <Layout>
        <div className="mx-auto flex flex-col gap-4">
          <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter text-center">
            Chatbot with polygon network
          </h1>
          {address ? (
            <ChatView/>
          ) : (
              <main className={styles.main}>
                <div className="border border-green-400 rounded-md p-4">
                  <button onClick={getConnection}> Connect to Polygon </button>
                </div>
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
