import React, { useState, useEffect } from 'react';
import './configurationForm.css';

const ConfigurationForm = ({ onSubmit, onLoadPreviousConfig }) => {
  const [formData, setFormData] = useState({
    totalTickets: '',
    ticketReleaseRate: '',
    customerRetrievalRate: '',
    maxTicketCapacity: '',
  });

  const [errors, setErrors] = useState({
    totalTickets: '',
    ticketReleaseRate: '',
    customerRetrievalRate: '',
    maxTicketCapacity: '',
  });

  const [previousConfig, setPreviousConfig] = useState(null);

  useEffect(() => {
    // Load previous configuration from localStorage
    const savedConfig = localStorage.getItem('simulationConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setPreviousConfig(parsedConfig);
      } catch (error) {
        console.error('Error parsing saved configuration', error);
      }
    }
  }, []);

  const validateInput = (name, value) => {
    // Remove any leading zeros
    const trimmedValue = value.replace(/^0+/, '');

    // Check for valid positive integer
    const numValue = parseInt(trimmedValue, 10);

    // Validation conditions
    const isValidInput = 
      trimmedValue !== '' && 
      !isNaN(numValue) && 
      numValue > 0 && 
      /^\d+$/.test(trimmedValue);

    if (!isValidInput) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} must be a positive whole number without special characters.`,
      }));
      return false;
    }

    // Specific validation for maximum ticket capacity
    if (name === 'maxTicketCapacity') {
      const totalTickets = parseInt(formData.totalTickets || '0', 10);
      if (numValue <= totalTickets) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Maximum ticket capacity must be greater than total tickets.',
        }));
        return false;
      }
    }

    // Clear any existing error for this field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate input
    validateInput(name, value);
  };

  const handleLoadPreviousConfig = () => {
    if (previousConfig) {
      // Convert previousConfig values to strings for input
      const loadedConfig = {
        totalTickets: previousConfig.totalTickets.toString(),
        ticketReleaseRate: previousConfig.ticketReleaseRate.toString(),
        customerRetrievalRate: previousConfig.customerRetrievalRate.toString(),
        maxTicketCapacity: previousConfig.maxTicketCapacity.toString(),
      };

      setFormData(loadedConfig);

      // Clear any previous errors
      setErrors({
        totalTickets: '',
        ticketReleaseRate: '',
        customerRetrievalRate: '',
        maxTicketCapacity: '',
      });

      // Call the prop function to handle external loading logic
      onLoadPreviousConfig({
        totalTickets: loadedConfig.totalTickets,
        ticketReleaseRate: `${loadedConfig.ticketReleaseRate} ms`,
        customerRetrievalRate: `${loadedConfig.customerRetrievalRate} ms`,
        maxTicketCapacity: loadedConfig.maxTicketCapacity,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const isValid = Object.keys(formData).every((key) => 
      validateInput(key, formData[key])
    );

    if (isValid) {
      // Convert values to integers before submission
      const processedFormData = Object.keys(formData).reduce((acc, key) => {
        acc[key] = parseInt(formData[key], 10);
        return acc;
      }, {});

      // Save to localStorage
      localStorage.setItem('simulationConfig', JSON.stringify(processedFormData));

      onSubmit(processedFormData);
    }
  };

  return (
    <div className="configuration">
      <form className="configuration-form" onSubmit={handleSubmit}>
        <h3>Ticket Configuration</h3>

        {['totalTickets', 'ticketReleaseRate', 'customerRetrievalRate', 'maxTicketCapacity'].map((field) => (
          <div key={field} className="form-field">
            <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
            />
            {errors[field] && <p className="error-message">{errors[field]}</p>}
          </div>
        ))}

        <div className="button-container">
          <button type="submit" className="submit-button">
            Submit
          </button>
          <button 
            type="button" 
            className="load-config-button" 
            onClick={handleLoadPreviousConfig}
            disabled={!previousConfig}
          >
            Load Previous Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigurationForm;