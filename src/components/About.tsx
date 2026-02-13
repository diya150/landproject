import { CheckCircle } from 'lucide-react';

const achievements = [
  'Over 10,000 satisfied customers worldwide',
  '99.9% uptime guaranteed',
  'Award-winning customer service',
  'Trusted by Fortune 500 companies',
];

export function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="order-2 md:order-1">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1590650589327-3f67c43ad8a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3NzA4MjQ3OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Building the Future Together
            </h2>
            <p className="text-lg text-gray-600">
              Since our founding, we've been committed to delivering innovative solutions 
              that empower businesses to reach their full potential. Our team of experts 
              combines deep industry knowledge with cutting-edge technology to create 
              products that truly make a difference.
            </p>
            <p className="text-lg text-gray-600">
              We believe in putting our customers first, continuously innovating, and 
              building long-lasting partnerships that drive mutual success.
            </p>

            {/* Achievements List */}
            <div className="space-y-3 pt-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
