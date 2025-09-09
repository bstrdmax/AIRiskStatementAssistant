import React from 'react';
import { TargetIcon } from './IconComponents';

const Header: React.FC = () => {
  return (
    <header className="text-center">
        <div className="flex items-center justify-center mb-4">
            <TargetIcon className="h-12 w-12 text-purple-500" />
        </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-500">
        AI Risk Statement Assistant
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
        Turn a worry into a clear risk statement. This tool uses AI to ask "Why?" five times to find the real problem.
      </p>
    </header>
  );
};

export default Header;