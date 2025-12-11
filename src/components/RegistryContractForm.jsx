import { useEffect, useState } from "react";
import { ethers } from "ethers";
import etcherContractABI from './../ABI/EtcherContractABI.json';

export default function RegistryContractForm() {
  const [ authorAddress, setAuthorAddress ] = useState("");
  const [ timestamp, setTimestamp ] = useState("");
  const zeroAddress = ethers.ZeroAddress;

  console.log(zeroAddress);

  // Deployed and verifiable
  // https://repo.sourcify.dev/11155111/0x862c04dfc5A60c76c684Ec36cfD1D52B8c86095F
  const contractAddress = "0x862c04dfc5A60c76c684Ec36cfD1D52B8c86095F";
  const cid = "test_cid";

  async function getContractData() {
    if (!window.ethereum) return alert("Install MetaMask");
    const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/0621766588e14ea8ac7a06cd762cac71"); // make sure anyone can use it without modifying code
    const contract = new ethers.Contract(contractAddress, etcherContractABI, provider);
    const authorRecieved = await contract.authorOf(cid);
    setAuthorAddress(authorRecieved.toString());
    const timeStampRecieved = await contract.timestampOf(cid);
    setTimestamp(timeStampRecieved.toString());
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Contract Playground</h2>
      <p>Stored author's wallet address: {authorAddress}</p>
      <p>Stored timestamp: {timestamp}</p>
      <button onClick={getContractData}>Refresh Value</button>
    </div>
  );
}
