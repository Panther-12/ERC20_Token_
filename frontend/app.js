const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

const myToken = new ethers.Contract(contractAddress);
const [deployer, acc1, acc2] = await ethers.getSigners();

async function getBalance() {
    const address = await signer.getAddress();
    const balance = await myToken.balanceOf(address);
    document.getElementById("info").innerText = `Balance: ${ethers.utils.formatEther(balance)} MAT`;
}

async function transferTokens() {
    const tx = await myToken.transfer(acc1.address, ethers.utils.parseEther("10")); 
    await tx.wait();
    document.getElementById("info").innerText = "Transfer successful!";
}

// Request access to the user's MetaMask account
async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
}

window.onload = function() {
    requestAccount();
};
