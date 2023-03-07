import {Component} from 'react'

import Loader from 'react-loader-spinner'

import './index.css'

import ProjectItem from '../ProjectItem'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
}

class ProjectShowcase extends Component {
  state = {
    activeTabId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjectDetails()
  }

  getProjectDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeTabId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeTabId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeOption = event => {
    this.setState({activeTabId: event.target.value}, this.getProjectDetails)
  }

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-container">
        {projectsList.map(eachProject => (
          <ProjectItem key={eachProject.id} projectDetails={eachProject} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-text">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retry-btn"
        type="button"
        onClick={this.getProjectDetails}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color=" #328af2" height={80} width={80} />
    </div>
  )

  renderProjectDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  render() {
    const {activeTabId} = this.state
    return (
      <div className="bg-container">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo-img"
          />
        </div>
        <div className="tab-container">
          <select
            value={activeTabId}
            className="select-option"
            onChange={this.onChangeOption}
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id} className="option-text">
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderProjectDetails()}
        </div>
      </div>
    )
  }
}

export default ProjectShowcase
