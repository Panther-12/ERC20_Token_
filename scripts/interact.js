const { ethers } = require('hardhat');

async function main() {
  // Get the contract factory
  const EnhancedToken = await ethers.getContractFactory('MyToken');

  // Deploy the contract (replace with your deployment arguments if needed)
  const enhancedToken = await EnhancedToken.deploy();

  // Get the contract address
  const contractAddress = await enhancedToken.getAddress();
  console.log('Contract address:', contractAddress);

  // Get the owner account
  const [ownerAccount] = await ethers.getSigners();
  console.log('Owner account:', ownerAccount.address);


  // 1. Get the balance of the owner account
  const ownerBalance = await enhancedToken.balanceOf(ownerAccount.address);
  console.log('Owner balance:', ownerBalance.toString());

  // 2. Transfer tokens from the owner to another account
  const recipientAccount = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';
  const amountToTransfer = 20;

  // (Optional) Check if the owner's balance is sufficient for transfer
  if (ownerBalance < amountToTransfer) {
    console.error("Owner's balance is insufficient for transfer.");
    return; // Exit the function if balance is too low
  }

  const transferTx = await enhancedToken.transfer(recipientAccount, amountToTransfer);
  console.log('Transfer transaction hash:', transferTx.hash);

  // 3. Get the balance of the recipient account
  const recipientBalance = await enhancedToken.balanceOf(recipientAccount);
  console.log('Recipient balance:', recipientBalance.toString());

  // 4. Approve a spender to spend tokens on behalf of the owner
  const spenderAccount = '0xdD2FD4581271e230360230F9337D5c0430Bf44C0';
  const approveTx = await enhancedToken.approve(spenderAccount, amountToTransfer);
  console.log('Approve transaction hash:', approveTx.hash);

  // 5. Transfer tokens from the owner's account to another account using the spender
  try {
    const transferFromTx = await enhancedToken.transferFrom(ownerAccount.address, recipientAccount, amountToTransfer);
    console.log('TransferFrom transaction hash:', transferFromTx.hash);
  } catch (error) {
    if (error.message.includes('Insufficient allowance')) {
      console.log('Insufficient allowance. Adding 1,000,000 tokens to owner\'s account.');
      const addTokensTx = await enhancedToken.mint(1000000);
      console.log('Tokens added transaction hash:', addTokensTx.hash);

      // Retry the transfer after adding tokens
      const transferFromTx = await enhancedToken.transferFrom(ownerAccount.address, recipientAccount, String(amountToTransfer));
      console.log('TransferFrom transaction hash:', transferFromTx.hash);
    } else {
      throw error;
    }
  }

  // 6. Mint new tokens (only for the contract owner)
  const mintAmount = 1000;
  const mintTx = await enhancedToken.mint(mintAmount);
  console.log('Mint transaction hash:', mintTx.hash);

  // 7. Get the updated balance of the owner account
  const updatedOwnerBalance = await enhancedToken.balanceOf(ownerAccount.address);
  console.log('Updated owner balance:', updatedOwnerBalance.toString());

  // 8. Burn tokens
  const burnAmount = 500;
  const burnTx = await enhancedToken.burn(burnAmount);
  console.log('Burn transaction hash:', burnTx.hash);

  // 9. Get the final balance of the owner account
  const finalOwnerBalance = await enhancedToken.balanceOf(ownerAccount.address);
  console.log('Final owner balance:', finalOwnerBalance.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});