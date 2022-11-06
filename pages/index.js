// "0x1B152Bdb2C334AA296124c6d295C82524b01166A";
import abi from '../utils/BuyMeACoffee.json';
import { ethers } from "ethers";
import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useState } from "react";
import styles from '../styles/Home.module.css'

export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0x34e44EE33eee70EA091e0f71776ecfcfddC31c64";
  const contractABI = abi.abi;
  const deployer = "0x85a8db89e47E122872f17fFd7fDB75c498e41C2a"
  
  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [contractBalance, setContractBalance] = useState("");
  const [proceeds, setProceeds] = useState("");
  const [isVisible, setIisVisible] = useState(false);
  
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);

  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  }

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({method: 'eth_accounts'})
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account );
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setCurrentAccount(accounts[0]);
      await handleVisibility()
      await getBalance()
    } catch (error) {
      console.log(error);
    }
  }

  const buyCoffee = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("buying coffee..")
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "anon",
          message ? message : "Enjoy your coffee!",
          {value: ethers.utils.parseEther("0.001")}
        );

        await coffeeTxn.wait();
        await getContractBalance()

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");

        // Clear the form fields.
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const buyLargeCoffee = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("buying large coffee..")
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "Bella",
          message ? message : "Enjoy your coffee!",
          {value: ethers.utils.parseEther("0.005")}
        );

        await coffeeTxn.wait();
        await getContractBalance()

        console.log("mined ", coffeeTxn.hash);

        console.log("large coffee purchased!");

        // Clear the form fields.
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };
// check balance
  const getBalance = async()=>{
    
    try{
          const { ethereum } = window;
        if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        
        console.log("getting the balance of the account conneted..");
        const balance = await buyMeACoffee.getBalanceAccount();
        console.log("fetched!");
        setAccountBalance(ethers.utils.formatEther(balance).toString());
      } else {
        console.log("Metamask is not connected");
      }
      
    }catch (error) {
      console.log(error);
    }
  }
  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        
        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("fetched!");
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }
      
    } catch (error) {
      console.log(error);
    }
  };


  // lougout
