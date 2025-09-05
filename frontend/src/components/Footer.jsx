function Footer() {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CV Builder
              </h3>
              <p className="text-gray-400 mt-1">Crie currículos profissionais com facilidade</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;