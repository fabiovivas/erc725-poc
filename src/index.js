const RPC_ENDPOINT = 'http://127.0.0.1:7545';
const CONTRACT_ADDRESS = '0xF6f2B4257A0C619399C141141e8C81632520F4d6';

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);
const web3 = new Web3(provider);
const { ERC725 } = require('@erc725/erc725.js');
const fs = require('fs')
const path = require('path')

const getInstance = () => {
    const schema2 = [
        {
            name: 'SupportedStandards:LSP3UniversalProfile',
            key: '0xeafec4d89fa9619884b6b89135626455000000000000000000000000abe425d6',
            keyType: 'Mapping',
            valueContent: '0xabe425d6',
            valueType: 'bytes',
        },
        {
            name: 'LSP3Profile',
            key: '0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5',
            keyType: 'Singleton',
            valueContent: 'JSONURL',
            valueType: 'bytes',
        },
        {
            name: 'LSP1UniversalReceiverDelegate',
            key: '0x0cfc51aec37c55a4d0b1a65c6255c4bf2fbdf6277f3cc0730c45b828b6db8b47',
            keyType: 'Singleton',
            valueContent: 'Address',
            valueType: 'address',
        },
        {
            name: 'LSP3IssuedAssets[]',
            key: '0x3a47ab5bd3a594c3a8995f8fa58d0876c96819ca4516bd76100c92462f2f9dc0',
            keyType: 'Array',
            valueContent: 'Address',
            valueType: 'address',
        },
    ];

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

const profileJson = {
    LSP3Profile: {
        asdf: 'asdf'
    },
};


(async () => {
    const personal = web3.eth.personal
    const accounts = await personal.getAccounts()

    //////////////////////WRITING DATA/////////////////////////////////////////

    const data = { Doc: '29047369807' }
    const myERC725 = getInstance();
    const encodedDataOneKey = myERC725.encodeData(data)
    console.log(encodedDataOneKey)

    const returnCompiledContract = () => {
        const pathArtifact = path.join(__dirname, '../artifacts/ERC725.json')
        const artifact = fs.readFileSync(path.resolve(pathArtifact), 'utf8')
        return JSON.parse(artifact)
    }
    const contract = new web3.eth.Contract(returnCompiledContract().abi, CONTRACT_ADDRESS)
    contract.setProvider(RPC_ENDPOINT)
    const transaction = await contract.methods.setData(
        [encodedDataOneKey.Doc.key],
        [encodedDataOneKey.Doc.value]
    ).send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: web3.utils.toWei('0.00003', 'ether')
    })

    //////////////////////READING DATA/////////////////////////////////////////

    const dataKey = await contract.methods.getData([encodedDataOneKey.Doc.key]).call()
    console.log(dataKey)

    //////////////////////GET DATA/////////////////////////////////////////
    const dataAllKeys = await myERC725.fetchData()
    console.log(dataAllKeys)
})()
