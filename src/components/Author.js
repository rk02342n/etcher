import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Author = () => {
    const [author, setAuthor] = useState({});
    const [authorPosts, setAuthorPosts] = useState([]);
    let { id } = useParams();

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`/api/v1/authors/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setAuthor(data);
            })
            .catch((err) => console.log(err));
    }, [id]);

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`/api/v1/posts/byauthor/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setAuthorPosts(data);
            })
            .catch((err) => console.log(err));
    }, [id]);


    //To be diplayed when we click on an individual movie
    return (
        <>
            <div className="text-center">
                <h2>Author: {author.name}</h2>
                <small><em>Their email is {author.email}, and they are very talented</em></small>
                <hr />
            </div>
            <div className="text-left">
            <h3>Posts</h3>
            <hr/>
                {authorPosts.map((post)=>(
                        <div key={post.id}>
                        <h2>
                            {post.title}
                        </h2>
                        <p>{post.content}</p>
                        <hr/>
                        </div>
                ))}
            </div>
        </>
    );
}

export default Author;
