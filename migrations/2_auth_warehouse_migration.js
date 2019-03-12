// eslint-disable

const { BN } = require('bn.js');

const AGLDTToken = artifacts.require('./AGLDTToken.sol');
const ASLVTToken = artifacts.require('./ASLVTToken.sol');
const Auth = artifacts.require('./Auth.sol');
const Warehouse = artifacts.require('./Warehouse.sol');

const WH_ADMIN = new BN(1);
const TOKEN_ADMIN = new BN(2);

const addressList = [
  {
    address: '0x2d405fE6Ff207fb0744aDD37F78dDcdF887061a2',
    roleName: 'warehouse',
    roleCode: WH_ADMIN,
  },
  {
    address: '0x39254b3FbADEC4BF351f922458144f5815C23E02',
    roleName: 'token',
    roleCode: TOKEN_ADMIN,
  },
  {
    address: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
    roleName: 'warehouse',
    roleCode: WH_ADMIN,
  },
  {
    address: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
    roleName: 'warehouse',
    roleCode: WH_ADMIN,
  },
  {
    address: '0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc',
    roleName: 'token',
    roleCode: TOKEN_ADMIN,
  },
  {
    address: '0x3e5e9111ae8eb78fe1cc3bb8915d5d461f3ef9a9',
    roleName: 'token',
    roleCode: TOKEN_ADMIN,
  },
];

const entryList = [
  {
    batchID: 'c2eefc1f351d8bc7e0835389363a959b61818a9fb7e2afa2cdd646dbd9b7f64e',
    code: 1,
    total: 3957,
    // eslint-disable-next-line quotes, max-len
    attachments: `{stock:{size:659,hash:'Qmaj2csz81JsT39j58AzzCgEen8uuQHSKFsHMWdQ6SkF6s',link:'/draft/feedc4c7b96e3ea8f16c10578e013460/stock'},proof:{size:48257,hash:'Qmax56vsdDRijRSRGwVxBugA2EdCqDSbCeLnfm6VQmsZ8c',link:'/draft/feedc4c7b96e3ea8f16c10578e013460/proof'},audit:{size:48257,hash:'Qmax56vsdDRijRSRGwVxBugA2EdCqDSbCeLnfm6VQmsZ8c',link:'/draft/feedc4c7b96e3ea8f16c10578e013460/audit'},bearr:{size:48257,hash:'Qmax56vsdDRijRSRGwVxBugA2EdCqDSbCeLnfm6VQmsZ8c',link:'/draft/feedc4c7b96e3ea8f16c10578e013460/bearr'},globl:{size:48257,hash:'Qmax56vsdDRijRSRGwVxBugA2EdCqDSbCeLnfm6VQmsZ8c',link:'/draft/feedc4c7b96e3ea8f16c10578e013460/globl'}}`,
    // eslint-disable-next-line quotes, max-len
    distribution: `[{pmType:'au',palNo:'EV 1',seal:'123456-457',quantity:1,articleNo:'1100080',article:'100g Goldbarren',barNo:'VG56876',brand:'Valcambi SA',kgGrs:0.1,ozGrs:3.21507,kgNet:0.09999,ozNet:3.21475,fineness:'0.9999',location:'Triesen UG / Tresor A /    '},{pmType:'au',palNo:'EV 1',seal:'123456-457',quantity:1,articleNo:'1100090',article:'250g Goldbarren',barNo:'987653',brand:'Argor Heraeus SA    ',kgGrs:0.25,ozGrs:8.03769,kgNet:0.24998,ozNet:8.03689,fineness:'0.9999',location:'Triesen UG / Tresor A /    '},{pmType:'au',palNo:'EV 1',seal:'123456-457',quantity:1,articleNo:'1100100',article:'500g Goldbarren',barNo:'VG687932',brand:'Valcambi SA',kgGrs:0.5,ozGrs:16.07537,kgNet:0.49995,ozNet:16.07376,fineness:'0.9999',location:'Triesen UG / Tresor A /    '},{pmType:'au',palNo:'EV 1',seal:'123456-457',quantity:100,articleNo:'1257010',article:'Südafrika Krügerrand Goldmünze 1oz',barNo:'',brand:'',kgGrs:3.39298,ozGrs:109.08694,kgNet:3.11034,ozNet:100,fineness:'0.9167',location:'Triesen UG / Tresor A /    '}]`,
  },
  {
    batchID: '14d19329d03c928a97867885cb6c0020e7b1baaeda987d9bc3e7d091a937ec69',
    code: 2,
    total: 32102,
    // eslint-disable-next-line quotes, max-len
    attachments: "{stock:{size:403,hash:'QmZvfYm72RL8LqfmFJdCpRiC84oESq1wWZNuB15ka6Rkcv',link:'/draft/feedc4c7b96e3ea8f16c10578e013c6e/stock'},proof:{size:48257,hash:'Qmax56vsdDRijRSRGwVxBugA2EdCqDSbCeLnfm6VQmsZ8c',link:'/draft/feedc4c7b96e3ea8f16c10578e013c6e/proof'},audit:{size:48257,hash:'Qmax56vsdDRijRSRGwVxBugA2EdCqDSbCeLnfm6VQmsZ8c',link:'/draft/feedc4c7b96e3ea8f16c10578e013c6e/audit'},bearr:{size:48257,hash:'Qmax56vsdDRijRSRGwVxBugA2EdCqDSbCeLnfm6VQmsZ8c',link:'/draft/feedc4c7b96e3ea8f16c10578e013c6e/bearr'},globl:{size:48257,hash:'Qmax56vsdDRijRSRGwVxBugA2EdCqDSbCeLnfm6VQmsZ8c',link:'/draft/feedc4c7b96e3ea8f16c10578e013c6e/globl'}}",
    // eslint-disable-next-line quotes, max-len
    distribution: "[{pmType:'ag',palNo:'EV OZL 1',seal:'963852-853',quantity:1,articleNo:'2100040',article:'1000g Silberbarren  ',barNo:'6633221',brand:'Argor Heraeus SA    ',kgGrs:1,ozGrs:32.15075,kgNet:0.999,ozNet:32.1186,fineness:'0.9990',location:'Triesen OZL / Tresor B /    '},{pmType:'ag',palNo:'EV OZL 1',seal:'987654-655',quantity:1000,articleNo:'2260010',article:'American Eagle Silbermünze 1oz',barNo:'',brand:'',kgGrs:31.13461,ozGrs:1001.001,kgNet:31.10348,ozNet:1000,fineness:'0.9990',location:'Triesen OZL / Tresor B /   '}]",
  },
];

