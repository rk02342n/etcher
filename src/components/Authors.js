import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Authors = () => {
    const [authors, setAuthors] = useState([]);

    useEffect( () => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`http://localhost:8000/api/v1/authors`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setAuthors(data);
            })
            .catch((err) => console.log(err));
    }, []);

    return(
    <>
        <div className="text-center">
            <h2>Authors</h2>
            <hr />
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {authors.map((author)=>(
                        <tr key={author.id}>
                            <td>
                                <Link to={`/authors/${author.id}`}>
                                    {author.name}
                                </Link>
                            </td>
                            <td>{author.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
    );
}

export default Authors;