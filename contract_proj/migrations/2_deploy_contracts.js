const SimpleStorage = artifacts.require('ChatHistory');

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
};
