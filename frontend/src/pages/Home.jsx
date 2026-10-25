import { Link } from "react-router";
import '../styles/home.css'

function Home() {
  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-tag">Your Career Starts Here</p>

            <h1>
              Find Internships.
              <br />
              Build Your Future.
            </h1>

            <p className="hero-description">
              Discover internships, develop your skills, and connect with
              opportunities that can shape your career.
            </p>

            <div className="hero-buttons">
              <Link to="/internships">
                <button>Explore Internships</button>
              </Link>

              <Link to="/register">
                <button className="secondary-button">Create Account</button>
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <img src="/images/hero.jpg" alt="Students working together" />
          </div>
        </div>
      </section>

      <section className="internships">
        <h2>Start Your Career Journey</h2>

        <p>
          CampusConnect helps students discover opportunities and take the next
          step toward their careers.
        </p>

        <div className="cards">
          <div className="card">
            <h3>🔎 Discover</h3>

            <p>
              Find internships that match your skills, interests, and career
              goals.
            </p>
          </div>

          <div className="card">
            <h3>🚀 Apply</h3>

            <p>
              Apply to opportunities directly and track your applications
              easily.
            </p>
          </div>

          <div className="card">
            <h3>💼 Grow</h3>

            <p>
              Gain real-world experience and build the skills needed for your
              career.
            </p>
          </div>
        </div>

        <div className="home-stats">
          <div className="home-stat">
            <h3>1k+</h3>
            <p>Internship Opportunities</p>
          </div>

          <div className="home-stat">
            <h3>500+</h3>
            <p>Hiring Companies</p>
          </div>

          <div className="home-stat">
            <h3>50k+</h3>
            <p>Students Connected</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
