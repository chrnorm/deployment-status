import * as core from "@actions/core";
import * as github from "@actions/github";

type DeploymentState =
  | "error"
  | "failure"
  | "inactive"
  | "in_progress"
  | "queued"
  | "pending"
  | "success";

async function run() {
  try {
    const context = github.context;
    const defaultUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}/checks`;

    const token = core.getInput("token", { required: true });
    const url = core.getInput("target_url", { required: false }) || defaultUrl;
    const description = core.getInput("description", { required: false }) || "";
    const deploymentId = core.getInput("deployment_id");
    const state = core.getInput("state") as DeploymentState;

    const client = new github.GitHub(token);

    await client.repos.createDeploymentStatus({
      ...context.repo,
      deployment_id: parseInt(deploymentId),
      state,
      log_url: defaultUrl,
      target_url: url,
      description
    });
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