module.exports = async (deployer, network, accounts) => {
  const owner = accounts[0];

  await deployer.deploy(AGLDTToken);
  await deployer.deploy(ASLVTToken);

  await deployer.deploy(
    Auth,
    AGLDTToken.address,
    ASLVTToken.address);
  const auth = await Auth.deployed();

  await deployer.deploy(
    Warehouse,
    Auth.address,
    AGLDTToken.address,
    ASLVTToken.address);
  const warehouse = await Warehouse.deployed();

  if (network !== 'development') {
    console.log('===============================================');
    console.log('LOADING INITIAL DATA');
    console.log('===============================================\n');

    console.log('1/3: Setup\n');
    console.log(`Adding deployer address (${owner}) as warehouse admin`);
    await auth.add(owner, WH_ADMIN);
    console.log('Complete\n');

    console.log('2/3: Auth\n');
    console.log('Adding initial admin addresses');
    await Promise.all(addressList.map(el => {
      console.log(`Adding address ${el.address} as ${el.roleName} admin`);
      return auth.add(
        el.address,
        el.roleCode,
      );
    }));
    console.log('Complete\n');

    console.log('2/3: Warehouse\n');
    console.log('Adding initial warehouse entries');
    await Promise.all(entryList.map(el => {
      console.log(`Adding entry ${JSON.stringify(el)})`);
      return warehouse.createEntry(
        el.batchID,
        el.code,
        el.total,
        el.attachments,
        el.distribution,
      );
    }));
    console.log('Complete\n');

    console.log('3/3: Cleanup\n');
    console.log(`Removing deployer address (${owner}) from warehouse admins`);
    await auth.remove(owner);
    console.log('OK\n');

    console.log('===============================================');
    console.log('FINISHED INIT');
    console.log('===============================================\n');
  }
};
