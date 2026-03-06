import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-[#0a0f1e] flex flex-col">
            <Navbar />
            <main className="flex-1 pt-16">
                {children}
            </main>
            <Footer />
        </div>
    );
}
