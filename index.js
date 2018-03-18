web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
abi = JSON.parse('[{"constant":false,"inputs":[],"name":"generateWinner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"numberOfBets","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"RANGE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"candidateName","type":"bytes32"},{"name":"numberSelected","type":"uint256"}],"name":"bet","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"playerInfos","outputs":[{"name":"candidateAddress","type":"address"},{"name":"candidateName","type":"bytes32"},{"name":"amountBet","type":"uint256"},{"name":"numberSelected","type":"uint256"},{"name":"betTimes","type":"uint256"},{"name":"winAmount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"distributePrize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getPlayerInfos","outputs":[{"name":"","type":"address[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"winNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MAX_NUMBER_OF_BETS","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"winAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"players","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalBet","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_minimumBet","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]');
LottoContract = web3.eth.contract(abi);

contractInstance = LottoContract.at('0x8cdaf0cd259887258bc13a92c0a6da92698644c0');

function bet() {
  candidateName = $("#candidate").val();
  pickedNumber = $("#pickedNumber").val();
  betAmount = $("#betAmount").val();
  contractInstance.bet(candidateName, pickedNumber, {from: web3.eth.accounts[4], gas: 1000000, value: betAmount}, function(err, res) {
    loadUserInfo();
  });
}

function loadUserInfo() {
  numberOfBets = parseInt(contractInstance.numberOfBets.call({from: web3.eth.accounts[0]}).toString());
  playerInfo = contractInstance.getPlayerInfos.call({from: web3.eth.accounts[0]});
  winNumber = contractInstance.winNumber.call({from: web3.eth.accounts[0]});
  betList = "";
  for (i = 0; i < numberOfBets; i++) {
    contactAddress = playerInfo[0][i];
    contactName =  web3.toAscii(playerInfo[1][i]);
    betAmount = playerInfo[2][i];
    pickedNumber = playerInfo[3][i];
    betTime = playerInfo[4][i]; 
    winPrize = playerInfo[5][i]; 
    betList = betList.concat("<tr><td>" + contactAddress + "</td><td>" + contactName + "</td><td>" + betAmount 
      + "</td><td>" + pickedNumber + "</td><td>" + betTime + "</td><td>" + winPrize + "</td></tr>");  
  }  
  $("#userList").html(betList);
  $("#winNumber").html("Win Number: " + winNumber);
  console.log(contractInstance.winAmount.call({from: web3.eth.accounts[0]}).toString());
  console.log(contractInstance.totalBet.call({from: web3.eth.accounts[0]}).toString());
}

$(document).ready(function() {
  loadUserInfo();
});