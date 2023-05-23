import { get } from 'http';
import ChatHistoryJson from './ChatHistory.json';
import { ethers } from 'ethers';

declare let window: {
    ethereum: ethers.providers.ExternalProvider;
};

export const setChatValue = async (contractAddress: string, userid: string, query: string, reply: string) => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            contractAddress,
            ChatHistoryJson.abi,
            signer,
        );
        const transactionResult = await contract.add_chat_history(userid, query, reply);

        const receipt = await transactionResult.wait();
        return { hash: receipt.transactionHash };
    } catch (error) {
        return {
            error: String(error),
        };
    }
};

export const getChatHistory = async (contractAddress: string, userid: string) => {
    var res: Array<string> = []
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            contractAddress,
            ChatHistoryJson.abi,
            signer,
        );

        const cntarray = await contract.getChatsCount(userid);
        const cnt = cntarray.toNumber();

        for (let i = 0; i < cnt; i++) {
            const chat = await contract.getChat(userid, i);
            console.log(i, chat, String(chat[0]), String(chat[1]));
            res.push(String(chat[0]));
            res.push(String(chat[1]));
        }
    } catch (error) {

    }
    return res;
};