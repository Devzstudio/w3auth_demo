const Layout = ({ children }) => {
	return (
		<>
			<header className="mx-auto max-w-screen-xl md:px-4 sm:px-6 relative">
				<div className="flex justify-between items-center">
					<h4 className="text-xl font-medium p-5">w3auth Demo Integration</h4>
					<a
						href="https://w3auth.devzstudio.com/"
						target="_BLANK"
						rel="noreferrer noopener"
						className="text-gray-500 hover:text-gray-900"
					>
						Documentation
					</a>
				</div>
			</header>
			<main className="min-h-screen mx-auto max-w-screen-xl md:px-4 sm:px-6 relative">{children}</main>
		</>
	);
};

export default Layout;
