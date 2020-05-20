# deployment-status

A GitHub action to update the status of [Deployments](https://developer.github.com/v3/repos/deployments/) as part of your GitHub CI workflows.

Works great with my other action to create Deployments, [chrnorm/deployment-action](https://github.com/chrnorm/deployment-action).

## Action inputs

| name              | description                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `state`           | The state to set the deployment to. Must be one of the below: "error" "failure" "inactive" "in_progress" "queued" "pending" "success" |
| `token`           | GitHub token                                                                                                                          |
| `target_url`      | (Optional) The target URL. This should be the URL of the app once deployed                                                            |
| `description`     | (Optional) Descriptive message about the deployment                                                                                   |
| `environment_url` | (Optional) Sets the URL for accessing your environment                                                                                |
| `deployment_id`   | The ID of the deployment to update                                                                                                    |

## Usage example

The below example includes `chrnorm/deployment-action` and `chrnorm/deployment-status` to create and update a deployment within a workflow.

```yaml
name: Deploy

on: [push]

jobs:
  deploy:
    name: Deploy my app

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1

      - uses: chrnorm/deployment-action@releases/v1
        name: Create GitHub deployment
        id: deployment
        with:
          token: "${{ github.token }}"
          target_url: http://my-app-url.com
          environment: production

      - name: Deploy my app
        run: |
          # add your deployment code here

      - name: Update deployment status (success)
        if: success()
        uses: chrnorm/deployment-status@releases/v1
        with:
          token: "${{ github.token }}"
          target_url: http://my-app-url.com
          state: "success"
          deployment_id: ${{ steps.deployment.outputs.deployment_id }}

      - name: Update deployment status (failure)
        if: failure()
        uses: chrnorm/deployment-status@releases/v1
        with:
          token: "${{ github.token }}"
          target_url: http://my-app-url.com
          state: "failure"
          deployment_id: ${{ steps.deployment.outputs.deployment_id }}
```

## Development

Install dependencies with `npm install`.

## Building

First build Typescript with `npm run build`. Then package to a single JS file with `npm run pack`. The `pack` step uses `ncc`(https://github.com/zeit/ncc) as specified in the Typescript GitHub Actions template.

## Testing

There is a validation workflow in `.github/workflows/validate.yml` which performs a basic smoke test against the action to check that it runs.
