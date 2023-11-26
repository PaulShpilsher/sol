// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IERC20.sol";

contract ERC20 is IERC20 {

    address owner;

    mapping(address => uint) balances;

    mapping(address => mapping(address => uint)) allowances;

    string tname;
    string tsymbol;
    uint totalTokens;

    // token name.  not in ERC20 standart, but convinient to have it
    function name() external view returns(string memory) {
        return tname;
    }

    // token symbol
    function symbol() external view returns(string memory) {
        return tsymbol;
    }

    function decimals() external pure returns(uint) {
        return 18;  // 1 token = 1 wei
    }

    function totalSupply() external view returns(uint) {
        return totalTokens;
    }



    modifier onlyOwner() {
        require(msg.sender == owner, "not an owner!");
        _;
    }

    modifier enoughTokens(address _from, uint _amount) {
        require(balanceOf(_from) >= _amount, "not enough tokens!");
        _;
    }

    /**
        _name - token name
        _symbol - token symbol
        _initialSupply - number of tokens
        _principal - responsible party for token distribution
     */
    constructor(string memory _name, string memory _symbol, uint _initialSupply, address _principal) {
        owner = msg.sender;
        tname = _name;
        tsymbol = _symbol;
        mint(_initialSupply, _principal);
    }

    function balanceOf(address _account) public view returns(uint) {
        return balances[_account];
    }

    
    // transfer tokens.  sender transfers tokens to _to address
    function transfer(address _to, uint _amount) external enoughTokens(msg.sender, _amount) {
        _beforeTokenTransfer(msg.sender, _to, _amount);
        
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
        
        emit Transfer(msg.sender, _to, _amount);
    }


    // amount spender can take from owners account for the 3rd party
    function allowance(address _owner, address _spender) public view returns(uint) {
        return allowances[_owner][_spender];
    }

    // approve to spend (transfer tokens)
    function approve(address _spender, uint _amount) external {
        _approve(msg.sender, _spender, _amount);
    }


    function mint(uint _initialSupply, address _principal) public onlyOwner {
        _beforeTokenTransfer(address(0), _principal, _initialSupply);

        balances[_principal] += _initialSupply;
        totalTokens += _initialSupply;

        emit Transfer(address(0), _principal, _initialSupply); // minting does not have from address
    }

    function burn(address _from, uint _amount) public onlyOwner enoughTokens(_from, _amount) {
        _beforeTokenTransfer(_from, address(0), _amount);
        balances[_from] -= _amount;
        totalTokens -= _amount;
    }

    // transfer tokens between two parties.  prerequisite "approve" should happen first
    function transferFrom(address _sender, address _recipient, uint _amount) external enoughTokens(_sender, _amount) {
        _beforeTokenTransfer(_sender, _recipient, _amount);

        allowances[_sender][_recipient] -= _amount;
        balances[_sender] -= _amount;
        balances[_recipient] += _amount;

        emit Transfer(_sender, _recipient, _amount);
    }


    /// 
    function _beforeTokenTransfer(address _from, address _to, uint _amount) internal virtual {
    }


    function _approve(address _sender, address _spender, uint _amount) internal virtual {
        allowances[_sender][_spender] = _amount;
        emit Approve(_sender, _spender, _amount);
    }

}

