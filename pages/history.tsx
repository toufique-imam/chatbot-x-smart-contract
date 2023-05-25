import { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.css';
import autoLogin from '@/utils/Connect';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { getChatHistory } from '@/utils/ChatUtils';
import { Message } from '@/types/chat';
import Layout from '@/components/layout';

export default function HistoryView() {
    const [error, setError] = useState<string | null>(null);
    async function handleGetHistory() {
        console.log("handleGetHistory")
        const address = '0x813765319816aA778fA491Ad7aBFa6A93EC77e4F'
        const userId = globalThis.userAddress ?? '';
        getChatHistory(address, userId).then((chatHistory) => {
            setHistoryMessages([]);
            for (let i = 0; i < chatHistory.length; i++) {
                setHistoryMessages((oldhistories) => {
                    let messageNow: Message = {
                        message: chatHistory[i],
                        isStreaming: false,
                        type: i % 2 == 1 ? 'apiMessage' : 'userMessage'
                    }
                    return [...oldhistories, messageNow]
                })
            }
        })
    }
    const [address, setAddress] = useState<string | undefined>(globalThis.userAddress);
    const [historyMessages, setHistoryMessages] = useState<Array<Message>>([]);
    async function handleGetConnection() {
        var reload = false
        if (globalThis.userAddress == undefined) {
            reload = true
        }
        await getConnection()
        if (reload) {
            window.location.reload()
        }
    }
    async function getConnection() {
        console.log("called", "getconnection3")
        setAddress(undefined)
        setError(null);
        const { error, address } = await autoLogin()
        if (error) {
            setError(error);
            // myEmitter.emit("userLoggedOut", true)
        } else {
            setAddress(String(address));
            globalThis.userAddress = String(address);
            handleGetHistory();
            // myEmitter.emit("userLoggedIn", true)
        }
    };
    useEffect(() => {
        if (address) {
            handleGetHistory()
        } else {
            getConnection()
        }
    })

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
                        Save the prompt to the blockchain | History
                    </h1>
                    {address ? (
                        <main className={styles.main}>
                            <div className="border border-green-400 rounded-md p-4">
                                <p className="text-green-500">{globalThis.userAddress}</p>
                            </div>
                            <div className="rounded-md p-3">
                            </div>
                            <button className="border border-blue-400 rounded-md p-4" onClick={handleGetHistory}> Refresh History </button>
                            <div className="rounded-md p-3">
                            </div>
                            <div className={styles.cloud}>
                                <div className={styles.messagelist}>
                                    {historyMessages.map((message, index) => {
                                        let icon;
                                        let className;
                                        if (message.type === 'apiMessage') {
                                            icon = (
                                                <Image
                                                    key={index}
                                                    src="/pinky-logo.jpg"
                                                    alt="AI"
                                                    width="40"
                                                    height="40"
                                                    className={styles.boticon}
                                                    priority
                                                />
                                            );
                                            className = styles.apimessage;
                                        } else {
                                            icon = (
                                                <Image
                                                    key={index}
                                                    src="/usericon.png"
                                                    alt="Me"
                                                    width="30"
                                                    height="30"
                                                    className={styles.usericon}
                                                    priority
                                                />
                                            );
                                            // The latest message sent by the user will be animated while waiting for a response
                                            className = styles.usermessage;
                                        }
                                        return (
                                            <>
                                                <div key={`chatMessage-${index}`} className={className}>
                                                    {icon}
                                                    <div className={styles.markdownanswer}>
                                                        <ReactMarkdown linkTarget="_blank">
                                                            {message.message}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })}
                                </div>
                            </div>
                        </main>
                    ) : (
                        <main className={styles.main}>
                            <div className="border border-green-400 rounded-md p-4">
                                <button onClick={handleGetConnection}> Connect to Polygon </button>
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
