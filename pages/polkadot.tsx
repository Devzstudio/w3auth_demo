import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';

const DotConnect = dynamic(() => import('components/dot/Connect'), { ssr: false });

function App() {
	return (
		<div className="App">
			<DotConnect />
		</div>
	);
}

export default App;
