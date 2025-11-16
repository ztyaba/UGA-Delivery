import { useState } from 'react';

function App () {
  const [message] = useState('Uganda Food Delivery Platform');

  return (
    <div className="app-shell">
      <header>
        <h1>{message}</h1>
        <p>Stage 1 setup complete. Future stages will bring full functionality.</p>
      </header>
      <section>
        <p>
          Backend base API is reachable at <code>/api/health</code>. Frontend routing and detailed pages
          will be implemented in later stages.
        </p>
      </section>
    </div>
  );
}

export default App;
