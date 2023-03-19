// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Score {
    mapping(address => uint) private studentScore;
    address internal admin;
    address internal teacher;

    event  ChangeAdminEvent(address indexed newAdmin, address indexed oldAdmin);
    event  ChangeTeacherEvent(address indexed newTea, address indexed oldTea);

    modifier OnlyAdmin() {
        require(msg.sender == admin, "only admin can do this!");
        _;
    }

    modifier OnlyTeacher() {
        require(msg.sender == teacher, "only teacher can do this!");
        _;
    }

    constructor (address _teacher) {
        admin = msg.sender;
        teacher = _teacher;
    }

    function SetScore(address student, uint score) OnlyTeacher  external {
        require(score >= 0 && score <= 100, "error score");
        studentScore[student] = score;
    }

    function GetScore(address student) view external returns(uint) {
        return studentScore[student];
    }

    function SetAdmin(address _admin) OnlyAdmin external{
        address old_admin = admin;
        admin = _admin;
        emit ChangeAdminEvent(old_admin, admin);
    }

    function ChangeTeacher(address _teacher) OnlyAdmin external{
        address old_teacher = teacher;
        teacher = _teacher;
        emit ChangeTeacherEvent(old_teacher, teacher);
    }
}
