import { useEffect, useState } from "react";

export function useMetaMask() {
  const [address, setAddress] = useState("");

  async function connect() {
    if (!window.ethereum) throw new Error("MetaMask not installed");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAddress(accounts[0]);
  }

  useEffect(() => {
    if (!window.ethereum) return;

    // Check initial connection
    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accounts) => accounts.length && setAddress(accounts[0]));

    // Listen for changes
    const handler = (accounts) => setAddress(accounts[0] || "");
    window.ethereum.on("accountsChanged", handler);

    return () => window.ethereum.removeListener("accountsChanged", handler);
  }, []);

  return { address, connect };
}
