import Link from "next/link";
import autoLogin, { logout } from "@/utils/Connect";
import { useEffect, useState } from "react";

interface LayoutProps {
  children?: React.ReactNode;
}
declare global {
  var userAddress: string | undefined
  var reloaded: boolean
}
export default function Layout({ children }: LayoutProps) {
  const [address, setAddress] = useState<string | undefined>(globalThis.userAddress);
  async function handleDisconnection() {
    // setLoading(true)
    setAddress(undefined)
    logout();
    window.location.reload();
  };
  async function handleLogin() {
    await getConnection()
    window.location.reload()
  }
  async function getConnection() {
    console.log("called", "getconnection2")

    // setLoading(true)
    const { error, address } = await autoLogin()
    if (error) {
    } else {
      setAddress(address)
      globalThis.userAddress = String(address);
    }
  };
  useEffect(() => {
    autoLogin().then(() => {
      console.log("called", "autologin1")
      getConnection()
    })
  }, []);


  return (
    <div className="mx-auto flex flex-col space-y-4">
      <header className="container sticky top-0 z-40 bg-white">
        <div className="h-16 border-b border-b-slate-200 py-4">
          <nav className="ml-4 pl-6">
            <Link href="/" className="hover:text-slate-600 cursor-pointer border border-green-400 rounded-md p-1 px-5">
              Home
            </Link>
            {address ? (
              <>
                <Link href="history" className="border border-green-400 rounded-md p-1 hover:text-slate-600 cursor-pointer px-5">
                  History
                </Link>
                <Link href="history" className="hover:text-slate-600 cursor-pointer px-20 border border-green-400 rounded-md p-1">
                  UserId: {address}
                </Link>
                {window.location.pathname == '/history' ? (
                  <></>
                ) :
                  (
                    <button onClick={handleDisconnection} className="hover:text-slate-600 cursor-pointer px-5 ">
                      Logout
                    </button>
                  )
                }
              </>

            ) : (
              <>
                  <Link href="/" onClick={handleLogin} className="hover:text-slate-600 cursor-pointer px-5 border border-green-400 rounded-md p-1">
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <div>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
