pragma solidity 0.4.21; // version


contract Lotto {
    // PROPERTIES
    
    // owner of contract
    address public owner;
    
    // minimum allowed bet
    uint256 minimumBet = 100 finney; // 0.1 Ether
    
    // total bet so far
    uint256 public totalBet = 0;
    
    // total number of bets so far
    uint256 public numberOfBets = 0;
    
    // maximum number of bets
    uint256 public constant MAX_NUMBER_OF_BETS = 10;
    
    // range of bet amount
    uint256 public constant RANGE = 1000;

    // win amount
    uint256 public winAmount = 0;

    // win number
    uint256 public winNumber;
    
    // list of players
    address[] public players;
    
    struct Bet {
        address candidateAddress;
        bytes32 candidateName;
        uint256 amountBet;
        uint256 numberSelected;
        uint256 betTimes;
        uint256 winAmount;
    }
    
    mapping(uint256 => Bet) public playerInfos;
    
    // FUNCTIONS
    // constructor
    function Lotto(uint256 _minimumBet) public {
        if (minimumBet > 0) {
            minimumBet = _minimumBet;
        }
        owner = msg.sender;
    }
    
    // get player info
    function getPlayerInfos() public returns (address[], bytes32[], uint256[], uint256[], uint256[], uint256[]) {
        
        address[] memory candidateAddressArray = new address[](numberOfBets);
        bytes32[] memory candidateNameArray = new bytes32[](numberOfBets);
        uint256[] memory amountBetArray = new uint256[](numberOfBets);
        uint256[] memory numberSelectedArray = new uint256[](numberOfBets);
        uint256[] memory betTimesArray = new uint256[](numberOfBets);
        uint256[] memory winAmountArray = new uint256[](numberOfBets);

        for (uint i = 0; i < numberOfBets; i++) {
            Bet storage playerInfo = playerInfos[i];
            candidateAddressArray[i] = playerInfos[i].candidateAddress;
            candidateNameArray[i] = playerInfo.candidateName;
            amountBetArray[i] = playerInfo.amountBet;
            numberSelectedArray[i] = playerInfo.numberSelected;
            betTimesArray[i] = playerInfo.betTimes;
            winAmountArray[i] = playerInfo.winAmount;
        }

        return (candidateAddressArray, candidateNameArray, amountBetArray, 
            numberSelectedArray, betTimesArray, winAmountArray);
    }

    // place a bet
    function bet(bytes32 candidateName, uint256 numberSelected) public payable {
        // payable: have to send some ether along when call
        
        require(numberSelected >= 1 && numberSelected <= RANGE);
        require(msg.value >= minimumBet);
        require(numberOfBets <= MAX_NUMBER_OF_BETS);

        uint betTimes = 0;
        
        for (uint i = 0; i < numberOfBets; i++) {
            if (playerInfos[i].candidateAddress == msg.sender) {
                if (playerInfos[i].betTimes == 4) {
                    return;
                } else {
                    betTimes = playerInfos[i].betTimes++; 
                }
            }
        }    

        playerInfos[numberOfBets].candidateAddress = msg.sender;        
        playerInfos[numberOfBets].candidateName = candidateName;
        playerInfos[numberOfBets].amountBet = msg.value;
        playerInfos[numberOfBets].numberSelected = numberSelected;
        playerInfos[numberOfBets].betTimes++;
        playerInfos[numberOfBets].winAmount = 0;

        players.push(msg.sender);
        numberOfBets++;
        totalBet += msg.value;
        
        if (numberOfBets == MAX_NUMBER_OF_BETS) {
            generateWinner();
        }
    
    }
    
    // generate winner 
    function generateWinner() public {
        winNumber = random();
        distributePrize();
    }
    
    // distribute prize
    function distributePrize() public {
        address[MAX_NUMBER_OF_BETS] memory winners;
        
        // number of winners
        uint256 count = 0;
        
        // filter the winners
        for (uint256 i = 0; i < numberOfBets; i++) {
            if (playerInfos[i].numberSelected == winNumber) {
                winners[count] = playerInfos[i].candidateAddress;
                count++;
            }
            // remove players
            // delete playerInfos[i];
        }
        
        // remove players
        // players.length = 0;
        
        // calculate prize
        winAmount = totalBet / count;

        // update playerInfos
        for (uint256 j = 0; j < numberOfBets; j++) {
            if (playerInfos[j].numberSelected == winNumber) {
                playerInfos[j].winAmount = winAmount;
            }
        }
        
        // distribute prize
        for (uint256 k = 0; k < count; k++) {
            if (winners[k] != address(0)) { // check if valid address
                winners[k].transfer(winAmount);
            }
        }
        
        // reset bet amount 
        // totalBet = 0;
    }

    function random() private returns (uint) {
        return uint8(uint256(keccak256(block.timestamp, block.difficulty))%10);
    }
}