import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';

interface Superhero {
  _id: string;
  name: string;
  superpower: string;
  humilityScore: number;
}

const Superheroes: React.FC = () => {
  const [superheroes, setSuperheroes] = useState<Superhero[]>([]);
  const [name, setName] = useState('');
  const [superpower, setSuperpower] = useState('');
  const [humilityScore, setHumilityScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadHeroesFromServer = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(API_URL);
      setSuperheroes(response.data);
    } catch (err) {
      console.log(err);
      setError('Failed to fetch superheroes. Try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHeroesFromServer();
  }, [loadHeroesFromServer]);

  const addSuperhero = async () => {
    if (!name || !superpower) {
      setError('Name, superpower, and humility score are required. Don\'t forget to fill in all the fields! :)');
      return;
    }
    if (humilityScore < 1 || humilityScore > 10) {
      setError('Humility score must be between 1 and 10.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await axios.post(API_URL, { name, superpower, humilityScore });
      setName('');
      setSuperpower('');
      setHumilityScore(0);
      loadHeroesFromServer();
    } catch (err) {
      console.log(err);
      setError('Failed to add superhero.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🦸 Humble Superheroes</h1>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.formWrapper}>
        <input
          style={styles.input}
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          type="text"
          placeholder="Superpower"
          value={superpower}
          onChange={(e) => setSuperpower(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          min="1"
          max="10"
          value={humilityScore}
          onChange={(e) => setHumilityScore(Number(e.target.value))}
        />

        <button style={styles.button} onClick={addSuperhero} disabled={loading}>
          {loading ? 'Adding...' : 'Add Superhero'}
        </button>
      </div>

      {loading && <p style={styles.loading}>Loading superheroes...</p>}

      <ul style={styles.superheroList}>
        {superheroes.map((hero) => (
          <li key={hero._id} style={styles.superheroItem}>
            <h2 style={styles.heroName}>{hero.name}</h2>
            <p style={styles.heroDetail}>
              <strong>Power:</strong> {hero.superpower}
            </p>
            <p style={styles.heroDetail}>
              <strong>Humility:</strong> {hero.humilityScore}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  formWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '30px',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#ff4500',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  loading: {
    marginBottom: '20px',
    fontStyle: 'italic',
  },
  superheroList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  superheroItem: {
    marginBottom: '20px',
    backgroundColor: '#f2f2f2',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
    textAlign: 'left',
  },
  heroName: {
    margin: '0 0 10px 0',
    fontSize: '1.4rem',
    color: '#333',
  },
  heroDetail: {
    margin: 0,
    lineHeight: '1.5',
  },
};

export default Superheroes;
