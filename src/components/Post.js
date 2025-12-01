import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Post = () => {
    const [post, setPost] = useState({});
    let { id } = useParams();

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`/api/v1/posts/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setPost(data);
                console.log(data);
            })
            .catch((err) => console.log(err));
    }, [id]);

    //To be diplayed when we click on an individual movie
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
                        
                        <div style={{ fontFamily: 'Times New Roman', fontSize: '14px' }}>
                            Rohit Sai Gopal
                        </div>
                        <br/>
                        <img src={post.cover_image_url} alt="cover-image" height="400" width="800"></img>
                        </div>
                        <br/>
                        <div className="text-justify">
                        <p style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '18px', marginLeft: '200px', marginRight: '200px', lineHeight: '2.0'}}>{post.content}</p>
                        <hr/>
                        </div>
                        </div>
                }
                {/* {post && <div><p>{post}</p></div>} */}
            </div>
        </>
    );
}

export default Post;
