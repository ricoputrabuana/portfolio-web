export default function Contact() {
  return (
    <section
      id="contact"
      className="relative bg-[#0b0515]/90 text-white py-24 px-6 text-center z-10"
    >
      <h2 className="text-4xl font-bold mb-6 text-purple-300">Contact</h2>
      <p className="text-lg mb-8 text-gray-300">
        Let’s connect — feel free to reach out for collaborations or just say hi!
      </p>
      <div className="space-x-6">
        <a
          href="mailto:yourname@email.com"
          className="text-purple-300 hover:text-purple-400 underline"
        >
          Email
        </a>
        <a
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-300 hover:text-purple-400 underline"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-300 hover:text-purple-400 underline"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
