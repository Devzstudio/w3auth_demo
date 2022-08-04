import { useAuth } from 'context/auth.context';
import Connect from './Connect';

const ExampleSolCard = () => {
	const { auth } = useAuth();
	return (
		<div className="grid md:grid-cols-2 gap-5 pt-10 pb-5 border px-5">
			<div className="grid place-items-center">{/* <Connect /> */}</div>

			<div>
				<p className="text-gray-500 text-sm mb-2">Auth context</p>
				<pre className="border bg-gray-50 rounded p-5">{JSON.stringify(auth, null, 2)}</pre>
			</div>
		</div>
	);
};

export default ExampleSolCard;
