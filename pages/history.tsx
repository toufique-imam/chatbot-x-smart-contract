import { useState } from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/Home.module.css';
import connect from '@/utils/Connect';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { getChatHistory } from '@/utils/ChatUtils';
import { Message } from '@/types/chat';

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
    const [historyMessages, setHistoryMessages] = useState<Array<Message>>([]);

    async function getConnection() {
        setError(null);
        const { error, address } = await connect();
        if (error) {
            setError(error);
        } else {
            globalThis.userAddress = String(address);
        }
    };

    return (
        <>
                    {globalThis.userAddress ? (
                        <main className={styles.main}>
                            <div className="border border-green-400 rounded-md p-4">
                                <p className="text-green-500">{globalThis.userAddress}</p>
                            </div>
                            <div className="border border-blue-400 rounded-md p-4">
                                <button onClick={handleGetHistory}> History </button>
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
                                                    src="/bot-image.png"
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
        </>
    );
}
