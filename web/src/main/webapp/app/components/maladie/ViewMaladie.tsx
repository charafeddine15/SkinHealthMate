import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Button from '@mui/material/Button';

interface Maladie {
  fullName: string;
}

function ViewMaladie() {
  const [data, setData] = useState<Maladie | {}>({});
  const [stades, setStades] = useState([]);
  const [images, setImages] = useState([]);
  const [indice, setIndice] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const getData = async () => {
    try {
      const response = await axios.get('/api/maladies/657e35b5ec6f675d97326594');
      setData(response.data.maladie);
      setStades(response.data.stades);
      const stadeImages = response.data.stades.map(e => e.imageStades);
      setImages(stadeImages);
    } catch (error) {
      console.error(error);
    }
  };

  const showImages = () => {
    console.log(images[0]);
  };

  const changeIndice = i => {
    setIndice(i);
  };

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    getData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentImages = images && images[0] && images[indice].slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>View Maladie</h1>

      {Object.keys(data).length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <Button variant="contained" color="primary" onClick={() => showImages()}>
            Show Data
          </Button>
          <p>Full Name: {'fullName' in data ? data.fullName : 'no data'}</p>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        {stades.map((e, index) => (
          <Button key={index} variant="outlined" onClick={() => changeIndice(index)}>
            {e.stade}
          </Button>
        ))}
      </div>

      <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {currentImages &&
          currentImages.map(item => (
            <ImageListItem key={item.picture}>
              <img
                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                src={`data:image/jpeg;base64,${item.picture}`}
                alt={item.id}
                loading="lazy"
              />
            </ImageListItem>
          ))}
      </ImageList>

      {/* Pagination */}
      <div>
        {images && images[0] && images[indice].length > itemsPerPage && (
          <div>
            {Array.from({ length: Math.ceil(images[indice].length / itemsPerPage) }).map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index + 1 ? 'contained' : 'outlined'}
                onClick={() => handlePageChange(index + 1)}
                style={{ margin: '5px' }}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewMaladie;
