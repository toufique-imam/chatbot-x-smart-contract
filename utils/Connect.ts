import { ethers } from 'ethers';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie'

declare let window: {
    ethereum: ethers.providers.ExternalProvider;
};
const userKey = "userLoggedIn"
export function isLoggedIn(){
    const userLoggedIn = getCookie(userKey)
    return (userLoggedIn != undefined)
}
export function logout(){
    removeCookie(userKey)
}
export function login(address: string){
    setCookie(userKey, address)
}
const connect = async () => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        if (provider) {
            await provider.send('eth_requestAccounts', []);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            return {
                address,
            };
        } else {
            return {
                error: 'Please install Metamask at https://metamask.io',
            };
        }
    } catch (error) {
        return {
            error: 'An unexpected error occurs',
        };
    }
};
export const firstConnect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (provider) {
        await provider.send('wallet_requestPermissions', [{
            eth_accounts: {}
        }]);
        return await connect()
    } else {
        return {
            error: 'Please install Metamask at https://metamask.io',
        };
    }
}
export default async function autoLogin() {
    if(isLoggedIn()){
        const {address,error} =  await connect()
        if(address){
            login(address)
        }
        return {address, error}
    }else{
        const {address, error} = await firstConnect()
        if (address) {
            login(address)
        }
        return {address, error}
    }
}