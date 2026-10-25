import { useEffect, useState } from "react";
import AdminInternships from "./AdminInternships";
import AdminApplications from "./AdminApplications";

function AdminDashboard() {

  const [activeSection, setActiveSection] = useState("create");

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInternships: 0,
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [lastRefreshed, setLastRefreshed] =
    useState(null);


  async function refreshStats() {

    const token = localStorage.getItem("token");

    setIsRefreshing(true);

    try {

      const response = await fetch(
        "http://localhost:5000/api/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {

        setStats(data);

        setLastRefreshed(
          new Date()
        );

      } else {

        console.log(data.message);

      }

    } catch (error) {

      console.log(error);

    } finally {

      setIsRefreshing(false);

    }
  }


  useEffect(() => {

    refreshStats();

  }, []);


  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [stipend, setStipend] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");


  async function handleSubmit(e) {

    e.preventDefault();

    const token = localStorage.getItem("token");

    try {

      const response = await fetch(
        "http://localhost:5000/api/internships",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: title,
            company: company,
            location: location,
            duration: duration,
            stipend: stipend,
            skills: skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(
                (skill) => skill !== ""
              ),
            description: description,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert(
          "Internship created successfully"
        );

        refreshStats();

        setTitle("");
        setCompany("");
        setLocation("");
        setDuration("");
        setStipend("");
        setSkills("");
        setDescription("");

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


  function getLastRefreshedText() {

    if (!lastRefreshed) {
      return "Not refreshed yet";
    }

    return (
      "Last refreshed at " +
      lastRefreshed.toLocaleTimeString()
    );

  }


  return (

    <div className="admin-page">

      <div className="admin-container">


        {/* Dashboard Header */}

        <div className="admin-header">

          <div>

            <p className="admin-label">
              CampusConnect Administration
            </p>

            <h1>
              Admin Dashboard
            </h1>

            <p className="admin-description">
              Manage internships, students, and
              applications from one place.
            </p>

          </div>


          <div className="admin-header-actions">

            <div className="admin-header-icon">
              ⚙️
            </div>

            <button
              className="admin-refresh-button"
              onClick={refreshStats}
              disabled={isRefreshing}
            >
              {isRefreshing
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>

          </div>

        </div>


        <p className="admin-last-refreshed">
          {getLastRefreshedText()}
        </p>


        {/* Statistics */}

        <div className="admin-stats">

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              👨‍🎓
            </div>

            <div>

              <p>
                Total Students
              </p>

              <h2>
                {stats.totalStudents}
              </h2>

            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              💼
            </div>

            <div>

              <p>
                Total Internships
              </p>

              <h2>
                {stats.totalInternships}
              </h2>

            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              📋
            </div>

            <div>

              <p>
                Total Applications
              </p>

              <h2>
                {stats.totalApplications}
              </h2>

            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              ⏳
            </div>

            <div>

              <p>
                Pending
              </p>

              <h2>
                {stats.pendingApplications}
              </h2>

            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              ✅
            </div>

            <div>

              <p>
                Accepted
              </p>

              <h2>
                {stats.acceptedApplications}
              </h2>

            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              ❌
            </div>

            <div>

              <p>
                Rejected
              </p>

              <h2>
                {stats.rejectedApplications}
              </h2>

            </div>

          </div>

        </div>


        {/* Application Chart */}

        <div className="admin-chart-card">

          <div className="admin-chart-header">

            <div>

              <p className="admin-chart-label">
                Application Overview
              </p>

              <h2>
                Application Status
              </h2>

              <p className="admin-chart-description">
                Current distribution of student
                internship applications.
              </p>

            </div>

            <div className="admin-chart-icon">
              📊
            </div>

          </div>


          <div className="admin-chart">

            <div className="admin-chart-item">

              <div className="admin-chart-bar-container">

                <div
                  className="admin-chart-bar pending-bar"
                  style={{
                    height: `${
                      stats.totalApplications > 0
                        ? (
                            stats.pendingApplications /
                            stats.totalApplications
                          ) * 100
                        : 0
                    }%`,
                  }}
                >

                  <span>
                    {stats.pendingApplications}
                  </span>

                </div>

              </div>

              <p>
                Pending
              </p>

            </div>


            <div className="admin-chart-item">

              <div className="admin-chart-bar-container">

                <div
                  className="admin-chart-bar accepted-bar"
                  style={{
                    height: `${
                      stats.totalApplications > 0
                        ? (
                            stats.acceptedApplications /
                            stats.totalApplications
                          ) * 100
                        : 0
                    }%`,
                  }}
                >

                  <span>
                    {stats.acceptedApplications}
                  </span>

                </div>

              </div>

              <p>
                Accepted
              </p>

            </div>


            <div className="admin-chart-item">

              <div className="admin-chart-bar-container">

                <div
                  className="admin-chart-bar rejected-bar"
                  style={{
                    height: `${
                      stats.totalApplications > 0
                        ? (
                            stats.rejectedApplications /
                            stats.totalApplications
                          ) * 100
                        : 0
                    }%`,
                  }}
                >

                  <span>
                    {stats.rejectedApplications}
                  </span>

                </div>

              </div>

              <p>
                Rejected
              </p>

            </div>

          </div>

        </div>


        {/* Admin Actions */}

        <div className="admin-actions">

          <button
            className={
              activeSection === "create"
                ? "admin-action active"
                : "admin-action"
            }
            onClick={() =>
              setActiveSection("create")
            }
          >

            <span className="admin-action-icon">
              ➕
            </span>

            <div>

              <h3>
                Create Internship
              </h3>

              <p>
                Add a new opportunity
              </p>

            </div>

          </button>


          <button
            className={
              activeSection === "internships"
                ? "admin-action active"
                : "admin-action"
            }
            onClick={() =>
              setActiveSection("internships")
            }
          >

            <span className="admin-action-icon">
              💼
            </span>

            <div>

              <h3>
                Manage Internships
              </h3>

              <p>
                Edit or remove internships
              </p>

            </div>

          </button>


          <button
            className={
              activeSection === "applications"
                ? "admin-action active"
                : "admin-action"
            }
            onClick={() =>
              setActiveSection("applications")
            }
          >

            <span className="admin-action-icon">
              📋
            </span>

            <div>

              <h3>
                Manage Applications
              </h3>

              <p>
                Review student applications
              </p>

            </div>

          </button>

        </div>


        {/* Create Internship */}

        {activeSection === "create" && (

          <div className="admin-form-section">

            <div className="admin-section-heading">

              <div>

                <p className="admin-label">
                  Internship Management
                </p>

                <h2>
                  Create New Internship
                </h2>

                <p>
                  Add the details of the internship
                  opportunity you want students
                  to discover.
                </p>

              </div>

              <div className="admin-section-icon">
                🚀
              </div>

            </div>


            <form onSubmit={handleSubmit}>

              <div className="admin-form-grid">


                <div className="form-group">

                  <label>
                    Internship Title
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. React Developer Intern"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
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
                    placeholder="e.g. Tech Solutions"
                    value={company}
                    onChange={(e) =>
                      setCompany(e.target.value)
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
                    placeholder="e.g. Remote"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
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
                    placeholder="e.g. 3 Months"
                    value={duration}
                    onChange={(e) =>
                      setDuration(e.target.value)
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
                    placeholder="e.g. ₹15,000/month"
                    value={stipend}
                    onChange={(e) =>
                      setStipend(e.target.value)
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
                    placeholder="React, Node.js, MongoDB"
                    value={skills}
                    onChange={(e) =>
                      setSkills(e.target.value)
                    }
                    required
                  />

                  <small>
                    Separate skills with commas.
                  </small>

                </div>

              </div>


              <div className="form-group">

                <label>
                  Internship Description
                </label>

                <textarea
                  placeholder="Describe the internship, responsibilities, and requirements..."
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  rows="6"
                  required
                />

              </div>


              <div className="admin-form-footer">

                <p>
                  Make sure all internship details
                  are accurate before publishing.
                </p>

                <button type="submit">
                  🚀 Create Internship
                </button>

              </div>

            </form>

          </div>

        )}


        {/* Manage Internships */}

        {activeSection === "internships" && (

          <AdminInternships
            onStatsChange={refreshStats}
          />

        )}


        {/* Manage Applications */}

        {activeSection === "applications" && (

          <AdminApplications
            onStatsChange={refreshStats}
          />

        )}

      </div>

    </div>

  );
}

export default AdminDashboard;