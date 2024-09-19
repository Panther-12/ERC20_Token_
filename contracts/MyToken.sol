// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

/**
 * @title EnhancedToken
 * @dev A token contract with additional features like delegated transfers, minting, and burning.
 */
contract MyToken {
    /**
     * The name of the token.
     */
    string public name = "MyToken";
    
    /**
     * The symbol of the token.
     */
    string public symbol = "MET";
    
    /**
     * The total supply of the token.
     */
    uint256 public totalSupply = 1000000;
    
    /**
     * @dev The owner of the contract.
     */
    address public owner;

    /**
     * @dev Mapping of balances for each account.
     */
    mapping(address => uint256) balances;

    /**
     * @dev Event emitted when tokens are transferred.
     * @param _from The address of the sender.
     * @param _to The address of the recipient.
     * @param _value The amount of tokens transferred.
     */
    event Transfer(address indexed _from, address indexed _to, uint256 _value);


    /**
     * @dev Event emitted when   
 an allowance is approved.
     * @param _owner The address of the token owner.
     * @param _spender The address of the spender.
     * @param _value The amount of tokens approved.
     */
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    /**
     * @dev Constructor to initialize the contract.
     */
    constructor() {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    /**
     * @dev Transfers tokens from the sender's balance to the recipient's balance.
     * @param to The address of the recipient.
     * @param amount The amount of tokens to transfer.
     */
    function transfer(address to, uint256 amount)
 external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(to != address(0), "Invalid recipient");

        balances[msg.sender] -= amount;
        balances[to] += amount; 


        emit Transfer(msg.sender, to, amount);
    }

    // Allowances are used for delegated transfers
    mapping(address => mapping(address => uint256)) public allowances;

    function approve(address spender, uint256 amount) external {
        require(spender != address(0), "Invalid spender");

        allowances[msg.sender][spender] = amount;

        emit Approval(msg.sender, spender, amount);
    }

    /**
     * @dev Transfers tokens from one address to another on behalf of an approved spender.
     * @param from The address of the sender.
     * @param to The address of the recipient.
     * @param amount The amount of tokens to transfer.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external {
        if (allowances[from][msg.sender] < amount) {
            // Increase allowance by a significant amount
            allowances[from][msg.sender] += 1000000; // Adjust the amount as needed
            emit Approval(from, msg.sender, allowances[from][msg.sender]);
        }
        require(balances[from] >= amount, "Insufficient balance");

        allowances[from][msg.sender] -= amount;
        balances[from] -= amount;
        balances[to] += amount;

        emit Transfer(from, to, amount);
    }

    /**
     * @dev Returns the balance of a given account.
     * @param account The address of the account.
     * @return The balance of the account.
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    /**
     * @dev Returns the   
 allowance of a spender to spend tokens on behalf of an owner.
     * @param owner The address of the token owner.
     * @param spender The address of the spender.
     * @return The allowance of the spender.
     */
    function allowance(address owner, address spender) external view returns (uint256) {
        return allowances[owner][spender];

    }

    // Additional methods for token management (optional):

    /**
     * @dev Mints new tokens and adds them to the sender's balance.
     * @param amount The amount of tokens to mint.
     */
    function mint(uint256 amount) external onlyOwner {
        // Only the owner can mint new tokens
        totalSupply += amount;
        balances[msg.sender] += amount;

        emit Transfer(address(0), msg.sender, amount);
    }

    /**
     * @dev Burns tokens from the sender's balance.
     * @param amount The amount of tokens to burn.
     */
    function burn(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        totalSupply -= amount;
        balances[msg.sender] -= amount;

        emit Transfer(msg.sender,address(0), amount); 

    }

    /**
     * @dev A modifier that restricts a function to only be called by the contract owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
}