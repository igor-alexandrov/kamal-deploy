const core = require('@actions/core');
const exec = require('@actions/exec');
const path = require('path');

/**
 * Add common command parameters based on environment and config settings
 * @param {string[]} command - The command array to add parameters to
 * @param {string} environment - The environment parameter value
 * @param {string} configFile - The config file parameter value
 * @returns {string[]} - The updated command array
 */
function addCommandParameters(command, environment, configFile) {
  // Add the `--destination` flag if environment is provided
  if (environment) {
    command.push(`--destination=${environment}`);
  }

  // Add the `--config-file` flag if configFile is provided
  if (configFile) {
    command.push(`--config-file=${configFile}`);
  }

  return command;
}

async function run() {
  try {
    const registryUsername = core.getInput('registry-username', { required: true });
    const registryPassword = core.getInput('registry-password', { required: true });
    const workdir = core.getInput('workdir');
    const kamal = core.getInput('kamal');
    const environment = core.getInput('environment');
    const configFile = core.getInput('config-file');

    core.exportVariable('KAMAL_REGISTRY_USERNAME', registryUsername);
    core.exportVariable('KAMAL_REGISTRY_PASSWORD', registryPassword);
    core.exportVariable('DOCKER_BUILDKIT', 1);

    // Build the deploy command args as an array
    let deployCommand = ['deploy'];
    deployCommand = addCommandParameters(deployCommand, environment, configFile);

    // Use the provided workdir
    const cwd = path.resolve(workdir);

    // Execute the deployment command
    await exec.exec(kamal, deployCommand, { cwd });

    // Handle cancellation
    process.on('SIGINT', async () => {
      core.warning('Action canceled, releasing resources...');
      try {
        // Build the lock command args as an array
        let lockCommand = ['lock', 'release'];
        lockCommand = addCommandParameters(lockCommand, environment, configFile);

        await exec.exec(kamal, lockCommand, { cwd });
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