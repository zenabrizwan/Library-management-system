import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../../components/common/BookCard'; // Assuming your BookCard component path

const AnalyticsPage = () => {
    const [trendingBooks, setTrendingBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrendingBooks = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/trending-books');
                setTrendingBooks(response.data); // The backend sends an array of { title, author, key }
                setLoading(false);
                setError(null);
            } catch (err) {
                setError('Failed to fetch trending books.');
                setLoading(false);
                console.error('Error fetching trending books:', err);
            }
        };

        fetchTrendingBooks();
    }, []);

    if (loading) {
        return <div>Loading trending books...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="analytics-page">
            <h2>Trending Books</h2>
            <div className="book-grid">
            {trendingBooks.map((book) => (
  <BookCard
    key={book.key}
    book={{
      name: book.title,
      author: book.author,
      category: 'Trending',
      coverUrl: book.coverUrl, // Pass the cover URL
      genre: book.genre,       // Pass the genre
    }}
  />
))}
            </div>
            {/* ... rest of your component ... */}
        </div>
    );
};

export default AnalyticsPage;