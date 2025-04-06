import "./Pagination.css"

const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }) => {
  // Generate page numbers
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  // Go to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  // Go to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  // If there's only one page, don't render pagination
  if (totalPages <= 1) return null

  return (
    <div className={`pagination ${className}`}>
      <button className="pagination-button" onClick={goToPreviousPage} disabled={currentPage === 1}>
        &laquo;
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          className={`pagination-button ${currentPage === number ? "active" : ""}`}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}

      <button className="pagination-button" onClick={goToNextPage} disabled={currentPage === totalPages}>
        &raquo;
      </button>
    </div>
  )
}

export default Pagination

