require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const upload = require('./middleware/uploadMiddleware')

const User = require('./models/User')
const Internship = require('./models/Internship')
const Application = require('./models/Application')
const authenticateToken = require('./middleware/authMiddleware')
const requireAdmin = require('./middleware/adminMiddleware')

const app = express()

app.use(cors())
app.use(express.json())
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully')
  })
  .catch((error) => {
    console.log('MongoDB connection failed')
    console.log(error)
  })

app.get('/', (req, res) => {
  res.json({
    message: 'CampusConnect backend is running'
  })
})

app.post('/api/register', async (req, res) => {

  const { name, email, password } = req.body

  try {

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword
    })

    await user.save()

    res.json({
      message: 'Registration successful'
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: 'Registration failed'
    })

  }
})

app.post('/api/login', async (req, res) => {

  const { email, password } = req.body

  try {

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password'
      })
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return res.status(400).json({
        message: 'Invalid email or password'
      })
    }

    const token = jwt.sign(
  {
    userId: user._id,
    email: user.email,
    role: user.role
  },
  process.env.JWT_SECRET,
  {
    expiresIn: '1h'
  }
)

    res.json({
      message: 'Login successful',
      token: token,
      user: {
  name: user.name,
  email: user.email,
  role: user.role
}
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: 'Login failed'
    })

  }
})

app.get('/api/profile', authenticateToken, async (req, res) => {

  try {

    const user = await User.findById(req.user.userId)
      .select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.json({
      message: 'Protected profile accessed successfully',
      user: user
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: 'Server error'
    })

  }
})

app.put(
  '/api/profile',
  authenticateToken,
  async (req, res) => {

    const {
      name,
      college,
      branch,
      year,
      skills,
      bio
    } = req.body

    try {

      const user = await User.findById(
        req.user.userId
      )

      if (!user) {

        return res.status(404).json({
          message: 'User not found'
        })

      }

      user.name = name
      user.college = college
      user.branch = branch
      user.year = year
      user.skills = skills
      user.bio = bio

      await user.save()

      res.json({
        message: 'Profile updated successfully',
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          college: user.college,
          branch: user.branch,
          year: user.year,
          skills: user.skills,
          bio: user.bio,
          resume: user.resume
        }
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: 'Failed to update profile'
      })

    }

  }
)

app.get('/api/internships', async (req, res) => {

  try {

    const internships = await Internship.find()

    res.json(internships)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: 'Failed to fetch internships'
    })

  }
})

app.get('/api/internships/:id', async (req, res) => {

  try {

    const internship = await Internship.findById(
      req.params.id
    )

    if (!internship) {
      return res.status(404).json({
        message: 'Internship not found'
      })
    }

    res.json(internship)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: 'Failed to fetch internship'
    })

  }

})

app.post(
  '/api/internships',
  authenticateToken,
  requireAdmin,
  async (req, res) => {

  const {
    title,
    company,
    location,
    duration,
    stipend,
    skills,
    description
  } = req.body

  try {

    const internship = new Internship({
      title: title,
      company: company,
      location: location,
      duration: duration,
      stipend: stipend,
      skills: skills,
      description: description
    })

    await internship.save()

    res.status(201).json({
      message: 'Internship created successfully',
      internship: internship
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: 'Failed to create internship'
    })

  }
})

app.put(
  '/api/internships/:id',
  authenticateToken,
  requireAdmin,
  async (req, res) => {

    const {
      title,
      company,
      location,
      duration,
      stipend,
      skills,
      description
    } = req.body

    try {

      const internship = await Internship.findById(
        req.params.id
      )

      if (!internship) {

        return res.status(404).json({
          message: 'Internship not found'
        })

      }

      internship.title = title
      internship.company = company
      internship.location = location
      internship.duration = duration
      internship.stipend = stipend
      internship.skills = skills
      internship.description = description

      await internship.save()

      res.json({
        message: 'Internship updated successfully',
        internship: internship
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: 'Failed to update internship'
      })

    }

  }
)

app.delete(
  '/api/internships/:id',
  authenticateToken,
  requireAdmin,
  async (req, res) => {

    try {

      const internship = await Internship.findById(
        req.params.id
      )

      if (!internship) {

        return res.status(404).json({
          message: 'Internship not found'
        })

      }

      await Internship.findByIdAndDelete(
        req.params.id
      )

      res.json({
        message: 'Internship deleted successfully'
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: 'Failed to delete internship'
      })

    }

  }
)

app.post('/api/applications', authenticateToken, async (req, res) => {

  const { internshipId } = req.body

  try {

    const existingApplication = await Application.findOne({
      user: req.user.userId,
      internship: internshipId
    })

    if (existingApplication) {
      return res.status(400).json({
        message: 'You have already applied for this internship'
      })
    }

    const application = new Application({
      user: req.user.userId,
      internship: internshipId
    })

    await application.save()

    res.status(201).json({
      message: 'Application submitted successfully',
      application: application
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: 'Failed to submit application'
    })

  }

})

app.get('/api/applications', authenticateToken, async (req, res) => {

  try {

    const applications = await Application.find({
      user: req.user.userId
    }).populate('internship')

    res.json(applications)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: 'Failed to fetch applications'
    })

  }

})

app.get(
  '/api/admin/applications',
  authenticateToken,
  requireAdmin,
  async (req, res) => {

    try {

      const applications = await Application.find()
        .populate('user', 'name email')
        .populate('internship')

      res.json(applications)

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: 'Failed to fetch applications'
      })

    }

  }
)

app.get(
  '/api/admin/stats',
  authenticateToken,
  requireAdmin,
  async (req, res) => {

    try {

      const totalStudents = await User.countDocuments({
        role: 'student'
      })

      const totalInternships =
        await Internship.countDocuments()

      const totalApplications =
        await Application.countDocuments()

      const pendingApplications =
        await Application.countDocuments({
          status: 'Pending'
        })

      const acceptedApplications =
        await Application.countDocuments({
          status: 'Accepted'
        })

      const rejectedApplications =
        await Application.countDocuments({
          status: 'Rejected'
        })

      res.json({
        totalStudents,
        totalInternships,
        totalApplications,
        pendingApplications,
        acceptedApplications,
        rejectedApplications
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: 'Unable to fetch admin statistics'
      })

    }

  }
)

app.patch(
  '/api/admin/applications/:id',
  authenticateToken,
  requireAdmin,
  async (req, res) => {

    const { status } = req.body

    try {

      const application = await Application.findById(
        req.params.id
      )

      if (!application) {

        return res.status(404).json({
          message: 'Application not found'
        })

      }

      application.status = status

      await application.save()

      res.json({
        message: 'Application status updated successfully',
        application: application
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: 'Failed to update application status'
      })

    }

  }
)

const PORT = process.env.PORT || 5000

app.post(
  '/api/profile/resume',
  authenticateToken,
  upload.single('resume'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: 'Please upload a PDF resume'
        })
      }

      const resumePath =
        `/uploads/resumes/${req.file.filename}`

      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { resume: resumePath },
        { new: true }
      ).select('-password')

      res.json({
        message: 'Resume uploaded successfully',
        user: user
      })
    } catch (error) {
      console.log(error)

      res.status(500).json({
        message: 'Unable to upload resume'
      })
    }
  }
)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})