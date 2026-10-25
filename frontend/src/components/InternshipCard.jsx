import { Link } from 'react-router'

function InternshipCard({
  id,
  title,
  company,
  location,
  duration,
  stipend,
  skills,
  description
}) {

  function getInternshipImage() {

    const text = (
      title + ' ' + skills.join(' ')
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


  return (

    <div className="card internship-card">

      <div className="internship-image">

        <img
          src={getInternshipImage()}
          alt={`${title} internship`}
        />

      </div>


      <div className="internship-content">

        <p className="internship-label">
          Internship Opportunity
        </p>


        <h3>
          {title}
        </h3>


        <p className="company-name">
          {company}
        </p>


        <p>
          📍 {location}
        </p>


        <p>
          ⏱️ {duration}
        </p>


        <p className="stipend">
          💰 {stipend}
        </p>


        <p>
          <strong>Skills:</strong>{' '}
          {skills.join(', ')}
        </p>


        <p className="description">
          {description}
        </p>


        <Link to={`/internships/${id}`}>

          <button>
            View Details
          </button>

        </Link>

      </div>

    </div>

  )
}

export default InternshipCard