# deployment-status

A GitHub action to update the status of [Deployments](https://developer.github.com/v3/repos/deployments/) as part of your GitHub CI workflows.

Works great with my other action to create Deployments, [chrnorm/deployment-action](https://github.com/chrnorm/deployment-action).

## Action inputs

| name              | description                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `repo`            | (Optional) A custom repository to create the deployment for. Defaults to the repo the action is running in.                           |
| `owner`           | A custom owner to create the deployment for. Defaults to the repo owner the action is running in.                                     |
| `state`           | The state to set the deployment to. Must be one of the below: "error" "failure" "inactive" "in_progress" "queued" "pending" "success" |
| `token`           | GitHub token                                                                                                                          |
| `log-url`         | (Optional) Sets the URL for deployment output                                                                                         |
| `environment-url` | (Optional) Sets the URL for accessing your environment                                                                                |
| `environment`     | (Optional) Name for the target deployment environment, which can be changed when setting a deploy status.                             |
| `description`     | (Optional) Descriptive message about the deployment                                                                                   |
| `deployment-id`   | The ID of the deployment to update                                                                                                    |
| `github-base-url` | (Optional) Changes the API base URL for a GitHub Enterprise server.                                                                   |

## Usage example

The below example includes `chrnorm/deployment-action` and `chrnorm/deployment-status` to create and update a deployment within a workflow.

```yaml
name: Deploy

on: [push]

jobs:
  deploy:
    name: Deploy my app

    # IMPORTANT: the workflow must have write access to deployments, otherwise the action will fail.
    permissions:
      deployments: write

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1

      - uses: chrnorm/deployment-action@v2
        name: Create GitHub deployment
        id: deployment
        with:
          token: '${{ github.token }}'
          environment-url: http://my-app-url.com
          environment: production

      - name: Deploy my app
        run: |
          # add your deployment code here

      - name: Update deployment status (success)
        if: success()
        uses: chrnorm/deployment-status@v2
        with:
          token: '${{ github.token }}'
          environment-url: http://my-app-url.com
          state: 'success'
          deployment-id: ${{ steps.deployment.outputs.deployment_id }}

      - name: Update deployment status (failure)
        if: failure()
        uses: chrnorm/deployment-status@v2
        with:
          token: '${{ github.token }}'
          environment-url: http://my-app-url.com
          state: 'failure'
          deployment-id: ${{ steps.deployment.outputs.deployment_id }}
```

## Development

Install dependencies with `npm install`.

## Building

First build Typescript with `npm run build`. Then package to a single JS file with `npm run pack`. The `pack` step uses `ncc`(https://github.com/zeit/ncc) as specified in the Typescript GitHub Actions template.

## Testing

There is a validation workflow in `.github/workflows/test.yml` which performs a basic smoke test against the action to check that it runs.
