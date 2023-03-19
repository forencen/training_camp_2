// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IScore {
    function SetScore(address student, uint score) external;
    function GetScore(address student) view external returns(uint);
}

contract Teacher {

    function SetStudentScore(address _score, address[] calldata students, uint[] calldata scores) external {
        require(students.length == scores.length, "params error");
        for (uint i = 0; i < students.length; i++) {
            IScore(_score).SetScore(students[i], scores[i]);
        }
    }
}
