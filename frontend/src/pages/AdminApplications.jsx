import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function AdminApplications({ onStatsChange }) {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmPosition, setConfirmPosition] = useState({
    top: 0,
    left: 0,
  });
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setSelectedStudent(null);
      }
    }

    if (selectedStudent) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedStudent]);

  function openConfirmation(event, id, status) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    const popupWidth = Math.min(340, window.innerWidth - 32);

    const popupHeight = 190;
    const gap = 10;
    const screenPadding = 16;

    let left = rect.left;

    if (left + popupWidth > window.innerWidth - screenPadding) {
      left = window.innerWidth - popupWidth - screenPadding;
    }

    if (left < screenPadding) {
      left = screenPadding;
    }

    let top = rect.bottom + gap;

    if (top + popupHeight > window.innerHeight - screenPadding) {
      top = rect.top - popupHeight - gap;
    }

    if (top < screenPadding) {
      top = rect.bottom + gap;
    }

    setConfirmPosition({
      top: top,
      left: left,
    });

    setConfirmAction({
      id: id,
      status: status,
    });
  }

  async function updateStatus(id, status) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/applications/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: status,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(`Application ${status.toLowerCase()} successfully.`);

        setApplications((currentApplications) =>
          currentApplications.map((application) =>
            application._id === id
              ? { ...application, status: status }
              : application,
          ),
        );

        onStatsChange();

        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    }
  }

  async function getApplications() {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setApplications(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getApplications();
  }, []);

  function getStatusClass(status) {
    if (status === "Accepted") {
      return "application-status accepted";
    }

    if (status === "Rejected") {
      return "application-status rejected";
    }

    return "application-status pending";
  }

  const filteredApplications =
    statusFilter === "All"
      ? applications
      : applications.filter(
          (application) => application.status === statusFilter,
        );

  return (
    <div className="admin-applications-section">
      <div className="applications-section">
        {message && (
          <div className="admin-application-message">✓ {message}</div>
        )}

        <div className="applications-heading">
          <div>
            <p className="admin-label">Student Applications</p>

            <h2>All Applications</h2>

            <p className="admin-section-description">
              Review and manage internship applications submitted by students.
            </p>
          </div>

          <div className="admin-count">
            {applications.length}{" "}
            {applications.length === 1 ? "Application" : "Applications"}
          </div>
        </div>

        <div className="application-status-filters">
          <button
            className={
              statusFilter === "All" ? "status-filter active" : "status-filter"
            }
            onClick={() => setStatusFilter("All")}
          >
            All
          </button>

          <button
            className={
              statusFilter === "Pending"
                ? "status-filter pending active"
                : "status-filter pending"
            }
            onClick={() => setStatusFilter("Pending")}
          >
            Pending
          </button>

          <button
            className={
              statusFilter === "Accepted"
                ? "status-filter accepted active"
                : "status-filter accepted"
            }
            onClick={() => setStatusFilter("Accepted")}
          >
            Accepted
          </button>

          <button
            className={
              statusFilter === "Rejected"
                ? "status-filter rejected active"
                : "status-filter rejected"
            }
            onClick={() => setStatusFilter("Rejected")}
          >
            Rejected
          </button>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">📭</div>

            <h3>No Applications Found</h3>

            <p>There are currently no applications matching this filter.</p>
          </div>
        ) : (
          <div className="applications-list">
            {filteredApplications.map((application) => (
              <div className="application-card" key={application._id}>
                <div className="application-card-header">
                  <div className="application-icon">👨‍🎓</div>

                  <div className="application-student">
                    <p className="application-label">Student</p>

                    {application.user ? (
                      <>
                        <h3>{application.user.name}</h3>

                        <p>{application.user.email}</p>
                      </>
                    ) : (
                      <h3>Student information unavailable</h3>
                    )}
                  </div>

                  <span className={getStatusClass(application.status)}>
                    {application.status}
                  </span>
                </div>

                <div className="application-divider"></div>

                <div className="application-details">
                  <div className="application-detail">
                    <span className="application-detail-icon">💼</span>

                    <div>
                      <p>Internship</p>

                      {application.internship ? (
                        <strong>{application.internship.title}</strong>
                      ) : (
                        <strong>Internship no longer available</strong>
                      )}
                    </div>
                  </div>

                  {application.internship && (
                    <>
                      <div className="application-detail">
                        <span className="application-detail-icon">🏢</span>

                        <div>
                          <p>Company</p>

                          <strong>{application.internship.company}</strong>
                        </div>
                      </div>

                      <div className="application-detail">
                        <span className="application-detail-icon">📍</span>

                        <div>
                          <p>Location</p>

                          <strong>{application.internship.location}</strong>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="application-detail">
                    <span className="application-detail-icon">📅</span>

                    <div>
                      <p>Applied On</p>

                      <strong>
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="application-actions">
                  {application.status === "Pending" && (
                    <>
                      <button
                        className="application-accept"
                        onClick={(event) =>
                          openConfirmation(event, application._id, "Accepted")
                        }
                      >
                        ✓ Accept
                      </button>

                      <button
                        className="application-reject"
                        onClick={(event) =>
                          openConfirmation(event, application._id, "Rejected")
                        }
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}

                  {application.status === "Accepted" && (
                    <div className="application-status-result accepted-result">
                      ✓ Application Accepted
                    </div>
                  )}

                  {application.status === "Rejected" && (
                    <div className="application-status-result rejected-result">
                      ✕ Application Rejected
                    </div>
                  )}
                  {application.user && (
                    <button
                      className="application-profile-button"
                      onClick={() => setSelectedStudent(application.user)}
                    >
                      👤 View Profile
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmAction &&
        createPortal(
          <div
            className="admin-confirm-box"
            style={{
              top: `${confirmPosition.top}px`,
              left: `${confirmPosition.left}px`,
            }}
          >
            <div className="admin-confirm-icon">
              {confirmAction.status === "Accepted" ? "✓" : "✕"}
            </div>

            <h3>Confirm Action</h3>

            <p>
              Are you sure you want to {confirmAction.status.toLowerCase()} this
              application?
            </p>

            <div className="admin-confirm-actions">
              <button
                className="admin-confirm-cancel"
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </button>

              <button
                className={
                  confirmAction.status === "Accepted"
                    ? "admin-confirm-accept"
                    : "admin-confirm-reject"
                }
                onClick={() => {
                  updateStatus(confirmAction.id, confirmAction.status);

                  setConfirmAction(null);
                }}
              >
                {confirmAction.status === "Accepted"
                  ? "Accept Application"
                  : "Reject Application"}
              </button>
            </div>
          </div>,

          document.body,
        )}
      {selectedStudent &&
        createPortal(
          <div
            className="admin-profile-overlay"
            onClick={() => setSelectedStudent(null)}
          >
            <div
              className="admin-profile-box"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="admin-profile-close"
                onClick={() => setSelectedStudent(null)}
              >
                ×
              </button>

              <div className="admin-profile-avatar">
                {selectedStudent.name
                  ? selectedStudent.name.charAt(0).toUpperCase()
                  : "?"}
              </div>

              <h2>{selectedStudent.name}</h2>

              <p className="admin-profile-email">{selectedStudent.email}</p>

              <div className="admin-profile-details">
                <div className="admin-profile-detail">
                  <span>College</span>
                  <strong>{selectedStudent.college || "Not provided"}</strong>
                </div>

                <div className="admin-profile-detail">
                  <span>Branch</span>
                  <strong>{selectedStudent.branch || "Not provided"}</strong>
                </div>

                <div className="admin-profile-detail">
                  <span>Year</span>
                  <strong>{selectedStudent.year || "Not provided"}</strong>
                </div>
              </div>

              <div className="admin-profile-section">
                <h3>Skills</h3>

                {selectedStudent.skills && selectedStudent.skills.length > 0 ? (
                  <div className="admin-profile-skills">
                    {selectedStudent.skills.map((skill, index) => (
                      <span key={index}>{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p>No skills added.</p>
                )}
              </div>

              <div className="admin-profile-section">
                <h3>About</h3>

                <p>{selectedStudent.bio || "No bio provided."}</p>
              </div>

              {selectedStudent.resume && (
                <a
                  className="admin-profile-resume"
                  href={`http://localhost:5000${selectedStudent.resume}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  📄 View Resume
                </a>
              )}
            </div>
          </div>,

          document.body,
        )}
    </div>
  );
}

export default AdminApplications;
