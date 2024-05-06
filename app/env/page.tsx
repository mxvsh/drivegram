import React from 'react';

import { env } from '#/lib/env';

function Env() {
  return (
    <div className="space-y-4 p-4">
      <div>
        <h1>envalid</h1>
        <pre>{JSON.stringify(env, null, 2)}</pre>
      </div>
      <div>
        <h1>process.env</h1>
        <pre>
          {JSON.stringify(process.env, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default Env;
