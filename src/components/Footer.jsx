export default function Footer() {
  return (
    <footer className="relative bg-black/40 backdrop-blur-md text-gray-400 text-center py-6 z-10 border-t border-white/10">
      <p>
        © {new Date().getFullYear()}{" "}
        <span className="text-purple-300 font-medium">Rico Putra Buana</span>. 
        All rights reserved.
      </p>
    </footer>
  );
}
