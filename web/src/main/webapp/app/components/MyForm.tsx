import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface ImageStade {
  id: string;
  picture: string;
  pictureContentType: string;
}

interface Stade {
  id: string;
  stade: string;
  description: string;
  imageStades: ImageStade[];
}

interface MaladieData {
  id: string;
  fullName: string;
  abbr: string;
  stades: Stade[];
}

const MyForm: React.FC = () => {
  const [maladieData, setMaladieData] = useState<MaladieData>({
    id: '1',
    fullName: '',
    abbr: '',
    stades: [
      {
        id: '2',
        stade: '',
        description: '',
        imageStades: [
          { id: '3', picture: '', pictureContentType: 'image/jpeg' },
          { id: '6', picture: '', pictureContentType: 'image/png' },
        ],
      },
    ],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMaladieData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleStadeChange = (index: number, field: string, value: string) => {
    setMaladieData(prevData => {
      const newStades = [...prevData.stades];
      newStades[index] = { ...newStades[index], [field]: value };
      return { ...prevData, stades: newStades };
    });
  };

  const handleStadeImageChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setMaladieData(prevData => {
        const newStades = [...prevData.stades];
        newStades[index].imageStades = [
          ...newStades[index].imageStades,
          { id: Date.now().toString(), picture: reader.result as string, pictureContentType: file.type },
        ];
        return { ...prevData, stades: newStades };
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    axios
      .post('/api/maladies/save', { maladie: maladieData })
      .then(response => {
        console.log('Success:', response.data);
        // Traitez la réponse du backend si nécessaire
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nom complet de la maladie:
        <input type="text" name="fullName" value={maladieData.fullName} onChange={handleChange} />
      </label>

      {maladieData.stades.map((stade, index) => (
        <div key={stade.id}>
          <label>
            Stade:
            <input type="text" name="stade" value={stade.stade} onChange={e => handleStadeChange(index, 'stade', e.target.value)} />
          </label>

          <input type="file" accept="image/*" onChange={e => handleStadeImageChange(index, e)} />

          {/* Ajoutez d'autres champs pour les données d'imageStades */}
        </div>
      ))}

      <button type="submit">Envoyer</button>
    </form>
  );
};

export default MyForm;