async function logout(){
  window.ethereum.request({
        method: 'eth_requestAccounts'
      });
  console.log("Open");
  console.log(currentAccount);
}
// withdraw all offers
async function withdraw() {
  console.log(`Withdrawing...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, contractABI, signer)
    try {
      const transactionResponse = await contract.withdrawTips()
      await transactionResponse.wait(1)
      await getContractBalance()
      await getBalance()
      await handleVisibility()
      
    } catch (error) {
      console.log(error)
    }
  } else {
    console.log("You are not the owner")
  }
}
 // get contract balance
async function getContractBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    try {
      let balance = await provider.getBalance(contractAddress)
      setContractBalance(balance)
      console.log("Here")
      console.log(ethers.utils.formatEther(balance))
      setProceeds(ethers.utils.formatEther(balance))
    } catch (error) {
      console.log(error)
    }
  } else {
         console.log("error")
  }
}

async function handleVisibility() {
   const { ethereum } = window;
if(ethereum){
  const accounts = await ethereum.request({method: 'eth_accounts'})
   if (accounts.length > 0) {
        const account = accounts[0];
  if(account.slice(-5)=="41c2a"){
    setIisVisible(true)
    console.log("here is true")
    console.log(account.slice(-5)=="41c2a")
  }else{
    setIisVisible(false)
    
  }
     
   }else{
    setIisVisible(false)
     
   }
}else{
    setIisVisible(false)
    
  }
}
 
  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getMemos();
    getContractBalance();
    handleVisibility();
    
     // Clear the form fields.
        setName("");
        setMessage("");
   
    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name
        }
      ]);
    };

    const {ethereum} = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    }
  }, []);

  useEffect(()=>{
    async function accountChange(){
      const {ethereum} = window;
      if(ethereum){
        
       ethereum.on("accountsChanged", async function(){
        const accounts =await  window.ethereum.request({
        method: 'eth_accounts'
      });
        if(accounts.length){
          setCurrentAccount(accounts[0]);
         await getBalance()
        await handleVisibility()
          
        }else{
          window.location.reload();
        }
      
    })
      }
    }

     accountChange();
  },[])

  return (
    <div className='font-globalFont min-h-screen bg-purple-700 pt-16'>
      <Head>
        <title>Buy Galien a Coffee!</title>
        <meta name="description" content="Tipping site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
     
      <div className="max-w-4xl flex flex-col  mx-auto text-gray-100 bg-purple-700  pb-4  rounded-2xl">  
       <div className="flex flex-col md:flex-row m-5 gap-4 ">
          {currentAccount ?(
          <div className="bg-purple-600 p-5 w-full basis-2/6 text-center flex flex-col items-center justify-center rounded-lg gap-4  shadow-lg w-full">
              <img className = "w-24 rounded-full" src="https://lh3.googleusercontent.com/Nm2XUNejwv4dyshcY1hnOGHkO8AXNcj0GDVMYT4qwShDKR83AU6kQh95huvQfEl4yraKz2XWBGaRQ9Lx6P1M5hM-RF4TIVKJG135hg"/>
          
           <h2 className="font-bold text-2xl">Your wallet details</h2>
            <div className="">
              <label className="text-lg font-medium ">Account address</label>
              <p >{currentAccount.slice(0,6)}...{currentAccount.slice(-4)}</p>
              <button className="text-lg font-medium border font-semiblod text-lg px-2 p-1 text-white rounded-2xl">Balance</button>
              <p onClick={()=> getBalance()}>{accountBalance} ETH</p>
            </div>
           <button className=" bg-purple-900  font-semiblod text-lg px-3 p-2 text-white rounded-2xl" disabled type="button">
              connected
           </button>
          
         </div>  
    ):(
            <div className="bg-purple-600 p-5 w-full basis-2/6 text-center flex flex-col items-center justify-center rounded-lg gap-6  shadow-lg">
              <img className = "w-20 rounded-full" src="https://lh3.googleusercontent.com/Nm2XUNejwv4dyshcY1hnOGHkO8AXNcj0GDVMYT4qwShDKR83AU6kQh95huvQfEl4yraKz2XWBGaRQ9Lx6P1M5hM-RF4TIVKJG135hg"/>
          
           <h2 className="font-bold text-2xl">Buy Galien Coffee</h2>
            <img className = "w-20" src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/ethereum-eth-icon.png"/>
           <button className="bg-purple-700 font-semiblod text-lg px-3 p-2 text-white rounded-2xl" type="button" onClick={connectWallet}>
              connect you wallet
           </button>
          
         </div>
          )}
         
         {currentAccount ? (
         <div className="bg-purple-600 shadow-lg w-full basis-4/6 p-4 rounded-lg gap-4  shadow-lg">
           <form>
             <input 
                  id="name"
                  type="text"
                  placeholder="name"
                  onChange={onNameChange}
                 className="w-full bg-inherit border p-2  mt-2 rounded-2xl placeholder-white"
                 onChange={onNameChange}/>
             <textarea
                  rows={3}
                  placeholder="Send Galien a message"
                  id="message"
                  onChange={onMessageChange}
                  className="w-full  bg-inherit border p-2  mt-3 rounded-2xl placeholder-white"
                  required
                >
                </textarea>
             <div className="flex md:flex-row flex-col  md:gap-8 gap-2 my-2">
              <button className="bg-purple-700 font-semiblod text-medium px-3 p-2 text-white rounded-2xl" type="button"
                  onClick={buyCoffee}>
              Send 1 Coffee for 0.001ETH
           </button>
          <button className="bg-purple-700 font-semiblod text-medium px-3 p-2 text-white rounded-2xl " type="button"
                  onClick={buyLargeCoffee}>
              Send 1 large Coffee for 0.01ETH
           </button>
                
             </div>
             <div>
               {isVisible ? (<p>Proceeds :{proceeds} ETH</p>):(<p></p>)}
               {proceeds > 0 && isVisible ?(
               <button className="bg-purple-700 font-semiblod text-lg px-3 p-2                    text-white rounded-2xl my-2" type="button"
                onClick={()=>withdraw()}>
                 withdraw proceeds
               </button>
               ):(<p></p>)}
             </div>
           </form>
         </div>
      ) : (
            <div className="bg-purple-600 shadow-lg w-full basis-4/6 p-4 gap-4 rounded-lg gap-4  shadow-lg flex flex-col items-center justify-center">             
           <h2 className="font-bold text-2xl text-center">Welcome to Buy Galien Coffee</h2>
               <p className='text-center'>Please connect your meta mastk wallet</p>
            </div>
          )}
       </div>
         {currentAccount && (<div className="bg-purple-600  text-center flex flex-col items-center justify-center rounded-lg px-4 mx-4  shadow-lg">
         <h2 className="font-bold text-2xl p-5">Memos received</h2>
         {currentAccount && (memos.map((memo, idx) => {
        return (  
         <div  key={idx}  className="w-full  bg-white text-blue-800 py-1 px-3 text-white rounded-2xl mb-3">
           <div className="flex flex-row gap-6 w-full p-4 items-center">
             <p className="flex flex-row">From: <span className="ml-4 p-1 md:p-2 rounded-2xl bg-purple-600 text-gray-100">{memo.name} </span> </p>
            <p className="flex flex-row">at {memo.timestamp.toString()}</p>
           </div>
            <p >"{memo.message}"</p>
            
          </div>
            )}))}
         </div>)}
 </div>
    </div>
  )
}
