import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import TextArea from "./form/TextArea";
import Input from "./form/Input";
import axios from "axios";
import { PinataSDK } from 'pinata'
import Dropdown from "./common/Dropdown";
import { useAuthors } from "../hooks/useAuthors";

const SERVER_URL = 'http://localhost:8787'
const GATEWAY_URL = 'fuchsia-improved-albatross-322.mypinata.cloud'
const ETCHER_API_URL = process.env.REACT_APP_API_URL


const dummyAuthorAddress = 'xyzxyzxyzxyz';

const pinata = new PinataSDK({
    pinataJwt: "",
    pinataGateway: GATEWAY_URL
  })

const EditPost = () => {
    
    const [errors, setErrors] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');
    const [link, setLink] = useState('');
    const { data: authors, loading, error} = useAuthors();
    const [authorOptions, setAuthorOptions] = useState([]);

    const [blurred, setBlurred] = useState({
      title: false,
      author_id: false,
      subtitle: false,
      content: false,
    });

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    const [post, setPost] = useState({
        title: "",
        author_id: "",
        subtitle: "",
        content: "",
    })

    const handleUpload = async (event) => {
      event.preventDefault();
        if (!post) return
        try {
          setUploadStatus('Getting upload URL...')
          const urlResponse = await fetch(`${SERVER_URL}/presigned_url`, {
            method: "GET"
          })
          const data = await urlResponse.json()
    
          setUploadStatus('Uploading file...')
    
          const file = new File([post.content], post.title, { type: "text/plain" });
          const upload = await pinata.upload.public.file(file).url(data.url);
    
          if (upload.cid) {
            setUploadStatus('File uploaded successfully!')
            handleSubmit(upload.cid)
            const ipfsLink = await pinata.gateways.public.convert(upload.cid)
            setLink(ipfsLink)
          } else {
            setUploadStatus('Upload failed')
          }
        } catch (error) {
          setUploadStatus(`Error: ${error instanceof Error ? error.message : String(error)}`)
        }
      }

    const handleSubmit = async (cid) => {
        const postData = {
            title: post.title,
            author_id: post.author_id,
            content: post.content,
            content_cid: cid,
            cover_image_url: 'https://picsum.photos/800',
            subtitle: post.subtitle,
          };
        await axios.post(`${ETCHER_API_URL}/api/v1/posts`, postData)
            .then(response => {
                console.log('Success:', response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        

        setPost({
            title: "",
            author_id: "",
            content: "",
        });
    }

    const handleChange = (event) => {
      console.log(blurred.content);
        let value = event.target.value;
        let name = event.target.name;
        setPost({
            ...post,
            [name]: value, // sanitize content text to not include special characters / white spaces
        })
    }

    useEffect(() => {
      setAuthorOptions(
        (authors ?? []).map(a => ({
          label: a.name,
          value: a.id,
        }))
      );
    }, [authors]);

    return(
    <>
        <div className="text-left">
            <h2>Add/Edit Post</h2>
            <hr />
            <pre>{JSON.stringify(post, null, 3)}</pre>
            <pre>{JSON.stringify(blurred, null, 3)}</pre>
            {uploadStatus && <p className="uploadStatus">{uploadStatus}</p>}
            {link && <a href={link} target='_blank'>View File</a>}
            {link && <hr/>}
            <form onSubmit={handleSubmit}>
                {/* <input type="hidden" name="id" value={author.id} id="id"></input> */}
                <Input
                    title={"Title"}
                    name={"title"}
                    className={"form-control"}
                    type={"text"}
                    value={post.title}
                    onChange={handleChange}
                    errorMsg={"Please enter a title"}
                    required
                    onBlur={() => setBlurred(prev => ({ ...prev, 'title': true }))}
                    isblurred={blurred.title}
                />

                <Input
                    title={"Subtitle"}
                    name={"subtitle"}
                    className={"form-control"}
                    type={"text"}
                    value={post.subtitle}
                    onChange={handleChange}
                />

                {/* <Input
                    title={"Author ID"}
                    name={"author_id"}
                    className={"form-control"}
                    type={"text"}
                    value={post.author_id}
                    onChange={handleChange}
                    errorDiv={hasError("author_id")? "text-danger" : "d-none"}
                    errorMsg={"Please enter an author ID"}
                /> */}

                <Dropdown
                  label="Author"
                  name={"author_id"}
                  options={authorOptions}
                  value={post.author_id}
                  onChange={(field, value) => setPost(post => ({ ...post, ['author_id']: value }))}
                  width="w-full"
                />

                <TextArea
                    title="Content"
                    name={"content"}
                    value={post.content}
                    rows={"5"}
                    onChange={handleChange}
                    errorDiv={hasError("content") ? "text-danger" : "d-none"}
                    errorMsg={"Please enter content"}
                    required
                    onBlur={() => setBlurred(prev => ({ ...prev, 'content': true }))}
                    isblurred={blurred.content}
                />
                <button type="submit" onClick={handleUpload}>Submit</button>
                </form>
        </div>
    </>
    );
}

export default EditPost;