const ErrorPage = () => {
    return (
        <>
            <div className="flex flex-col sm:flex-row w-full h-full">
                <div className="absolute sm:relative bottom-0 left-0 right-0">
                    Teste 2
                </div>
                <main className="flex justify-center items-center h-screen">
                    <div className="w-64 bg-gray-200 p-6">
                        Ops algo deu errado!
                    </div>
                </main>
            </div>
        </>
    );
};

export default ErrorPage;
