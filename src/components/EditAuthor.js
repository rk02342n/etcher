import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import Input from "./form/Input";

const EditAuthor = () => {
    const navigate = useNavigate();
    const { jwtToken } = useOutletContext();

    const [error, setError] = useState(null);
    const [errors, setErrors] = useState([]);

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    const [author, setAuthor] = useState({
        id: 0,
        name: "",
        email: "",
        // bio: ""
    })

    // get id from the url
    let {id} = useParams();

    useEffect(() => {
        if (jwtToken === ""){
            navigate("/login");
            return;
        }
    }, [jwtToken, navigate])

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    const handleChange = (event) => {
        let value = event.target.value;
        let name = event.target.name;
        setAuthor({
            ...author,
            [name]: value,
        })
    }


    return(
    <>
        <div className="text-left">
            <h2>Add/Edit Author</h2>
            <hr />
            <pre>{JSON.stringify(author, null, 3)}</pre>

            <form onSubmit={handleSubmit}>
                <input type="hidden" name="id" value={author.id} id="id"></input>
                <Input
                    title={"Name"}
                    name={"name"}
                    className={"form-control"}
                    type={"text"}
                    value={author.name}
                    onChange={handleChange}
                    errorDiv={hasError("name")? "text-danger" : "d-none"}
                    errorMsg={"Please enter name"}
                />

                <Input
                    title={"Email"}
                    name={"email"}
                    className={"form-control"}
                    type={"text"}
                    value={author.email}
                    onChange={handleChange}
                    errorDiv={hasError("email")? "text-danger" : "d-none"}
                    errorMsg={"Please enter an email"}
                />
                </form>
        </div>
    </>
    );
}

export default EditAuthor;