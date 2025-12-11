import { useState } from "react";
import { ethers } from "ethers";
import contractABI from './ABI.json'

export default function ContractPlayground() {
  const [value, setValue] = useState("");
  const [stored, setStored] = useState("");
  const [txStatus, setTxStatus] = useState("");

  const contractAddress = "0x86DfdB0dCb27b3C87B589eDf341d3F9bfbC7de92";

  async function getStoredValue() {
    if (!window.ethereum) return alert("Install MetaMask");
    // const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/0621766588e14ea8ac7a06cd762cac71");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    // const network = await provider.getNetwork();
    const result = await contract.retrieve();
    setStored(result.toString());
  }

  async function storeValue() {
    if (!window.ethereum) return alert("Install MetaMask");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log(signer);

    const tx = await contract.store(Number(value));
    setTxStatus("Transaction pending...");
    await tx.wait();
    setTxStatus("Transaction confirmed!");
    getStoredValue(); // refresh value
  }

  

  return (
    <div style={{ padding: 20 }}>
      <h2>Contract Playground</h2>

      <p>Stored value: {stored}</p>
      <button onClick={getStoredValue}>Refresh Value</button>

      <div style={{ marginTop: 20 }}>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter number"
        />
        <button onClick={storeValue}>Store Value</button>
      </div>

      <p>{txStatus}</p>
    </div>
  );
}
