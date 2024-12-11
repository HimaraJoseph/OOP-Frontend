import React from 'react';
import './ticketDisplay.css';

const TicketDisplay = ({ availableTickets, totalTicketsReleased, maxTicketCapacity }) => {
  return (
    <div className="ticket-display">
      <div className="ticket-display-container">
        <h3>Ticket Availability</h3>
        <p>Available tickets: {availableTickets}</p>
        <p>Total tickets released so far: {availableTickets} out of {maxTicketCapacity}</p>
      </div>
    </div>
  );
};

export default TicketDisplay;


