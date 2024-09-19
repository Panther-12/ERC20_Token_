const { ethers } = require("hardhat");

async function main() {
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    const address = await myToken.getAddress();
    console.log("MyToken deployed to:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
