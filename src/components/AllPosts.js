import { useEffect, useState } from "react";
import { PinataSDK } from 'pinata'
import AuthorCard from "./common/AuthorCard";

const SERVER_URL = 'http://localhost:8787'
const GATEWAY_URL = 'fuchsia-improved-albatross-322.mypinata.cloud'
const ETCHER_API_URL = process.env.REACT_APP_API_URL

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT ? process.env.PINATA_JWT : "",
    pinataGateway: GATEWAY_URL,
});

const AllPosts = () => {
    const [authorPosts, setAuthorPosts] = useState([]);

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: headers,
        }
        
        // FAST API Call

        fetch(`${ETCHER_API_URL}/api/v1/posts`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setAuthorPosts(data);
            })
            .catch((err) => console.log(err));
        
    }, []);

    return (
        <>
            <div className="text-left">
                    {authorPosts && authorPosts.map((post)=>(
                    <div key={post.id}>
                        <div className="text-center">
                        <h2 style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '26px' }}>
                            {post.title}
                        </h2>
                        <h4 style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '16px' }}>
                            {post.subtitle}
                        </h4>
                        {post.address && !post.last_verified && <div style={{ fontFamily: 'Times New Roman', fontSize: '14px', color: 'orange'}}>
                            Etched
                        </div>}
                        {post.address && post.last_verified && <div style={{ fontFamily: 'Times New Roman', fontSize: '14px', color: 'green'}}>
                            Etched and Verified
                        </div>}
                        <br/>
                        {/* <img src={post.cover_image_url} alt="cover-image" height="400" width="800"></img> */}
                        </div>
                        <br/>
                        <div className="text-justify">
                        <p style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '18px', marginLeft: '200px', marginRight: '200px', lineHeight: '2.0', overflowWrap: 'anywhere'}}>{post.content}</p>
                        <hr/>
                        </div>
                        </div>
                    ))}
            </div>
        </>
    );
}

export default AllPosts;
