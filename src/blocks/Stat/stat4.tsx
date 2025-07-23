import { Star } from 'lucide-react';
import { BiLogoPlayStore } from 'react-icons/bi';
import { FaApple } from 'react-icons/fa';
import { SiTrustpilot } from 'react-icons/si';

const Stat4 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col-reverse items-center justify-between gap-4 lg:flex-row">
          <p className="text-center text-lg font-medium lg:text-left lg:text-2xl">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestiae.
          </p>
          <div className="flex items-center gap-6 lg:gap-12">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-2xl font-medium">
                <span>4.8</span>
                <Star />
              </div>
              <div className="flex items-center gap-2">
                <FaApple className="lg:mr-1" />
                <span className="whitespace-nowrap text-xs lg:text-sm">
                  Apple Store
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-2xl font-medium">
                <span>4.8</span>
                <Star />
              </div>
              <div className="flex items-center gap-2">
                <BiLogoPlayStore className="lg:mr-1" />
                <span className="whitespace-nowrap text-xs lg:text-sm">
                  Play Store
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-2xl font-medium">
                <span>4.9</span>
                <Star />
              </div>
              <div className="flex items-center gap-2">
                <SiTrustpilot className="lg:mr-1" />
                <span className="whitespace-nowrap text-xs lg:text-sm">
                  Trustpilot
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stat4;
