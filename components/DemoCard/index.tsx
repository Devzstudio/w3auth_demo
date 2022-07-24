const DemoCard = ({ symbol, details }) => {
	return (
		<div className="bg-gray-50 rounded-t p-5 border-t border-r border-l relative overflow-hidden ">
			<h3 className="text-xl font-medium">{symbol} Example</h3>
			<p className="text-gray-500 mt-5">{details}</p>
			<img
				className="w-32 h-32 absolute  right-0 top-0"
				style={{ right: '-21px' }}
				src={`https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@bea1a9722a8c63169dcc06e86182bf2c55a76bbc/svg/color/${symbol.toLowerCase()}.svg`}
			/>
		</div>
	);
};

export default DemoCard;