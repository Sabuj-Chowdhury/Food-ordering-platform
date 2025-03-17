const Contact = () => {
  return (
    <section
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-6 py-12 text-white"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <div className="bg-[#121212]/80 p-10 rounded-lg shadow-lg w-full max-w-3xl text-center">
        <h1 className="text-4xl font-bold font-[Playfair Display] text-[#FF4B2B] mb-6">
          Contact Us
        </h1>
        <p className="text-lg poppins mb-6">
          Have questions or need assistance? Reach out to us, and we’ll be happy
          to help!
        </p>

        <form className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 rounded bg-[#FAF3E0] text-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 rounded bg-[#FAF3E0] text-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]"
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            className="w-full p-3 rounded bg-[#FAF3E0] text-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]"
          ></textarea>
          <button className="w-full bg-[#FF4B2B] text-white py-3 rounded font-semibold hover:bg-[#FF6F3C] transition duration-300">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
