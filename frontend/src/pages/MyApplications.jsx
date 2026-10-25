import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import '../styles/applications.css'

function MyApplications() {

  const navigate = useNavigate()

  const [applications, setApplications] = useState([])

  const [message, setMessage] = useState(
    'Loading applications...'
  )

  useEffect(() => {

    async function getApplications() {

      const token = localStorage.getItem('token')

      if (!token) {

        setMessage(
          'Please login to view your applications.'
        )

        return

      }

      try {

        const response = await fetch(
          'https://campusconnect-api-cyc3.onrender.com/api/applications',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const data = await response.json()

        if (response.ok) {

          setApplications(data)
          setMessage('')

        } else {

          setMessage(
            data.message ||
            'Unable to load your applications.'
          )

        }

      } catch (error) {

        console.log(error)

        setMessage(
          'Unable to load your applications.'
        )

      }

    }

    getApplications()

  }, [])

  function getStatusClass(status) {

    if (status === 'Accepted') {
      return 'student-application-status accepted'
    }

    if (status === 'Rejected') {
      return 'student-application-status rejected'
    }

    return 'student-application-status pending'

  }

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status === 'Pending'
    ).length

  const acceptedApplications =
    applications.filter(
      (application) =>
        application.status === 'Accepted'
    ).length

  const rejectedApplications =
    applications.filter(
      (application) =>
        application.status === 'Rejected'
    ).length

  return (

    <div className="student-applications-page">

      <div className="student-applications-container">

        <div className="student-applications-header">

          <div>

            <p className="student-applications-label">
              CampusConnect
            </p>

            <h1>
              My Applications
            </h1>

            <p>
              Track your internship applications and
              stay updated on their progress.
            </p>

          </div>

          <div className="student-applications-header-icon">
            📋
          </div>

        </div>


        {!message && (

          <div className="student-applications-summary">

            <div className="application-summary-item">

              <span>
                Total Applications
              </span>

              <strong>
                {applications.length}
              </strong>

            </div>

            <div className="application-summary-item">

              <span>
                Pending
              </span>

              <strong>
                {pendingApplications}
              </strong>

            </div>

            <div className="application-summary-item">

              <span>
                Accepted
              </span>

              <strong>
                {acceptedApplications}
              </strong>

            </div>

            <div className="application-summary-item">

              <span>
                Rejected
              </span>

              <strong>
                {rejectedApplications}
              </strong>

            </div>

          </div>

        )}


        {message && (

          <div className="student-applications-message">

            <div className="student-applications-loading-icon">
              ⏳
            </div>

            <p>
              {message}
            </p>

            {message.includes('login') && (

              <button
                onClick={() => navigate('/login')}
              >
                Login
              </button>

            )}

          </div>

        )}


        {!message && applications.length === 0 && (

          <div className="student-applications-empty">

            <div className="student-applications-empty-icon">
              📭
            </div>

            <h2>
              No Applications Yet
            </h2>

            <p>
              You haven't applied for any internships yet.
              Explore available opportunities and start
              building your career.
            </p>

            <button
              onClick={() => navigate('/internships')}
            >
              Explore Internships
            </button>

          </div>

        )}


        {!message && applications.length > 0 && (

          <div className="student-applications-list">

            {applications.map((application) => (

              <div
                className="student-application-card"
                key={application._id}
              >

                <div className="student-application-top">

                  <div className="student-application-icon">
                    💼
                  </div>

                  <div className="student-application-title">

                    <p>
                      Internship Opportunity
                    </p>

                    {application.internship ? (

                      <h2>
                        {application.internship.title}
                      </h2>

                    ) : (

                      <h2>
                        Internship no longer available
                      </h2>

                    )}

                  </div>

                  <span
                    className={
                      getStatusClass(
                        application.status
                      )
                    }
                  >
                    {application.status}
                  </span>

                </div>


                <div className="student-application-divider"></div>


                {application.internship ? (

                  <>

                    <div className="student-application-details">

                      <div className="student-application-detail">

                        <div className="student-detail-icon">
                          🏢
                        </div>

                        <div>

                          <p>
                            Company
                          </p>

                          <strong>
                            {application.internship.company}
                          </strong>

                        </div>

                      </div>


                      <div className="student-application-detail">

                        <div className="student-detail-icon">
                          📍
                        </div>

                        <div>

                          <p>
                            Location
                          </p>

                          <strong>
                            {application.internship.location}
                          </strong>

                        </div>

                      </div>


                      <div className="student-application-detail">

                        <div className="student-detail-icon">
                          📅
                        </div>

                        <div>

                          <p>
                            Applied On
                          </p>

                          <strong>
                            {new Date(
                              application.appliedAt
                            ).toLocaleDateString()}
                          </strong>

                        </div>

                      </div>

                    </div>


                    <div className="student-application-view">

                      <button
                        onClick={() =>
                          navigate(
                            `/internships/${application.internship._id}`
                          )
                        }
                      >
                        View Internship
                        <span>
                          →
                        </span>
                      </button>

                    </div>

                  </>

                ) : (

                  <div className="student-application-unavailable">

                    <span>
                      ⚠️
                    </span>

                    <p>
                      This internship is no longer
                      available.
                    </p>

                  </div>

                )}


                <div className="student-application-status-message">

                  {application.status === 'Pending' && (

                    <>

                      <span>
                        ⏳
                      </span>

                      <p>
                        Your application is currently
                        being reviewed by the employer.
                      </p>

                    </>

                  )}


                  {application.status === 'Accepted' && (

                    <>

                      <span>
                        🎉
                      </span>

                      <p>
                        Congratulations! Your application
                        has been accepted.
                      </p>

                    </>

                  )}


                  {application.status === 'Rejected' && (

                    <>

                      <span>
                        💡
                      </span>

                      <p>
                        This application was not selected.
                        Keep applying to new opportunities.
                      </p>

                    </>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  )
}

export default MyApplications