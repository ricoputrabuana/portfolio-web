export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-20 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold text-purple-300 tracking-wide">
          Rico<span className="text-pink-400"> Putra</span><span className="text-blue-400"> Buana</span>
        </h1>
        <ul className="flex space-x-6 text-gray-200 font-medium">
          {["Home", "About", "Projects", "Contact"].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="hover:text-purple-300 transition-colors duration-300"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
