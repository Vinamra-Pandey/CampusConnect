import { Link, useNavigate } from 'react-router'

function Navbar() {
  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  const user = JSON.parse(
    localStorage.getItem('user') || 'null'
  )

  const isAdmin = user?.role === 'admin'

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    navigate('/login')
  }

  return (
    <nav>
      <div className="navbar-brand">
        <Link to="/">
          CampusConnect
        </Link>
      </div>

      <div className="navbar-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/internships">
          Internships
        </Link>

        {token ? (
          <>
            <Link to="/profile">
              Profile
            </Link>

            {!isAdmin && (
              <Link to="/applications">
                My Applications
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin">
                Admin Dashboard
              </Link>
            )}

            <button
              className="navbar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}

      </div>
    </nav>
  )
}

export default Navbar