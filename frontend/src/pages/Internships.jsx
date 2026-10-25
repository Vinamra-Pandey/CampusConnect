import { useEffect, useState } from "react";
import InternshipCard from "../components/InternshipCard";
import '../styles/internships.css'

function Internships() {
  const [internships, setInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");

  useEffect(() => {
    async function getInternships() {
      try {
        const response = await fetch("http://localhost:5000/api/internships");

        const data = await response.json();

        setInternships(data);
      } catch (error) {
        console.log(error);
      }
    }

    getInternships();
  }, []);

  function isWebTechnology(internship) {
    const text = (
      internship.title +
      " " +
      internship.skills.join(" ")
    ).toLowerCase();

    return (
      text.includes("react") ||
      text.includes("frontend") ||
      text.includes("front end") ||
      text.includes("web") ||
      text.includes("javascript") ||
      text.includes("html") ||
      text.includes("css")
    );
  }

  function isDataScience(internship) {
    const text = (
      internship.title +
      " " +
      internship.skills.join(" ")
    ).toLowerCase();

    return (
      text.includes("data") ||
      text.includes("machine learning") ||
      text.includes("ml") ||
      text.includes("ai") ||
      text.includes("artificial intelligence") ||
      text.includes("python")
    );
  }

  function isUIUX(internship) {
    const text = (
      internship.title +
      " " +
      internship.skills.join(" ")
    ).toLowerCase();

    return (
      text.includes("ui") ||
      text.includes("ux") ||
      text.includes("design") ||
      text.includes("figma")
    );
  }

  const search = searchTerm.toLowerCase().trim();

  const locations = [
    ...new Set(internships.map((internship) => internship.location)),
  ];

  const filteredInternships = internships.filter((internship) => {
    const text = (
      internship.title +
      " " +
      internship.company +
      " " +
      internship.location +
      " " +
      internship.skills.join(" ") +
      " " +
      internship.description
    ).toLowerCase();

    const matchesSearch = search === "" || text.includes(search);

    const matchesLocation =
      locationFilter === "All" || internship.location === locationFilter;

    return matchesSearch && matchesLocation;
  });

  const webTechnologyInternships = filteredInternships.filter(isWebTechnology);

  const dataScienceInternships = filteredInternships.filter(isDataScience);

  const uiuxInternships = filteredInternships.filter(isUIUX);

  return (
    <div className="internships">
      <h1>Internships</h1>

      <p>Browse available internship opportunities.</p>

      <div className="internship-search">
        <span>🔍</span>

        <input
          type="text"
          placeholder="Search internships, companies, skills, or locations..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="internship-filters">
        <div className="location-filter">
          <label>📍 Location</label>

          <select
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
          >
            <option value="All">All Locations</option>

            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <button
          className="clear-filters-button"
          onClick={() => {
            setSearchTerm("");
            setLocationFilter("All");
          }}
        >
          ✕ Clear Filters
        </button>
      </div>

      <section className="internship-category">
        <h2>🌐 Web Technology</h2>

        <p>
          Explore opportunities in web development, frontend technologies, and
          modern web applications.
        </p>

        {webTechnologyInternships.length > 0 ? (
          <div className="cards">
            {webTechnologyInternships.map((internship) => (
              <InternshipCard
                key={internship._id}
                id={internship._id}
                title={internship.title}
                company={internship.company}
                location={internship.location}
                duration={internship.duration}
                stipend={internship.stipend}
                skills={internship.skills}
                description={internship.description}
              />
            ))}
          </div>
        ) : (
          <p>No Web Technology internships available.</p>
        )}
      </section>

      <section className="internship-category">
        <h2>📊 Data Science</h2>

        <p>
          Discover opportunities in data analysis, machine learning, artificial
          intelligence, and data-driven technologies.
        </p>

        {dataScienceInternships.length > 0 ? (
          <div className="cards">
            {dataScienceInternships.map((internship) => (
              <InternshipCard
                key={internship._id}
                id={internship._id}
                title={internship.title}
                company={internship.company}
                location={internship.location}
                duration={internship.duration}
                stipend={internship.stipend}
                skills={internship.skills}
                description={internship.description}
              />
            ))}
          </div>
        ) : (
          <p>No Data Science internships available.</p>
        )}
      </section>

      <section className="internship-category">
        <h2>🎨 UI/UX Design</h2>

        <p>
          Explore creative opportunities in user interface, user experience,
          product design, and Figma.
        </p>

        {uiuxInternships.length > 0 ? (
          <div className="cards">
            {uiuxInternships.map((internship) => (
              <InternshipCard
                key={internship._id}
                id={internship._id}
                title={internship.title}
                company={internship.company}
                location={internship.location}
                duration={internship.duration}
                stipend={internship.stipend}
                skills={internship.skills}
                description={internship.description}
              />
            ))}
          </div>
        ) : (
          <p>No UI/UX internships available.</p>
        )}
      </section>
    </div>
  );
}

export default Internships;
