export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gold-400 mb-4">About Deshawn</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Multi-domain expertise combining technology, athletics, and music
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Bio Content */}
            <div className="space-y-6">
              <div className="prose prose-lg">
                <p className="text-gray-300 leading-relaxed">
                  With a unique blend of technical expertise and creative passion, I bring{" "}
                  <strong className="text-gold-400">15+ years of piano experience</strong> and{" "}
                  <strong className="text-gold-400">3+ years of programming</strong> to every project. My
                  journey spans Computer Science studies at Virginia State University and a competitive NCAA
                  Division I basketball background.
                </p>

                <p className="text-gray-300 leading-relaxed">
                  This diverse foundation has instilled unmatched work ethic, discipline, and the ability to
                  excel across multiple domains—from building cutting-edge web applications to delivering
                  exceptional musical performances.
                </p>
              </div>

              {/* Skills */}
              <div className="grid sm:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-6 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl">
                  <i className="fas fa-code text-3xl text-blue-400 mb-3"></i>
                  <h4 className="font-semibold text-white">Web Development</h4>
                  <p className="text-sm text-gray-300 mt-2">3+ Years</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl">
                  <i className="fas fa-robot text-3xl text-gold-400 mb-3"></i>
                  <h4 className="font-semibold text-white">AI Implementation</h4>
                  <p className="text-sm text-gray-300 mt-2">Specialist</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl">
                  <i className="fas fa-music text-3xl text-purple-400 mb-3"></i>
                  <h4 className="font-semibold text-white">Piano Performance</h4>
                  <p className="text-sm text-gray-300 mt-2">15+ Years</p>
                </div>
              </div>
            </div>

            {/* Education Timeline */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-600 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gold-400 mb-8 text-center">Education Journey</h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-4 h-4 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-white">Virginia State University</h4>
                    <p className="text-gray-300">Computer Science Studies</p>
                    <p className="text-sm text-gray-400">Current Focus</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-4 h-4 bg-gold-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-white">Gardner-Webb University</h4>
                    <p className="text-gray-300">NCAA Division I Basketball</p>
                    <p className="text-sm text-gray-400">Athletic Excellence</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-4 h-4 bg-purple-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-white">American University</h4>
                    <p className="text-gray-300">Academic Foundation</p>
                    <p className="text-sm text-gray-400">Early Development</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
