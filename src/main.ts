import * as core from '@actions/core'
import * as github from '@actions/github'

type DeploymentState =
  | 'error'
  | 'failure'
  | 'inactive'
  | 'in_progress'
  | 'queued'
  | 'pending'
  | 'success'

// Environment can actually be any string, but we need to type it like this to fit the GitHub API's TypeScript types.
type Environment = 'production' | 'staging' | 'qa' | undefined

async function run(): Promise<void> {
  try {
    const context = github.context
    const defaultUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}/checks`

    const token = core.getInput('token', {required: true})

    const baseUrl =
      core.getInput('github-base-url', {required: false}) || undefined

    const octokit = github.getOctokit(token, {baseUrl})

    const owner =
      core.getInput('owner', {required: false}) || context.repo.owner
    const repo = core.getInput('repo', {required: false}) || context.repo.repo

    const logUrl = core.getInput('log-url', {required: false}) || defaultUrl
    const description = core.getInput('description', {required: false}) || ''
    const deploymentId = core.getInput('deployment-id')
    const environmentUrl =
      core.getInput('environment-url', {required: false}) || ''

    const environment =
      (core.getInput('environment', {required: false}) as Environment) ||
      undefined

    const autoInactiveStringInput =
      core.getInput('auto-inactive', {required: false}) || undefined

    const autoInactive = autoInactiveStringInput
      ? autoInactiveStringInput === 'true'
      : undefined

    const state = core.getInput('state') as DeploymentState

    await octokit.rest.repos.createDeploymentStatus({
      owner,
      repo,
      environment,
      auto_inactive: autoInactive, // GitHub API defaults to true if undefined.
      deployment_id: parseInt(deploymentId),
      state,
      log_url: logUrl,
      description,
      environment_url: environmentUrl
    })
  } catch (error: any) {
    core.error(error)
    core.setFailed(`Error setting GitHub deployment status: ${error.message}`)
  }
}

run()
