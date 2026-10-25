import { useEffect, useState } from "react";

function AdminInternships({ onStatsChange }) {

  const [internships, setInternships] = useState([]);

  const [editingInternship, setEditingInternship] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [locationFilter, setLocationFilter] =
    useState("All");


  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [stipend, setStipend] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");


  async function getInternships() {

    try {

      const response = await fetch(
        "http://localhost:5000/api/internships"
      );

      const data = await response.json();

      if (response.ok) {
        setInternships(data);
      }

    } catch (error) {

      console.log(error);

    }

  }


  useEffect(() => {

    getInternships();

  }, []);


  function handleEdit(internship) {

    setEditingInternship(internship);

    setTitle(internship.title);
    setCompany(internship.company);
    setLocation(internship.location);
    setDuration(internship.duration);
    setStipend(internship.stipend);

    setSkills(
      internship.skills.join(", ")
    );

    setDescription(
      internship.description
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }


  function handleCancel() {

    setEditingInternship(null);

    setTitle("");
    setCompany("");
    setLocation("");
    setDuration("");
    setStipend("");
    setSkills("");
    setDescription("");

  }


  async function handleUpdate(event) {

    event.preventDefault();

    const token =
      localStorage.getItem("token");

    try {

      const response = await fetch(
        `http://localhost:5000/api/internships/${editingInternship._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({

            title,
            company,
            location,
            duration,
            stipend,

            skills: skills
              .split(",")
              .map((skill) =>
                skill.trim()
              )
              .filter(
                (skill) =>
                  skill !== ""
              ),

            description,

          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {

        alert(
          "Internship updated successfully"
        );

        handleCancel();

        getInternships();

        onStatsChange();

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.log(error);

      alert(
        "Something went wrong"
      );

    }

  }


  async function handleDelete(id) {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this internship?"
      );

    if (!confirmDelete) {
      return;
    }

    const token =
      localStorage.getItem("token");

    try {

      const response =
        await fetch(
          `http://localhost:5000/api/internships/${id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (response.ok) {

        alert(
          "Internship deleted successfully"
        );

        getInternships();

        onStatsChange();

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.log(error);

      alert(
        "Something went wrong"
      );

    }

  }


  const search =
    searchTerm
      .toLowerCase()
      .trim();


  const locations = [
    ...new Set(
      internships.map(
        (internship) =>
          internship.location
      )
    ),
  ];


  const filteredInternships =
    internships.filter(
      (internship) => {

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


        const matchesSearch =
          search === "" ||
          text.includes(search);


        const matchesLocation =
          locationFilter === "All" ||
          internship.location ===
            locationFilter;


        return (
          matchesSearch &&
          matchesLocation
        );

      }
    );


  function clearFilters() {

    setSearchTerm("");

    setLocationFilter("All");

  }


  return (

    <div className="admin-internships-section">


      {/* EDIT INTERNSHIP */}

      {editingInternship && (

        <div className="admin-form-section">

          <div className="admin-section-heading">

            <div>

              <p className="admin-label">
                Internship Management
              </p>

              <h2>
                Edit Internship
              </h2>

              <p>
                Update the internship details
                and save your changes.
              </p>

            </div>

            <div className="admin-section-icon">
              ✏️
            </div>

          </div>


          <form
            className="admin-form-grid"
            onSubmit={handleUpdate}
          >

            <div className="form-group">

              <label>
                Internship Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Company
              </label>

              <input
                type="text"
                value={company}
                onChange={(event) =>
                  setCompany(
                    event.target.value
                  )
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(event) =>
                  setLocation(
                    event.target.value
                  )
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Duration
              </label>

              <input
                type="text"
                value={duration}
                onChange={(event) =>
                  setDuration(
                    event.target.value
                  )
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Stipend
              </label>

              <input
                type="text"
                value={stipend}
                onChange={(event) =>
                  setStipend(
                    event.target.value
                  )
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Skills
              </label>

              <input
                type="text"
                value={skills}
                onChange={(event) =>
                  setSkills(
                    event.target.value
                  )
                }
                placeholder="React, JavaScript, HTML"
                required
              />

              <small>
                Separate skills with commas.
              </small>

            </div>


            <div className="form-group full-width">

              <label>
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                rows="5"
                required
              />

            </div>


            <div className="admin-edit-buttons">

              <button
                type="submit"
                className="admin-edit-button"
              >
                ✓ Save Changes
              </button>


              <button
                type="button"
                className="admin-cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}


      {/* INTERNSHIP LIST */}

      <div className="admin-list-section">

        <div className="admin-list-heading">

          <div>

            <p className="admin-section-label">
              Internship Management
            </p>

            <h2>
              Manage Internships
            </h2>

            <p className="admin-list-description">
              View, edit, search, and remove
              internship opportunities.
            </p>

          </div>


          <span className="admin-count">

            {filteredInternships.length}
            {" "}
            {filteredInternships.length === 1
              ? "Internship"
              : "Internships"}

          </span>

        </div>


        {/* SEARCH AND FILTERS */}

        <div className="admin-internship-filters">

          <div className="admin-internship-search">

            <span className="admin-search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search internships, companies, skills..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

            {searchTerm && (

              <button
                type="button"
                className="admin-search-clear"
                onClick={() =>
                  setSearchTerm("")
                }
                aria-label="Clear search"
              >
                ×
              </button>

            )}

          </div>


          <div className="admin-location-filter">

            <label>
              📍 Location
            </label>

            <select
              value={locationFilter}
              onChange={(event) =>
                setLocationFilter(
                  event.target.value
                )
              }
            >

              <option value="All">
                All Locations
              </option>

              {locations.map(
                (location) => (

                  <option
                    key={location}
                    value={location}
                  >
                    {location}
                  </option>

                )
              )}

            </select>

          </div>


          <button
            className="admin-clear-filters"
            onClick={clearFilters}
            type="button"
          >
            ✕ Clear
          </button>

        </div>


        {internships.length === 0 ? (

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              📭
            </div>

            <h3>
              No Internships Available
            </h3>

            <p>
              Create an internship from
              the Create Internship section.
            </p>

          </div>

        ) : filteredInternships.length === 0 ? (

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              🔍
            </div>

            <h3>
              No Matching Internships
            </h3>

            <p>
              Try changing your search
              or location filter.
            </p>

            <button
              onClick={clearFilters}
              type="button"
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <div className="admin-internship-grid">

            {filteredInternships.map(
              (internship) => (

                <div
                  className="admin-internship-card"
                  key={internship._id}
                >

                  <div className="admin-internship-image">

                    <img
                      src="/images/internship.jpg"
                      alt="Internship"
                    />

                  </div>


                  <div className="admin-internship-content">

                    <p className="admin-internship-label">
                      Internship Opportunity
                    </p>

                    <h3>
                      {internship.title}
                    </h3>

                    <p className="admin-company">
                      🏢 {internship.company}
                    </p>


                    <div className="admin-internship-details">

                      <span>
                        📍 {internship.location}
                      </span>

                      <span>
                        ⏱️ {internship.duration}
                      </span>

                      <span>
                        💰 {internship.stipend}
                      </span>

                    </div>


                    <div className="admin-skills">

                      {internship.skills.map(
                        (skill, index) => (

                          <span
                            key={index}
                          >
                            {skill}
                          </span>

                        )
                      )}

                    </div>


                    <p className="admin-internship-description">
                      {internship.description}
                    </p>


                    <div className="admin-card-actions">

                      <button
                        className="admin-edit-button"
                        onClick={() =>
                          handleEdit(
                            internship
                          )
                        }
                        type="button"
                      >
                        ✏️ Edit
                      </button>


                      <button
                        className="admin-delete-button"
                        onClick={() =>
                          handleDelete(
                            internship._id
                          )
                        }
                        type="button"
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );
}

export default AdminInternships;