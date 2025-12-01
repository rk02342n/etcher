import { useState } from "react";
import { useOutletContext } from "react-router";
import TextArea from "./form/TextArea";
import Input from "./form/Input";
import axios from "axios";
import { PinataSDK } from 'pinata'

const SERVER_URL = 'http://localhost:8787'
const GATEWAY_URL = 'fuchsia-improved-albatross-322.mypinata.cloud'

const dummyAuthorAddress = 'xyzxyzxyzxyz';

const pinata = new PinataSDK({
    pinataJwt: "",
    pinataGateway: GATEWAY_URL
  })

const EditPost = () => {
    
    const [errors, setErrors] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('')
    const [link, setLink] = useState('')

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    const [post, setPost] = useState({
        title: "",
        author_id: "",
        content: "",
    })

    const handleUpload = async () => {
        if (!post) return
        const file = new File([post.content], post.title, { type: "text/plain" });
        try {
          setUploadStatus('Getting upload URL...')
          const urlResponse = await fetch(`${SERVER_URL}/presigned_url`, {
            method: "GET",
            headers: {
              // Handle your own server authorization here
            }
          })
          const data = await urlResponse.json()
    
          setUploadStatus('Uploading file...')
    
          const upload = await pinata.upload.public
            .file(file)
            .url(data.url)
            .keyvalues({
                author_address: dummyAuthorAddress
            })
    
          if (upload.cid) {
            setUploadStatus('File uploaded successfully!')
            const ipfsLink = await pinata.gateways.public.convert(upload.cid)
            setLink(ipfsLink)
          } else {
            setUploadStatus('Upload failed')
          }
        } catch (error) {
          setUploadStatus(`Error: ${error instanceof Error ? error.message : String(error)}`)
        }
      }

    // get author id from the url
    // let {id} = useParams();

    const handleSubmit = async (event) => {
        event.preventDefault();
        handleUpload();

        /* 
        FastAPI -> PostgresQL POST Request

        const postData = {
            title: post.title,
            author_id: post.author_id,
            content: post.content,
          };
        axios.post(`/api/v1/posts`, postData)
            .then(response => {
                console.log('Success:', response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        */

        setPost({
            title: "",
            author_id: "",
            content: "",
        });
    }

    const handleChange = (event) => {
        let value = event.target.value;
        let name = event.target.name;
        setPost({
            ...post,
            [name]: value,
        })
    }

    return(
    <>
        <div className="text-left">
            <h2>Add/Edit Post</h2>
            <hr />
            <pre>{JSON.stringify(post, null, 3)}</pre>
            {uploadStatus && <p className="uploadStatus">{uploadStatus}</p>}
            <form onSubmit={handleSubmit}>
                {/* <input type="hidden" name="id" value={author.id} id="id"></input> */}
                <Input
                    title={"Title"}
                    name={"title"}
                    className={"form-control"}
                    type={"text"}
                    value={post.title}
                    onChange={handleChange}
                    errorDiv={hasError("title")? "text-danger" : "d-none"}
                    errorMsg={"Please enter a title"}
                />

                <Input
                    title={"Author ID"}
                    name={"author_id"}
                    className={"form-control"}
                    type={"text"}
                    value={post.author_id}
                    onChange={handleChange}
                    errorDiv={hasError("author_id")? "text-danger" : "d-none"}
                    errorMsg={"Please enter an author ID"}
                />

                <TextArea
                    title="Content"
                    name={"content"}
                    value={post.content}
                    rows={"5"}
                    onChange={handleChange}
                    errorDiv={hasError("content")? "text-danger" : "d-none"}
                    errorMsg={"Please enter content"}
                />
                <button type="submit" onClick={handleSubmit}>Submit</button>
                </form>
        </div>
    </>
    );
}

export default EditPost;