import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import Cropper from 'react-easy-crop';
import '../App.css';

const Gallery = () => {
  const { user, logout } = useAuth0();
  const [file, setFile] = useState('');
  const [images, setImages] = useState([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropper, setShowCropper] = useState(false);
  const cropperRef = useRef(null);

  useEffect(() => {
    axios
      .get('http://localhost:4000/getImages')
      .then(res => setImages(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', file);

    axios
      .post('http://localhost:4000/upload', formData)
      .then(res => {
        console.log(res);
        setImages([...images, res.data.image]);
      })
      .catch(err => console.log(err));
  };

  const handleCrop = async () => {
    try {
      const croppedAreaPixels = await cropperRef.current.getCroppedAreaPixels();
      const croppedImageBlob = await cropperRef.current.crop(croppedAreaPixels).toBlob();

      const formData = new FormData();
      formData.append('file', croppedImageBlob);

      axios
        .post('http://localhost:4000/uploadWithCrop', formData)
        .then(res => {
          console.log(res);
          setImages([...images, res.data.image]);
        })
        .catch(err => console.log(err));

      setShowCropper(false);
    } catch (error) {
      console.error('Error handling crop:', error);
    }
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleCrop();
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-200">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => logout({ returnTo: window.location.origin })}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-col items-center mb-8">
        {!showCropper ? (
          <>
            <input type="file" onChange={handleChange} className="mb-4 p-2 border rounded-md" />
            <button
              onClick={() => setShowCropper(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-md mb-2"
            >
              Crop
            </button>
            <button
              onClick={handleUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Upload
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <button
                onClick={handleCrop}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
              >
                Crop and Save
              </button>
              <button
                onClick={() => setShowCropper(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
            <Cropper
              ref={cropperRef}
              image={URL.createObjectURL(file)}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              className="border rounded-md mb-4"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
       <img
       key={index}
       src={`http://localhost:4000/Images/${image.image}`}
       alt={`image-${index}`}
       className="object-fit cover rounded-lg h-48 w-full border border-gray-200 bg-gray-100"
     />
        ))}
      </div>
    </div>
  );
};

export default Gallery;

