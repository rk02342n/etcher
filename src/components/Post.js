import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import etcherContractABI from './../ABI/EtcherContractABI.json';
import { PinataSDK } from "pinata";
import { of as computeHash  } from "ipfs-only-hash";
import { predictCid } from "../utils/predictCid";
import { CID } from "multiformats/cid";
import * as Digest from "multiformats/hashes/sha2";
import axios from "axios";
import { useMetaMask } from "../hooks/useMetamask";

const ETCHER_API_URL = process.env.REACT_APP_API_URL;
const GATEWAY_URL = 'fuchsia-improved-albatross-322.mypinata.cloud'

const pinata = new PinataSDK({
  pinataJwt: "",
  pinataGateway: GATEWAY_URL
})

const Post = () => {
    const { walletAddress, connect } = useMetaMask();
    const [ post, setPost ] = useState({});
    let { id } = useParams();
    const zeroAddress = ethers.ZeroAddress;
    const [ author, setAuthor ] = useState();
    const [ authorAddress, setAuthorAddress ] = useState(zeroAddress);
    const [ timestamp, setTimestamp ] = useState("0");
    const [ txStatus, setTxStatus ] = useState("");
    const [ lastVerified, setLastVerified ] = useState("");

    const contractAddress = "0x862c04dfc5A60c76c684Ec36cfD1D52B8c86095F";

    const [isVerified, setIsVerified] = useState(false);
    const [verifyStatus, setVerifyStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEtched, setIsEtched] = useState(false);
  
    async function getContractData(content_cid) {
        // Tells us if the CID exists on chain
        // Sets values for authorAddress, timestamp and isEtched
    if (!content_cid) return;
      if (!window.ethereum) return alert("Install MetaMask");
      const provider = new ethers.BrowserProvider(window.ethereum);
    //   const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/0621766588e14ea8ac7a06cd762cac71"); // make sure anyone can use it without modifying code
      const contract = new ethers.Contract(contractAddress, etcherContractABI, provider);
      const authorRecieved = await contract.authorOf(content_cid);
      setAuthorAddress(authorRecieved.toString());
      const timeStampRecieved = await contract.timestampOf(content_cid);
      setTimestamp(timeStampRecieved.toString());
      setIsEtched(authorRecieved.toString()!== zeroAddress && (timeStampRecieved.toString() !== '0'));
    }

    async function storeContractData(cid) {
        setLoading(true);
        if(!post.content_cid) return;
        if (!window.ethereum) return alert("Install MetaMask");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        console.log(signer.address);
        const contract = new ethers.Contract(contractAddress, etcherContractABI, signer);    
        const tx = await contract.registerPost(cid);
        setTxStatus("Transaction pending...");
        await tx.wait();
        setTxStatus("Transaction confirmed! Your post is etched and verifiable on-chain.");
        getContractData(cid); // refresh value
        updateWalletAddressOnPost( signer.address );
        setLoading(false);
    }

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`${ETCHER_API_URL}/api/v1/posts/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setPost(data);
            })
            .catch((err) => console.log(err));
    }, [id]);

    useEffect(() => {
        if (!post.author_id) return;
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        getContractData(post.content_cid);

        fetch(`${ETCHER_API_URL}/api/v1/authors/${post.author_id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setAuthor(data);
            })
            .catch((err) => console.log(err));
        
        setLastVerified('Last verified: ' + (new Date(post.last_verified)).toLocaleString())
    }, [ post ]);

    const handleVerifyContract = ( content_cid ) => {
        
        setVerifyStatus("Verifying post...");
        getContractData(content_cid);
        // Assumming there is always a content CID on IPFS and is Etched onto chain
        if(isEtched){
            verifyPost();
        }
    }

    const handleEtchClick = async () => {
        storeContractData(post.content_cid);
    }

    const verifyPost = async () => {
        let ipfsData;
        // 0. Get the CID from ethereum
        if (!isEtched) setVerifyStatus("CID not on chain, please etch your post.");
        // 1. Check if the wallet address on chain matches the one on the record
        if (post.address !== authorAddress) {
            setVerifyStatus("Wallet address could not be verified");
            return;
        }
        // 2. Get content from IPFS using the CID
        setVerifyStatus("Getting content from IPFS")
        await pinata.gateways.public.get(post.content_cid)
        .then((res) => {
            ipfsData = res.data;
        })
        setVerifyStatus("Comparing CID on chain vs locally computed CID of the content")
        //3. Compute CID locally of the IPFS content
        const localCid = await hashArticleText(ipfsData);
        console.log("locally computed: " + localCid);
        console.log("generated by pinata on upload: " + post.content_cid);

        //4. Compare locally generated CID vs the on-chain one
        if(localCid === post.content_cid){
            updateVerificationDateOnPost();
            setIsVerified(true);
            setVerifyStatus("Successfully verified.");
        } else {
            setVerifyStatus("Verification failed.");
            setIsVerified(false);
        }
    }

    const updateVerificationDateOnPost = async () => {
        setVerifyStatus("Updating record on cache");
        const now = new Date();
        const isoDate = now.toISOString();
        console.log(isoDate);
        const postData = {
            last_verified: isoDate,
            };
        await axios.patch(`${ETCHER_API_URL}/api/v1/posts/${post.id}`, postData)
            .then(response => {
                console.log('Success:', response.data);
                setLastVerified('Last verified: ' + (new Date(response.data.last_verified)).toLocaleString())
                setVerifyStatus("Done!");
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }

        const updateWalletAddressOnPost = async ( walletAddress ) => {
            const postData = {
                address: walletAddress,
                };
            await axios.patch(`${ETCHER_API_URL}/api/v1/posts/${post.id}`, postData)
                .then(response => {
                    console.log('Success:', response.data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }

    async function hashArticleText(text) {
        const bytes = new TextEncoder().encode(text);
        const digest = await Digest.sha256.digest(bytes);
        const cid = CID.create(1, 0x55, digest);  // Raw codec
        return cid.toString();
    }

    //To be diplayed when we click on an individual post
    return(
        <>
            <div>
                {post && 
                    <div key={post.id}>
                    <div className="text-center">
                    <h2 style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '26px' }}>
                        {post.title}
                    </h2>
                    <h4 style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '20px' }}>
                        {post.subtitle}
                    </h4>
                    {author && <div style={{ fontFamily: 'Times New Roman', fontSize: '14px' }}>
                        {author.name}
                    </div>}
                    <br/>
                    <p style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '16px' }}>
                        {'Content CID: ' + post.content_cid}
                    </p>

                    {post.last_verified && <p style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '16px', color: 'royalblue' }}>
                        {lastVerified}
                    </p>}

                    { authorAddress && (authorAddress!== zeroAddress) && <div>Author Wallet Address: {authorAddress}</div>}
                    {timestamp && (timestamp !== '0') && (
                        <p>Created at: {new Date(Number(timestamp) * 1000).toLocaleString()}</p>
                    )}
                    <br/>
                    <p style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '16px', color: 'blue' }}>
                        {txStatus}
                    </p>
                    
                    {(!timestamp || (timestamp === '0')) && (!authorAddress || (authorAddress === zeroAddress)) && 
                    <button onClick={() => handleEtchClick(post)}
                        disabled={!post.content_cid || isEtched}
                        style={{borderColor: 'green', borderRadius: '10px', margin: '10px'}}>
                        Etch
                    </button>}
                    <button
                        onClick={() => handleVerifyContract(post.content_cid)}
                        disabled={(!post.content_cid) || !isEtched }
                        style={{borderColor: 'black', borderRadius: '10px', marginTop: '10px', margin: '10px'}}>
                        Verify
                    </button>
                    {<h6 style={{color: 'green', marginTop:'10px', marginBotom:'0px', fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '20px'}}>{verifyStatus}</h6>}

                    {loading && <p>Loading...</p>}
                    {/* <img src={post.cover_image_url} alt="cover-image" height="400" width="800"></img> */}
                    </div>
                    <br/>
                    <div className="text-justify">
                    <p style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '18px', marginLeft: '200px', marginRight: '200px', lineHeight: '2.0'}}>{post.content}</p>
                    <hr/>
                    </div>
                    </div>
                }
            </div>
        </>
    );
}

export default Post;
