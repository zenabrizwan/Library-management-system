import React from 'react';

const ReturnHistory = ({ history }) => {
  return (
    <div className="return-history">
      <h3>Return History</h3>
      {history.length === 0 ? (
        <p>No books returned yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Returned Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.bookTitle}</td>
                <td>{item.returnedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReturnHistory;