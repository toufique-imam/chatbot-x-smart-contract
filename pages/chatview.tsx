import { useRef, useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';
import { Message } from '@/types/chat';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/ui/LoadingDots';
import { setChatValue } from '@/utils/ChatUtils';

export default function ChatView() {
    const [query, setQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [messageState, setMessageState] = useState<{
        messages: Message[];
        pending?: string;
        history: [string, string][]
    }>({
        messages: [
            {
                message: 'Hi, what would you like to explore today?',
                type: 'apiMessage'
            },
        ],
        history: [],
    });
    const { messages, history } = messageState;

    const messageListRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        textAreaRef.current?.focus();
    }, []);

    //handle form submission
    async function handleSubmit(e: any) {
        e.preventDefault();

        setError(null);

        if (!query) {
            alert('Please input a question');
            return;
        }

        const question = query.trim();

        setMessageState((state) => ({
            ...state,
            messages: [
                ...state.messages,
                {
                    type: 'userMessage',
                    message: question,
                },
            ],
        }));

        setLoading(true);
        setQuery('');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question
                }),
            });
            const data = await response.json();
            console.log('data', data);

            if (data.error) {
                setError(data.error);
            } else {
                const address = '0x813765319816aA778fA491Ad7aBFa6A93EC77e4F'
                const userId = globalThis.userAddress ?? "";

                setChatValue(address, userId, question, data.response).then(hash => {
                    console.log("TXID ", hash)
                });
                setMessageState((state) => ({
                    ...state,
                    messages: [
                        ...state.messages,
                        {
                            type: 'apiMessage',
                            message: data.response
                        },
                    ],
                    history: [...state.history, [question, data.response]],
                }));
            }
            console.log('messageState', messageState);

            setLoading(false);

            //scroll to bottom
            messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
        } catch (error) {
            setLoading(false);
            setError('An error occurred while fetching the data. Please try again.');
            console.log('error', error);
        }
    }
    //prevent empty submissions
    const handleEnter = (e: any) => {
        if (e.key === 'Enter' && query) {
            handleSubmit(e);
        } else if (e.key == 'Enter') {
            e.preventDefault();
        }
    };

    return (
        <>
            <main className={styles.main}>
                {/* <Link href="history" className="hover:text-slate-600 cursor-pointer px-10">

                    <div className="border border-blue-400 rounded-md p-3">
                        <p className="text-blue-500">Chat History</p>
                    </div>    
                </Link> */}

                <div className="rounded-md p-3">
                </div>
{/* 
                <div className="border border-green-400 rounded-md p-3">
                    <p className="text-green-500">{globalThis.userAddress}</p>
                </div> */}

                <div className="rounded-md p-3">
                </div>

                <div className={styles.cloud}>
                    <div ref={messageListRef} className={styles.messagelist}>
                        {messages.map((message, index) => {
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
                                className =
                                    loading && index === messages.length - 1
                                        ? styles.usermessagewaiting
                                        : styles.usermessage;
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
                <div className={styles.center}>
                    <div className={styles.cloudform}>
                        <form onSubmit={handleSubmit}>
                            <textarea
                                disabled={loading}
                                onKeyDown={handleEnter}
                                ref={textAreaRef}
                                autoFocus={false}
                                rows={1}
                                maxLength={512}
                                id="userInput"
                                name="userInput"
                                placeholder={
                                    loading
                                        ? 'Waiting for response...'
                                        : 'What do you want to explore?'
                                }
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className={styles.textarea}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className={styles.generatebutton}
                            >
                                {loading ? (
                                    <div className={styles.loadingwheel}>
                                        <LoadingDots color="#000" />
                                    </div>
                                ) : (
                                    // Send icon SVG in input field
                                    <svg
                                        viewBox="0 0 20 20"
                                        className={styles.svgicon}
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                                    </svg>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {error && (
                    <div className="border border-red-400 rounded-md p-4">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}
            </main>
        </>
    );
}
