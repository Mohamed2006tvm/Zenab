import Navbar from './Navbar';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-[#0a0f1e]">
            <Navbar />
            <main className="pt-16 min-h-screen">
                {children}
            </main>
        </div>
    );
}
