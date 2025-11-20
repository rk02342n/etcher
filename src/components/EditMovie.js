//Refactor this file to work for movie dataset 

const EditMovie = () => {
    return(
        <div>Edit more movies?</div>
    )
}
    /*
    const navigate = useNavigate();
    const { jwtToken } = useOutletContext();

    const [error, setError] = useState(null);
    const [errors, setErrors] = useState([]);

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    const [movie, setMovie] = useState({
        id: 0,
        name: "",
        email: ""
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
        setmovie({
            ...movie,
            [name]: value,
        })
    }


    return(
    <>
        <div className="text-left">
            <h2>Add/Edit movie</h2>
            <hr />
            <pre>{JSON.stringify(movie, null, 3)}</pre>

            <form onSubmit={handleSubmit}>
                <input type="hidden" name="id" value={movie.id} id="id"></input>
                <Input
                    title={"Name"}
                    name={"name"}
                    className={"form-control"}
                    type={"text"}
                    value={movie.name}
                    onChange={handleChange}
                    errorDiv={hasError("name")? "text-danger" : "d-none"}
                    errorMsg={"Please enter name"}
                />

                <Input
                    title={"Email"}
                    name={"email"}
                    className={"form-control"}
                    type={"text"}
                    value={movie.email}
                    onChange={handleChange}
                    errorDiv={hasError("email")? "text-danger" : "d-none"}
                    errorMsg={"Please enter an email"}
                />

                <Input
                    title={"Name"}
                    name={"name"}
                    className={"form-control"}
                    type={"text"}
                    value={movie.name}
                    onChange={handleChange}
                    errorDiv={hasError("name")? "text-danger" : "d-none"}
                    errorMsg={"Please enter name"}
                />
                </form>
        </div>
    </>
    );
} 

*/

export default EditMovie;