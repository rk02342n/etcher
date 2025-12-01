import { useEffect, useState } from "react";
import { PinataSDK } from 'pinata'

const SERVER_URL = 'http://localhost:8787'
const GATEWAY_URL = 'fuchsia-improved-albatross-322.mypinata.cloud'
const dummyAuthorAddress = 'xyzxyzxyzxyz';

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT ? process.env.PINATA_JWT : "",
    pinataGateway: GATEWAY_URL,
});

const AllPosts = () => {
    const [authorPosts, setAuthorPosts] = useState([]);
    const [post, setPost] = useState('');

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        //IPFS + Pinata call
        //  const fetchPosts = async () => {
        //     const urlResponse = await fetch(`${SERVER_URL}/presigned_url`, {
        //         method: "GET",
        //         headers: {
        //          // Handle your own server authorization here
        //         }
        //     })
        //     const data = await urlResponse.json()
    
        //     const files = await pinata.files.public
        //         .list()
        //         .keyvalues({
        //             author_address: dummyAuthorAddress
        //         })
        //         .url(data.url)

        //     console.log(files);
        // }
        // fetchPosts();

        
        // FAST API Call

        fetch(`/api/v1/posts`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setAuthorPosts(data);
                console.log(authorPosts);
            })
            .catch((err) => console.log(err));
        
    }, []);

    return (
        <>
            <div className="text-left">
            {/* <hr/> */}
                {/* {authorPosts && authorPosts.map((post)=>(
                        <div key={post.id}>
                        <h2 style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '26px' }}>
                            {post.title}
                        </h2>
                        <p style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '18px' }}>{post.content}</p>
                        <hr/>
                        </div>
                ))} */}
                    {authorPosts && authorPosts.map((post)=>(
                    <div key={post.id}>
                        <div className="text-center">
                        <h2 style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '26px' }}>
                            {post.title}
                        </h2>
                        <h4 style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '20px' }}>
                            {post.subtitle}
                        </h4>
                        
                        <div style={{ fontFamily: 'Times New Roman', fontSize: '14px' }}>
                            Rohit Sai Gopal
                        </div>
                        <br/>
                        {/* <img src={post.cover_image_url} alt="cover-image" height="400" width="800"></img> */}
                        </div>
                        <br/>
                        <div className="text-justify">
                        <p style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '18px', marginLeft: '200px', marginRight: '200px', lineHeight: '2.0'}}>{post.content}</p>
                        <hr/>
                        </div>
                        </div>
                    ))}
            </div>
        </>
    );
}

export default AllPosts;
