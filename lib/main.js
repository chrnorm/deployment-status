"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const context = github.context;
            const defaultUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}/checks`;
            const token = core.getInput('token', { required: true });
            const baseUrl = core.getInput('github-base-url', { required: false }) || undefined;
            const octokit = github.getOctokit(token, { baseUrl });
            const owner = core.getInput('owner', { required: false }) || context.repo.owner;
            const repo = core.getInput('repo', { required: false }) || context.repo.repo;
            const logUrl = core.getInput('log-url', { required: false }) || defaultUrl;
            const description = core.getInput('description', { required: false }) || '';
            const deploymentId = core.getInput('deployment-id');
            const environmentUrl = core.getInput('environment-url', { required: false }) || '';
            const environment = core.getInput('environment', { required: false }) ||
                undefined;
            const autoInactiveStringInput = core.getInput('auto-inactive', { required: false }) || undefined;
            const autoInactive = autoInactiveStringInput
                ? autoInactiveStringInput === 'true'
                : undefined;
            const state = core.getInput('state');
            yield octokit.rest.repos.createDeploymentStatus({
                owner,
                repo,
                environment,
                auto_inactive: autoInactive,
                deployment_id: parseInt(deploymentId),
                state,
                log_url: logUrl,
                description,
                environment_url: environmentUrl
            });
        }
        catch (error) {
            core.error(error);
            core.setFailed(`Error setting GitHub deployment status: ${error.message}`);
        }
    });
}
run();
