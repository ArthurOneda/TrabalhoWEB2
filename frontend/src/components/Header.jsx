// src/components/Header.jsx
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CV Builder
            </h1>
          </div>

          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => navigate("/")}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                🏠 Home
              </button>
              <button
                onClick={() => navigate("/criar-curriculo")}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                ✏️ Criar Currículo
              </button>
              <button
                onClick={() => navigate("/visualizar-curriculos")}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                📋 Meus Currículos
              </button>
            </div>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => {
                const menu = document.querySelector('.mobile-menu');
                menu?.classList.toggle('hidden');
              }}
              className="text-gray-700 hover:text-blue-600 inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mobile-menu hidden md:hidden pb-4">
          <div className="px-2 pt-2 space-y-1">
            <button
              onClick={() => {
                navigate("/");
                document.querySelector('.mobile-menu')?.classList.add('hidden');
              }}
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              🏠 Home
            </button>
            <button
              onClick={() => {
                navigate("/criar-curriculo");
                document.querySelector('.mobile-menu')?.classList.add('hidden');
              }}
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              ✏️ Criar Currículo
            </button>
            <button
              onClick={() => {
                navigate("/visualizar-curriculos");
                document.querySelector('.mobile-menu')?.classList.add('hidden');
              }}
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              📋 Meus Currículos
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;