import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import '../styles/profile.css'

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("Loading...");

  const [isEditing, setIsEditing] = useState(false);

  const [resumeFile, setResumeFile] = useState(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login to view your profile.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setMessage("");
      } else {
        setMessage(
          data.message || "Unable to load profile."
        );
      }
    } catch (error) {
      console.log(error);

      setMessage(
        "Something went wrong while loading your profile."
      );
    }
  }

  function handleEdit() {
    setName(user.name || "");
    setCollege(user.college || "");
    setBranch(user.branch || "");
    setYear(user.year || "");
    setSkills(
      user.skills
        ? user.skills.join(", ")
        : ""
    );
    setBio(user.bio || "");

    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  async function handleSave(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/profile",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: name,
            college: college,
            branch: branch,
            year: year,

            skills: skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(
                (skill) => skill !== ""
              ),

            bio: bio,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsEditing(false);
        setMessage("");

        alert("Profile updated successfully");

        localStorage.setItem(
          "user",
          JSON.stringify({
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
          })
        );
      } else {
        alert(
          data.message ||
          "Unable to update profile."
        );
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  async function handleResumeUpload() {
    if (!resumeFile) {
      alert("Please select a PDF resume");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append(
      "resume",
      resumeFile
    );

    setIsUploadingResume(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/profile/resume",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setResumeFile(null);

        alert(
          "Resume uploaded successfully"
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setIsUploadingResume(false);
    }
  }

  if (!user) {
    return (
      <div className="profile-loading">

        <div className="loading-spinner"></div>

        <p>
          {message}
        </p>

        {message.includes("login") && (
          <button
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </button>
        )}

      </div>
    );
  }

  const firstLetter =
    user.name
      ? user.name
          .charAt(0)
          .toUpperCase()
      : "U";

  const skillsList =
    user.skills || [];

  const completedFields = [
    user.name,
    user.email,
    user.college,
    user.branch,
    user.year,
    user.skills &&
      user.skills.length > 0,
    user.bio,
    user.resume,
  ].filter(Boolean).length;

  const totalFields = 8;

  const profileCompletion =
    Math.round(
      (completedFields / totalFields) *
        100
    );

  return (
    <div className="profile-page">

      <div className="profile-container">

        {/* Profile Header */}

        <div className="profile-header">

          <div className="profile-avatar">
            {firstLetter}
          </div>

          <div className="profile-header-info">

            <p className="profile-label">
              CampusConnect Profile
            </p>

            <h1>
              {user.name}
            </h1>

            <p className="profile-role">
              {user.role === "admin"
                ? "Administrator"
                : "Student"}
            </p>

          </div>

          <button
            className="edit-profile-button"
            onClick={handleEdit}
          >
            ✏️ Edit Profile
          </button>

        </div>


        {/* Profile Completion */}

        <div className="profile-completion">

          <div className="profile-completion-top">

            <div>

              <p className="profile-label">
                Profile Strength
              </p>

              <h2>
                {profileCompletion}% Complete
              </h2>

            </div>

            <div className="profile-completion-number">
              {profileCompletion}%
            </div>

          </div>

          <div className="profile-progress">

            <div
              className="profile-progress-bar"
              style={{
                width: `${profileCompletion}%`,
              }}
            ></div>

          </div>

          <p className="profile-completion-text">

            {profileCompletion === 100
              ? "Your profile is complete. Great job!"
              : "Complete your profile to present yourself better to recruiters."}

          </p>

        </div>


        {/* Edit Profile Form */}

        {isEditing && (

          <div className="profile-section edit-profile-section">

            <div className="profile-section-heading">

              <p className="profile-label">
                Profile Settings
              </p>

              <h2>
                Edit Profile
              </h2>

            </div>

            <form onSubmit={handleSave}>

              <div className="profile-form-grid">

                <div className="form-group">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    College
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your college"
                    value={college}
                    onChange={(e) =>
                      setCollege(
                        e.target.value
                      )
                    }
                  />

                </div>


                <div className="form-group">

                  <label>
                    Branch
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={branch}
                    onChange={(e) =>
                      setBranch(
                        e.target.value
                      )
                    }
                  />

                </div>


                <div className="form-group">

                  <label>
                    Year
                  </label>

                  <select
                    value={year}
                    onChange={(e) =>
                      setYear(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select year
                    </option>

                    <option value="1st Year">
                      1st Year
                    </option>

                    <option value="2nd Year">
                      2nd Year
                    </option>

                    <option value="3rd Year">
                      3rd Year
                    </option>

                    <option value="4th Year">
                      4th Year
                    </option>

                  </select>

                </div>

              </div>


              <div className="form-group">

                <label>
                  Skills
                </label>

                <input
                  type="text"
                  placeholder="C++, React, JavaScript, MongoDB"
                  value={skills}
                  onChange={(e) =>
                    setSkills(
                      e.target.value
                    )
                  }
                />

                <small>
                  Separate skills with commas.
                </small>

              </div>


              <div className="form-group">

                <label>
                  About Me
                </label>

                <textarea
                  placeholder="Tell recruiters a little about yourself..."
                  value={bio}
                  onChange={(e) =>
                    setBio(
                      e.target.value
                    )
                  }
                  rows="5"
                />

              </div>


              <div className="profile-form-buttons">

                <button type="submit">
                  Save Profile
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        )}


        {/* Basic Information */}

        <div className="profile-grid">

          <div className="profile-card">

            <div className="profile-card-icon">
              ✉️
            </div>

            <div>

              <p className="profile-card-label">
                Email Address
              </p>

              <h3>
                {user.email}
              </h3>

            </div>

          </div>


          <div className="profile-card">

            <div className="profile-card-icon">
              🎓
            </div>

            <div>

              <p className="profile-card-label">
                College
              </p>

              <h3>
                {user.college ||
                  "Not added yet"}
              </h3>

            </div>

          </div>


          <div className="profile-card">

            <div className="profile-card-icon">
              💻
            </div>

            <div>

              <p className="profile-card-label">
                Branch
              </p>

              <h3>
                {user.branch ||
                  "Not added yet"}
              </h3>

            </div>

          </div>


          <div className="profile-card">

            <div className="profile-card-icon">
              📅
            </div>

            <div>

              <p className="profile-card-label">
                Year
              </p>

              <h3>
                {user.year ||
                  "Not added yet"}
              </h3>

            </div>

          </div>

        </div>


        {/* About */}

        <div className="profile-section">

          <div className="profile-section-heading">

            <p className="profile-label">
              About
            </p>

            <h2>
              About Me
            </h2>

          </div>

          <p className="profile-bio">

            {user.bio ||
              "Add a short introduction about yourself from the Edit Profile section."}

          </p>

        </div>


        {/* Skills */}

        <div className="profile-section">

          <div className="profile-section-heading">

            <p className="profile-label">
              Professional Skills
            </p>

            <h2>
              Skills
            </h2>

          </div>


          {skillsList.length > 0 ? (

            <div className="skills-list">

              {skillsList.map(
                (skill, index) => (

                  <span
                    className="skill-badge"
                    key={index}
                  >
                    {skill}
                  </span>

                )
              )}

            </div>

          ) : (

            <p className="empty-profile-text">
              No skills added yet.
            </p>

          )}

        </div>


        {/* Resume */}

        <div className="profile-section resume-section">

          <div className="resume-icon">
            📄
          </div>

          <div>

            <p className="profile-label">
              Career Document
            </p>

            <h2>
              Resume
            </h2>


            {user.resume ? (

              <div className="resume-uploaded">

                <p>
                  ✓ Your resume has been uploaded.
                </p>

                <a
                  href={`http://localhost:5000${user.resume}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Resume →
                </a>

              </div>

            ) : (

              <p className="empty-profile-text">
                No resume uploaded yet.
              </p>

            )}


            <div className="resume-upload-form">

              <input
                type="file"
                accept="application/pdf"
                onChange={(event) => {
                  setResumeFile(
                    event.target.files[0]
                  );
                }}
              />

              <button
                type="button"
                onClick={handleResumeUpload}
                disabled={
                  isUploadingResume
                }
              >
                {isUploadingResume
                  ? "Uploading..."
                  : "Upload Resume"}
              </button>

            </div>


            {resumeFile && (

              <div className="selected-resume">

                <span>
                  📎 {resumeFile.name}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setResumeFile(null)
                  }
                >
                  Remove
                </button>

              </div>

            )}

            <p className="resume-note">
              PDF format only. Maximum file size: 5 MB.
            </p>

          </div>

        </div>


        {/* Career Tip */}

        <div className="profile-tip">

          <div className="profile-tip-icon">
            🚀
          </div>

          <div>

            <h3>
              Build your career with CampusConnect
            </h3>

            <p>
              Keep your profile updated so you can
              present your skills and experience when
              applying for internships.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;