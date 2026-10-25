import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import '../styles/internshipDetails.css'

function InternshipDetails() {

  const { id } = useParams()

  const navigate = useNavigate()

  const [internship, setInternship] = useState(null)

  const [message, setMessage] = useState('')

  const [applicationMessage, setApplicationMessage] = useState('')

  const [isApplying, setIsApplying] = useState(false)

  const [hasApplied, setHasApplied] = useState(false)


  useEffect(() => {

    async function getInternship() {

      try {

        const response = await fetch(
          `http://localhost:5000/api/internships/${id}`
        )

        const data = await response.json()

        if (response.ok) {

          setInternship(data)

        } else {

          setMessage(
            data.message || 'Unable to load internship details.'
          )

        }

      } catch (error) {

        console.log(error)

        setMessage(
          'Unable to load internship details.'
        )

      }

    }

    getInternship()

  }, [id])


  async function handleApply() {

    const token = localStorage.getItem('token')

    if (!token) {

      alert('Please login to apply')

      navigate('/login')

      return

    }

    if (hasApplied) {
      return
    }

    setIsApplying(true)

    setApplicationMessage('')

    try {

      const response = await fetch(
        'http://localhost:5000/api/applications',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            internshipId: id
          })
        }
      )

      const data = await response.json()

      if (response.ok) {

        setHasApplied(true)

        setApplicationMessage(
          'Application submitted successfully!'
        )

      } else {

        if (
          data.message &&
          data.message.toLowerCase().includes('already')
        ) {

          setHasApplied(true)

          setApplicationMessage(
            'You have already applied for this internship.'
          )

        } else {

          setApplicationMessage(
            data.message || 'Unable to submit application.'
          )

        }

      }

    } catch (error) {

      console.log(error)

      setApplicationMessage(
        'Something went wrong. Please try again.'
      )

    } finally {

      setIsApplying(false)

    }

  }


  function getInternshipImage() {

    const text = (
      internship.title +
      ' ' +
      internship.skills.join(' ')
    ).toLowerCase()


    if (
      text.includes('react') ||
      text.includes('frontend') ||
      text.includes('front end') ||
      text.includes('web') ||
      text.includes('javascript') ||
      text.includes('html') ||
      text.includes('css')
    ) {

      return '/images/web-development.jpg'

    }


    if (
      text.includes('data') ||
      text.includes('machine learning') ||
      text.includes('ml') ||
      text.includes('ai') ||
      text.includes('artificial intelligence') ||
      text.includes('python')
    ) {

      return '/images/data-science.jpg'

    }


    if (
      text.includes('ui') ||
      text.includes('ux') ||
      text.includes('design') ||
      text.includes('figma')
    ) {

      return '/images/ui-ux.jpg'

    }


    return '/images/internship.jpg'

  }


  if (message) {

    return (

      <div className="internship-details-message">

        <div className="internship-details-message-icon">
          ⚠️
        </div>

        <h2>
          Something went wrong
        </h2>

        <p>
          {message}
        </p>

        <button
          onClick={() => navigate('/internships')}
        >
          Back to Internships
        </button>

      </div>

    )

  }


  if (!internship) {

    return (

      <div className="internship-details-loading">

        <div className="internship-loading-icon">
          ⏳
        </div>

        <h2>
          Loading Internship...
        </h2>

        <p>
          Please wait while we load the internship details.
        </p>

      </div>

    )

  }


  return (

    <div className="internship-details-page">

      <div className="internship-details-container">

        <button
          className="internship-back-button"
          onClick={() => navigate('/internships')}
        >
          ← Back to Internships
        </button>


        <section className="internship-details-hero">

          <div className="internship-details-hero-image">

            <img
              src={getInternshipImage()}
              alt={`${internship.title} internship`}
            />

          </div>


          <div className="internship-details-hero-content">

            <p className="internship-details-label">
              Internship Opportunity
            </p>

            <h1>
              {internship.title}
            </h1>

            <p className="internship-details-company">
              🏢 {internship.company}
            </p>

            <p className="internship-details-intro">
              Explore this internship opportunity,
              develop your skills, and gain valuable
              real-world experience.
            </p>

          </div>

        </section>


        <div className="internship-details-layout">


          <main className="internship-details-main">


            <section className="internship-info-card">

              <div className="internship-section-heading">

                <div className="internship-section-icon">
                  📋
                </div>

                <div>

                  <p>
                    Internship Details
                  </p>

                  <h2>
                    Opportunity Overview
                  </h2>

                </div>

              </div>


              <div className="internship-info-grid">


                <div className="internship-info-item">

                  <div className="internship-info-icon">
                    📍
                  </div>

                  <div>

                    <span>
                      Location
                    </span>

                    <strong>
                      {internship.location}
                    </strong>

                  </div>

                </div>


                <div className="internship-info-item">

                  <div className="internship-info-icon">
                    ⏱️
                  </div>

                  <div>

                    <span>
                      Duration
                    </span>

                    <strong>
                      {internship.duration}
                    </strong>

                  </div>

                </div>


                <div className="internship-info-item">

                  <div className="internship-info-icon">
                    💰
                  </div>

                  <div>

                    <span>
                      Stipend
                    </span>

                    <strong>
                      {internship.stipend}
                    </strong>

                  </div>

                </div>


                <div className="internship-info-item">

                  <div className="internship-info-icon">
                    🏢
                  </div>

                  <div>

                    <span>
                      Company
                    </span>

                    <strong>
                      {internship.company}
                    </strong>

                  </div>

                </div>


              </div>

            </section>


            <section className="internship-description-card">

              <div className="internship-section-heading">

                <div className="internship-section-icon">
                  📄
                </div>

                <div>

                  <p>
                    About The Internship
                  </p>

                  <h2>
                    Internship Description
                  </h2>

                </div>

              </div>


              <p className="internship-description-text">
                {internship.description}
              </p>

            </section>


            <section className="internship-skills-card">

              <div className="internship-section-heading">

                <div className="internship-section-icon">
                  🛠️
                </div>

                <div>

                  <p>
                    Skills
                  </p>

                  <h2>
                    Skills Required
                  </h2>

                </div>

              </div>


              <div className="internship-skills-list">

                {internship.skills.map(
                  (skill, index) => (

                    <span
                      className="internship-skill"
                      key={index}
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            </section>


            <section className="internship-why-card">

              <div className="internship-section-heading">

                <div className="internship-section-icon">
                  ✨
                </div>

                <div>

                  <p>
                    Career Growth
                  </p>

                  <h2>
                    Why Apply?
                  </h2>

                </div>

              </div>


              <div className="internship-benefits">


                <div className="internship-benefit">

                  <span>
                    ✓
                  </span>

                  <p>
                    Gain valuable real-world experience.
                  </p>

                </div>


                <div className="internship-benefit">

                  <span>
                    ✓
                  </span>

                  <p>
                    Develop practical industry skills.
                  </p>

                </div>


                <div className="internship-benefit">

                  <span>
                    ✓
                  </span>

                  <p>
                    Strengthen your resume and portfolio.
                  </p>

                </div>


                <div className="internship-benefit">

                  <span>
                    ✓
                  </span>

                  <p>
                    Move one step closer to your career goals.
                  </p>

                </div>


              </div>

            </section>


          </main>


          <aside className="internship-apply-card">

            <div className="internship-apply-icon">
              🚀
            </div>

            <p className="internship-apply-label">
              Ready to Apply?
            </p>

            <h2>
              Take the Next Step
            </h2>

            <p>
              Apply for this internship and start
              building your professional experience.
            </p>


            <button
              className="internship-apply-button"
              onClick={handleApply}
              disabled={isApplying || hasApplied}
            >

              {isApplying
                ? 'Applying...'
                : hasApplied
                  ? 'Application Submitted ✓'
                  : 'Apply Now'
              }


              {!isApplying && !hasApplied && (

                <span>
                  →
                </span>

              )}

            </button>


            {applicationMessage && (

              <p className="application-message">
                {applicationMessage}
              </p>

            )}


            <div className="internship-apply-note">
              🔒 Your application is securely submitted
              through CampusConnect.
            </div>

          </aside>


        </div>

      </div>

    </div>

  )

}

export default InternshipDetails