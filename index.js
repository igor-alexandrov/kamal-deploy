const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
  try {
    const environment = core.getInput('environment', { required: true });
    const registryUsername = core.getInput('registry-username', { required: true });
    const registryPassword = core.getInput('registry-password', { required: true });

    core.exportVariable('KAMAL_REGISTRY_USERNAME', registryUsername);
    core.exportVariable('KAMAL_REGISTRY_PASSWORD', registryPassword);
    core.exportVariable('DOCKER_BUILDKIT', 1);

    // Execute the deployment command
    await exec.exec('./bin/kamal', ['deploy', `--destination=${environment}`]);

    // Handle cancellation
    process.on('SIGINT', async () => {
      core.warning('Action canceled, releasing resources...');
      try {
        await exec.exec('./bin/kamal', ['lock', 'release', `--destination=${environment}`]);
        core.info('Resources released successfully.');
      } catch (error) {
        core.setFailed(`Failed to release resources: ${error.message}`);
      }

      process.exit(1); // Exit the process
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();