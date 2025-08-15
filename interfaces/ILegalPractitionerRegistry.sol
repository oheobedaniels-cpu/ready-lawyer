// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILegalPractitionerRegistry {
    enum Status { None, Pending, Approved, Revoked }

    function isLawyer(address account) external view returns (bool);
    function isJudge(address account) external view returns (bool);

    function lawyerStatus(address account) external view returns (Status);
    function judgeStatus(address account) external view returns (Status);
    function lawyerProfileURI(address account) external view returns (string memory);
    function judgeProfileURI(address account) external view returns (string memory);
}
