const core = require('@actions/core');
const exec = require('@actions/exec');
const path = require('path');

async function run() {
  try {
    const environment = core.getInput('environment');
    const registryUsername = core.getInput('registry-username', { required: true });
    const registryPassword = core.getInput('registry-password', { required: true });
    const kamalPath = core.getInput('kamal-path');
    const workdir = core.getInput('workdir');

    core.exportVariable('KAMAL_REGISTRY_USERNAME', registryUsername);
    core.exportVariable('KAMAL_REGISTRY_PASSWORD', registryPassword);
    core.exportVariable('DOCKER_BUILDKIT', 1);

    // Build the deploy command args as an array
    const deployCommand = ['deploy'];

    // Add the `--destination` flag if environment is provided
    if (environment) {
      deployCommand.push(`--destination=${environment}`);
    }

    // Use the provided workdir
    const cwd = path.resolve(workdir);

    // Execute the deployment command
    await exec.exec(kamalPath, deployCommand, { cwd });

    // Handle cancellation
    process.on('SIGINT', async () => {
      core.warning('Action canceled, releasing resources...');
      try {
        const lockCommand = ['lock', 'release'];

        // Add the `--destination` flag if environment is provided
        if (environment) {
          lockCommand.push(`--destination=${environment}`);
        }

        await exec.exec(kamalPath, lockCommand, { cwd });
        core.info('Kamal lock released successfully.');
      } catch (error) {
        core.setFailed(`Failed to release Kamal lock: ${error.message}`);
      }

      process.exit(1); // Exit the process
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();