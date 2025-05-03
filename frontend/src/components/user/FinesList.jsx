import React from 'react';

const FinesList = ({ fines }) => {
  return (
    <div className="fines-list">
      <h3>Fines</h3>
      {fines.length === 0 ? (
        <p>No outstanding fines.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {fines.map((fine) => (
              <tr key={fine.id}>
                <td>{fine.bookTitle}</td>
                <td>${fine.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FinesList;