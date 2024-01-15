function EmptyPlayer({ seat_no, className }) {
    return (
      <div>
        <h5 className={`player-container ${className}`}>Seat: {seat_no}</h5>
      </div>
    );
  }
  export default EmptyPlayer;