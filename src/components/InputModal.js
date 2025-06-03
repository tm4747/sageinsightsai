import React, { useState } from 'react';

const InputModal = ({ isOpen, onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // todo: validate name
    if(name){
        onSubmit({ name, description });
        setName('');
        setDescription('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: isOpen ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      <div style={{
        backgroundColor: '#eee',
        padding: '2rem',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        color:'black'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Enter Details</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label>Name:</label><br />
          <input
            type="text"
            className={"text-input"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', backgroundColor:'white'}}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Description:</label><br />
          <textarea
            className={"text-input"}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', backgroundColor:'white' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className={"button red-button"} onClick={onClose} style={{ marginRight: '1rem', width:'50%' }}>Cancel</button>
          <button className={"button green-button"} onClick={handleSubmit} style={{ width:'50%' }}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default InputModal;
