import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

// deploy/0-deploy-Vault.ts
const deployVault: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {
    deployments: { deploy },
    getNamedAccounts,
  } = hre;
  const { deployer } = await getNamedAccounts();

  await deploy('Vault', {
    from: deployer,
    args: [1],
    log: true,
  });
};

export default deployVault;
deployVault.tags = ['Vault'];
