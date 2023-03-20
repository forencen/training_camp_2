# Teacher&Scoree

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IScore {
    function SetScore(address student, uint score) external;
    function GetScore(address student) view external returns(uint);
}

contract Teacher {
    
    // 循环添加学生和成绩
    function SetStudentScore(address _score, address[] calldata students, uint[] calldata scores) external {
        require(students.length == scores.length, "params error");
        for (uint i = 0; i < students.length; i++) {
            IScore(_score).SetScore(students[i], scores[i]);
        }
    }
}

```

```solidity
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

```

## 测试网部署

```
 npx hardhat compile
 npx hardhat test
 npx hardhat run --network goerli  scripts/deploy.js
```

Score address 0xb1b523a05Bfa2EB2A7022e439db94a704DB81441 . Teacher address 0xbe17c8650DC6A35Ea05867b50ce5A932168bC778

https://goerli.etherscan.io/address/0xbe17c8650DC6A35Ea05867b50ce5A932168bC778#code
``` 
(base) ➜  hardhat_project git:(main) ✗ npx hardhat verify --network goerli  0xbe17c8650DC6A35Ea05867b50ce5A932168bC778                                              
Nothing to compile
Successfully submitted source code for contract
contracts/Teacher.sol:Teacher at 0xbe17c8650DC6A35Ea05867b50ce5A932168bC778
for verification on the block explorer. Waiting for verification result...

Successfully verified contract Teacher on Etherscan.
https://goerli.etherscan.io/address/0xbe17c8650DC6A35Ea05867b50ce5A932168bC778#code

```

https://goerli.etherscan.io/address/0xb1b523a05Bfa2EB2A7022e439db94a704DB81441#code
```  
(base) ➜  hardhat_project git:(main) ✗ npx hardhat verify --network goerli  0xb1b523a05Bfa2EB2A7022e439db94a704DB81441  0xbe17c8650DC6A35Ea05867b50ce5A932168bC778      
Nothing to compile
Successfully submitted source code for contract
contracts/Score.sol:Score at 0xb1b523a05Bfa2EB2A7022e439db94a704DB81441
for verification on the block explorer. Waiting for verification result...

Successfully verified contract Score on Etherscan.
https://goerli.etherscan.io/address/0xb1b523a05Bfa2EB2A7022e439db94a704DB81441#code

```