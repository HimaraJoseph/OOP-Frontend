import React, { useState, useEffect } from 'react';
import './App.css';
import TicketDisplay from './components/ticketDisplay';
import ConfigurationForm from './components/configurationForm';
import ControlPanel from './components/controlPanel';
import LogDisplay from './components/logDisplay';

const App = () => {
  const [availableTickets, setAvailableTickets] = useState(0);
  const [totalTicketsReleased, setTotalTicketsReleased] = useState(0);
  const [logs, setLogs] = useState([]);
  const [ticketConfig, setTicketConfig] = useState({
    totalTickets: '',
    ticketReleaseRate: '',
    customerRetrievalRate: '',
    maxTicketCapacity: '',
  });

  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning && availableTickets > 0) {
        setAvailableTickets((prevAvailableTickets) => prevAvailableTickets - 1);
        setTotalTicketsReleased((prevTotalTicketsReleased) => prevTotalTicketsReleased + 1);
        setLogs((prevLogs) => [
          ...prevLogs,
          `Customer bought 1 ticket. Available tickets: ${availableTickets - 1}`,
        ]);
      }
    }, ticketConfig.ticketReleaseRate || 1000); // Default to 1000 if not set

    return () => clearInterval(interval);
  }, [isRunning, availableTickets, ticketConfig.ticketReleaseRate]);

  const handleStart = () => {
    setIsRunning(true);
    setLogs((prevLogs) => [...prevLogs, 'System started']);
  };

  const handleStop = () => {
    setIsRunning(false);
    setLogs((prevLogs) => [...prevLogs, 'System stopped']);
  };

  const handleConfigSubmit = (newConfig) => {
    if (
      newConfig.totalTickets > 0 &&
      newConfig.ticketReleaseRate > 0 &&
      newConfig.customerRetrievalRate > 0 &&
      newConfig.maxTicketCapacity > 0
    ) {
      setTicketConfig(newConfig);
      setAvailableTickets(newConfig.totalTickets);
      setLogs((prevLogs) => [
        ...prevLogs,
        'New Configuration Applied:',
        `Total Tickets: ${newConfig.totalTickets}`,
        `Ticket Release Rate: ${newConfig.ticketReleaseRate} ms`,
        `Customer Retrieval Rate: ${newConfig.customerRetrievalRate} ms`,
        `Maximum Ticket Capacity: ${newConfig.maxTicketCapacity}`,
      ]);
    } else {
      alert('All values must be positive numbers.');
    }
  };

  const handleLoadPreviousConfig = () => {
    const previousConfig = {
      totalTickets: 10,
      ticketReleaseRate: 1200,
      customerRetrievalRate: 2500,
      maxTicketCapacity: 50,
    };

    // Set the configuration
    setTicketConfig(previousConfig);
    setAvailableTickets(previousConfig.totalTickets);
    
    // Add log messages for the loaded configuration
    setLogs((prevLogs) => [
      ...prevLogs,
      'Previous Configuration Loaded:',
      `Total Tickets: ${previousConfig.totalTickets}`,
      `Ticket Release Rate: ${previousConfig.ticketReleaseRate} ms`,
      `Customer Retrieval Rate: ${previousConfig.customerRetrievalRate} ms`,
      `Maximum Ticket Capacity: ${previousConfig.maxTicketCapacity}`,
    ]);
  };

  return (
    <div className="app-container">
      <TicketDisplay
        availableTickets={availableTickets}
        totalTicketsReleased={totalTicketsReleased}
        maxTicketCapacity={ticketConfig.maxTicketCapacity}
      />
      <ConfigurationForm
        onSubmit={handleConfigSubmit}
        onLoadPreviousConfig={handleLoadPreviousConfig}
      />
      <ControlPanel onStart={handleStart} onStop={handleStop} />
      <LogDisplay logs={logs} />
    </div>
  );
};

export default App;