Web3 = require('web3')
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545")) // Check for the right port number

const solc = require('solc');
const fs = require('fs');

const sourceFilePath = process.argv[2];
const contractName = process.argv[3];

var code;
var compiledCode;

function build(deploy) {
    code = fs.readFileSync(sourceFilePath).toString();
    compiledCode = solc.compile(code);
    byteCode = compiledCode.contracts[`:${contractName}`].bytecode;
    abi = compiledCode.contracts[`:${contractName}`].interface;
    lottoContract = web3.eth.contract(JSON.parse(abi))
    deploy(byteCode, lottoContract, abi, output);
}

function deploy(byteCode, lottoContract, abi, output) {
    deployedContract = lottoContract.new(
        5,
        {
            data: byteCode, 
            from: web3.eth.accounts[0],
            gas: 2000000
        })
    setTimeout(function(){ console.log("wait 5 seconds"); output(abi, deployedContract.address);}, 5000);       
}

function output(interface, address) {
    console.log(interface);
    console.log(address); 
}

build(deploy);


