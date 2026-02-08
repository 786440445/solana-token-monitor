import { useState } from 'react';

const TestCard = () => {
  return (
    <div style={{ 
      background: '#161b22',
      border: '1px solid #30363d',
      borderRadius: '12px',
      padding: '16px',
      margin: '20px auto',
      maxWidth: '300px',
      color: '#c9d1d9'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '12px' 
      }}>
        <span style={{ color: '#58a6ff', fontWeight: 'bold' }}>#1</span>
        <span style={{ color: '#8b949e' }}>SOL</span>
      </div>
      
      <h3 style={{ margin: '0 0 8px 0', color: '#c9d1d9' }}>Solana</h3>
      
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3fb950' }}>
        $100.50
      </div>
      
      <div style={{ color: '#3fb950', marginTop: '4px' }}>
        ↑ +5.20%
      </div>
    </div>
  );
};

const TestPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0d1117', 
      padding: '40px' 
    }}>
      <h1 style={{ color: '#58a6ff', textAlign: 'center' }}>
        🚀 Token Card Test
      </h1>
      
      <TestCard />
      <TestCard />
    </div>
  );
};

export default TestPage;
