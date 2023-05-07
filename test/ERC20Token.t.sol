// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/ERC20Token.sol";

contract ERC20TokenTest is Test {
    ERC20Token public token;

    function setUp() public {
        token = new ERC20Token();
    }

    function testMintOwner(address _to, uint256 _amount) public {
        vm.prank(token.owner());
        token.mintOwner(_to, _amount);
    }

    function testFailMintOwnerNotOwner() public {
        vm.prank(address(0xB0b));
        token.mintOwner(address(0xB0b), 1);
    }

    function testMintWithMaxSupply(address _to) public {
        token.mintWithMaxSupply(_to, token.maxSupply());
        vm.expectRevert();
        token.mintWithMaxSupply(_to, 1);
    }

    function testSetBlacklist(address _address, bool _isBlacklisting) public {
        vm.prank(token.owner());
        token.setBlacklist(_address, _isBlacklisting);
        assertEq(token.blacklisted(_address), _isBlacklisting);
    }

    function testFailSetBlacklistNotOwner() public {
        vm.prank(address(0xB0b));
        token.setBlacklist(address(0xB0b), false);
    }

    function testFailTransferIsBlacklisted(address _address) public {
        vm.prank(token.owner());
        token.mintOwner(_address, 1);
        token.setBlacklist(_address, true);

        vm.prank(_address);
        token.transfer(address(0xB0b), 1);
    }
}
