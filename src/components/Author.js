import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const ETCHER_API_URL = process.env.REACT_APP_API_URL

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

        fetch(`${ETCHER_API_URL}/api/v1/authors/${id}`, requestOptions)
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

        fetch(`${ETCHER_API_URL}/api/v1/posts/byauthor/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setAuthorPosts(data);
            })
            .catch((err) => console.log(err));
    }, [id]);

    //To be diplayed when we click on an individual movie
    return(
        <>
            <div className="text-center">
                <h2>Posts by {author.name}</h2>
                <small><em>{author.email}</em></small>
                <hr />
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Subtitle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {authorPosts && authorPosts.map((post)=>(
                            <tr key={post.id}>
                                <td>
                                    <Link to={`/post/${post.id}`}>
                                        {post.title}
                                    </Link>
                                </td>
                                <td>{post.subtitle}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Author;
