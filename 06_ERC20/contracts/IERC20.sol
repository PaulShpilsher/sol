// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IERC20 {
    //
    // extra stuff to the standard

    // token name.  not in ERC20 standart, but convinient to have it
    function name() external view returns (string memory);

    // token symbol
    function symbol() external view returns (string memory);

    // token precision. i.e. number of digits after the decimal point
    function decimals() external pure returns (uint); // 0

    // end of extra stuff to the standard
    //

    // total number of tokens
    function totalSupply() external view returns (uint);

    // account balance in tokens
    function balanceOf(address _account) external view returns (uint);

    // transfer tokens.  sender transfers tokens to _to address
    function transfer(address _to, uint _amount) external;

    // amount spender can take from owners account for the 3rd party
    function allowance(
        address _owner,
        address _spender
    ) external view returns (uint);

    // approve to spend (transfer tokens)
    function approve(address _spender, uint _amount) external;

    // transfer tokens between two parties.  prerequisite "approve" should happen first
    function transferFrom(
        address _sender,
        address _recipient,
        uint _amount
    ) external;

    // onApproved
    event Approve(address indexed _from, address indexed _to, uint _amount);

    // onTransfered
    event Transfer(address indexed _from, address indexed _to, uint _amount);
}
