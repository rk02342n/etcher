import React, { useState } from 'react'
import { usePinata } from '../hooks/usePinata'
import { PinataSDK } from 'pinata';

const GATEWAY_URL = 'fuchsia-improved-albatross-322.mypinata.cloud'

const pinata = new PinataSDK({
  pinataJwt: "",
  pinataGateway: GATEWAY_URL
})

function Pinata() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [link, setLink] = useState('');
  const { url, fields, loading, error, refresh } = usePinata();


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setUploadStatus('Getting upload URL...')
      setUploadStatus('Uploading file...')

      const upload = await pinata.upload.public
        .file(file)
        .url(url)

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

  return (
    <>
      <h1>Pinata</h1>
      <div className="card">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!file}>
          Upload to Pinata
        </button>
        {uploadStatus && <p>{uploadStatus}</p>}
        {link && <a href={link} target='_blank'>View File</a>}
      </div>
    </>
  )
}

export default Pinata;
