const RPC_ENDPOINT = 'http://127.0.0.1:7545';
const CONTRACT_ADDRESS = '0x29058951751f9f130aBcDE7454F4B0F7A430943e';

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);
const web3 = new Web3(provider);
const { ERC725 } = require('@erc725/erc725.js');
const fs = require('fs')
const path = require('path')

const getInstance = () => {
    const schema = [
        {
            name: 'Doc',
            key: web3.utils.keccak256('Doc'),
            keyType: 'Singleton',
            valueContent: 'String',
            valueType: 'string',
        }
    ]

    return new ERC725(schema, CONTRACT_ADDRESS, provider);
};

const returnCompiledContract = (contractName) => {
    const pathArtifact = path.join(__dirname, `../artifacts/${contractName}.json`)
    const artifact = fs.readFileSync(path.resolve(pathArtifact), 'utf8')
    return JSON.parse(artifact)
}

(async () => {
    const personal = web3.eth.personal
    const accounts = await personal.getAccounts()

    console.log('//////////////////////WRITING DATA/////////////////////////////////////////')

    const data = { Doc: '29047369807' }
    const myERC725 = getInstance();
    const encodedDataOneKey = myERC725.encodeData(data)
    console.log(encodedDataOneKey)

    const contract = new web3.eth.Contract(returnCompiledContract('ERC725').abi, CONTRACT_ADDRESS)
    contract.setProvider(RPC_ENDPOINT)
    const transaction = await contract.methods.setData(
        [encodedDataOneKey.Doc.key],
        [encodedDataOneKey.Doc.value]
    ).send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: web3.utils.toWei('0.00003', 'ether')
    })

    console.log('//////////////////////READING DATA/////////////////////////////////////////')

    const dataKey = await contract.methods.getData([encodedDataOneKey.Doc.key]).call()
    console.log(dataKey)

    console.log('//////////////////////FETCH DATA/////////////////////////////////////////')
    const dataAllKeys = await myERC725.fetchData('Doc')
    console.log(dataAllKeys)

    console.log('///////////////////////EXECUTE//////////////////////')
    const parametersEncode = web3.eth.abi.encodeParameters(['string', 'string', 'uint256', 'address'],
        ['token20', 'T20', 1800000000000000, CONTRACT_ADDRESS]).slice(2)

    const byteCodeWithParam = returnCompiledContract('ERC20Deployed').bytecode + parametersEncode
    const contractAddressERC20 = await contract.methods.execute(
        1,
        accounts[0],
        0,
        byteCodeWithParam
    ).send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: web3.utils.toWei('0.00003', 'ether')
    })
    console.log(contractAddressERC20.events)
})()
