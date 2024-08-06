import ChatWindow from "../components/ChatWindow.jsx";


function Home() {
    return (
        <div className="w-screen h-screen m-0 p-0 flex flex-col">
            <div className="w-full text-white bg-slate-700 p-4 space flex justify-around">
                <h1 className='text-4xl'>Chat de Alejandro</h1>
            </div>
            <div className='flex flex-row w-screen h-full'>
                <div className='w-1/3 bg-slate-300'>
                    <h1>Users</h1>
                </div>
                <div className='w-2/3 bg-slate-400'>
                    <ChatWindow/>
                </div>

            </div>
        </div>
    );
}

export default Home;
