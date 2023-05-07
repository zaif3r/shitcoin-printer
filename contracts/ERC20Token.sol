// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC20} from "solady/tokens/ERC20.sol";
import {Owned} from "solmate/auth/Owned.sol";

contract ERC20Token is ERC20, Owned {

    constructor() ERC20() Owned(msg.sender) {}

    function name() public view override returns (string memory) {
        return "Token Name";
    }

    function symbol() public view override returns (string memory) {
        return "TKN";
    }

    function decimals() public view override returns (uint8) {
        return 18;
    }

    /*//////////////////////////////////////////////////////////////
                                MAX SUPPLY
    //////////////////////////////////////////////////////////////*/

    error MaxSupplyReached();

    uint256 public constant maxSupply = 10_000;

    modifier maxSupplyNotReached() {
        if (totalSupply() >= maxSupply) {
            revert MaxSupplyReached();
        }
        
        _;
    }

    /*//////////////////////////////////////////////////////////////
                                  MINT/BURN
    //////////////////////////////////////////////////////////////*/

    function mintOwner(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }

    function mintWithMaxSupply(
        address _to,
        uint256 _amount
    ) external maxSupplyNotReached {
        _mint(_to, _amount);
    }

    function burn(uint256 _amount) external {
        _burn(msg.sender, _amount);
    }

    /*//////////////////////////////////////////////////////////////
                                 BLACKLIST
    //////////////////////////////////////////////////////////////*/

    mapping(address => bool) public blacklisted;

    function setBlacklist(address _address, bool _isBlacklisting) external onlyOwner {
        blacklisted[_address] = _isBlacklisting;
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        require(!blacklisted[to] && !blacklisted[msg.sender], "BLACKLISTED");

        return super.transfer(to, amount);
    }

    /*//////////////////////////////////////////////////////////////
                                    SALE
    //////////////////////////////////////////////////////////////*/
}
