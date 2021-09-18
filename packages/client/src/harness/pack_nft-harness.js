import "../components/page-panel.js";
import "../components/page-body.js";
import "../components/action-card.js";
import "../components/account-widget.js";
import "../components/text-widget.js";
import "../components/number-widget.js";
import "../components/switch-widget.js";
import "../components/dictionary-widget.js"
import "../components/array-widget.js"

import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('pack-nft-harness')
export default class PackNFTHarness extends LitElement {
  @property()
  title;
  @property()
  category;
  @property()
  description;

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);
  }

  render() {
    let content = html`
      <page-body title="${this.title}" category="${this.category}" description="${this.description}">
      
        <!-- CHARACTERX -->
      
        <!-- SETUP ACCOUNT (POST) -->
        <action-card title="Setup account" description="Setup account to handle CharacterX NFTs"
          action="characterxSetupAccount" method="post" fields="signer">
          <account-widget field="signer" label="Signer"></account-widget>
        </action-card>
      
        <!-- CREATE SET (POST) -->
        <action-card title="Create a set" description="Create a set for characters. *Only admin." action="characterxCreateSet"
          method="post" fields="signer setName">
          <account-widget field="signer" label="Signer"></account-widget>
          <text-widget field="setName" label="Set Name" placeholder="Set Legendaries"></text-widget>
        </action-card>
      
        <!-- SETS GET SET NAME (GET) -->
        <action-card title="Get Set Name" description="Enter the Set ID to get the Set's name" action="characterxGetSetName"
          method="get" fields="setID">
          <text-widget field="setID" label="Set ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- CREATE CHARACTER (POST) -->
        <action-card title="Create a character"
          description="Enter the required fields to create a character. *Only admin. ?NOT SURE -> DAPP_RESULT_STRING"
          action="characterxCreateCharacter" method="post"
          fields="signer name description image createdFrom_1 createdFrom_2 sex race rarity lineage bloodline element traits data">
          <account-widget field="signer" label="Signer"></account-widget>
          <text-widget field="name" label="Name" placeholder="Willi Blue"></text-widget>
          <text-widget field="description" label="Description" placeholder="Legendary with the coolest name"></text-widget>
          <text-widget field="image" label="Image" placeholder="Image url Standard for OpenSea"></text-widget>
          <text-widget field="createdFrom_1" label="Ancestor 1" placeholder="Character ID"></text-widget>
          <text-widget field="createdFrom_2" label="Ancestor 2" placeholder="Character ID"></text-widget>
          <text-widget field="sex" label="Sex" placeholder="Male or female"></text-widget>
          <text-widget field="race" label="Race" placeholder="Yellow"></text-widget>
          <text-widget field="rarity" label="Rarity" placeholder="Fancy Intense"></text-widget>
          <dictionary-widget field="lineage" label="Lineage" objectLabel="Lineage Object" keyplaceholder="Lineage Name"
            valueplaceholder="false"></dictionary-widget>
          <dictionary-widget field="bloodline" label="Bloodline" objectLabel="Bloodline Object"
            keyplaceholder="Bloodline Name" valueplaceholder="false"></dictionary-widget>
          <dictionary-widget field="element" label="Element" objectLabel="Element Object" keyplaceholder="Element Name"
            valueplaceholder="false"></dictionary-widget>
          <dictionary-widget field="traits" label="Traits" objectLabel="Traits Object" keyplaceholder="Colour Hair"
            valueplaceholder="Red"></dictionary-widget>
          <dictionary-widget field="data" label="Data" objectLabel="Data Object" keyplaceholder="Jacob"
            valueplaceholder="Rocks"></dictionary-widget>
        </action-card>
      
        <!-- MINT CHARACTER (POST) -->
        <action-card title="Mint a character" description="Mint a character. *Only admin." action="characterxMintCharacter"
          method="post" fields="signer setID characterID recipientAddr">
          <account-widget field="signer" label="Signer"></account-widget>
          <text-widget field="setID" label="Set ID" placeholder="0"></text-widget>
          <text-widget field="characterID" label="Character ID" placeholder="0"></text-widget>
          <account-widget field="recipientAddr" label="Recipient Address"></account-widget>
        </action-card>
      
        <!-- ADD CHARACTER TO SET (POST) -->
        <action-card title="Add a character to a set" description="*Only admin" action="characterxAddCharacterToSet"
          method="post" fields="signer setID characterID">
          <account-widget field="signer" label="Signer"></account-widget>
          <text-widget field="setID" label="Set ID" placeholder="0"></text-widget>
          <text-widget field="characterID" label="Character ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- ADD CHARACTERS TO SET (POST) -->
        <action-card title="-Add a characters to a set" description="*Only admin" action="characterxAddCharactersToSet"
          method="post" fields="signer setID characters">
          <account-widget field="signer" label="Signer"></account-widget>
          <text-widget field="setID" label="Set ID" placeholder="0"></text-widget>
          <array-widget field="characters" label="Characters" valueLabel="CharacterID" placeholder="0"></array-widget>
        </action-card>
      
      
        <!-- BATCH MINT CHARACTER (POST) -->
        <action-card title="-Batch mint a character" description="*Only admin" action="characterxBatchMintCharacter"
          method="post" fields="signer setID characterID quantity recipientAddr">
          <account-widget field="signer" label="Signer"></account-widget>
          <text-widget field="setID" label="Set ID" placeholder="0"></text-widget>
          <text-widget field="characterID" label="Character ID" placeholder="0"></text-widget>
          <text-widget field="quantity" label="Quantity" placeholder="0"></text-widget>
          <account-widget field="recipientAddr" label="Recipient Address"></account-widget>
        </action-card>
      
        <!-- FULFILL PACK (POST) -->
        <action-card title="-Fulfill pack" description="*Only admin. Array input" action="" method="post"
          fields="recipientAddr characterID1 characterID2 characterID3">
          <account-widget field="recipientAddr" label="Recipient Address"></account-widget>
          <text-widget field="characterID1" label="Character ID" placeholder="1"></text-widget>
          <text-widget field="characterID2" label="Character ID" placeholder="2"></text-widget>
          <text-widget field="characterID3" label="Character ID" placeholder="3"></text-widget>
        </action-card>
      
        <!-- LOCK SET (POST) -->
        <action-card title="Lock a set" description="*Only admin" action="characterxLockSet" method="post"
          fields="signer setID">
          <account-widget field="signer" label="Signer"></account-widget>
          <text-widget field="setID" label="Set ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- RETIRE ALL CHARACTERS FROM SET (POST) -->
        <action-card title="Retire all characters from a set" description="*Only admin"
          action="characterxRetireAllCharactersFromSet" method="post" fields="signer setID">
          <account-widget field="signer" label="Signer"></account-widget>
          <text-widget field="setID" label="Set ID" placeholder="0"></text-widget>
        </action-card>
      
      
        <!-- RETIRE CHARACTER FROM SET (POST) -->
        <action-card title="Retire a character from a set" description="*Only admin" action="characterxRetireCharacterFromSet"
          method="post" fields="signer setID">
          <account-widget field="signer" label="Signer"></account-widget>
          <text-widget field="setID" label="Set ID" placeholder="0"></text-widget>
          <text-widget field="characterID" label="Character ID" placeholder="0"></text-widget>
        </action-card>
      
      
        <!-- START NEW SERIES (POST) -->
        <action-card title="Start new series" description="*Only admin" action="characterxStartNewSeries" method="post"
          fields="signer">
          <account-widget field="signer" label="Signer"></account-widget>
        </action-card>
      
        <!-- TRANSFER ADMIN (POST) -->
        <action-card title="-Transfer admin" description="*Only admin" action="characterxTransferAdmin" method="post"
          fields="signer recipientAddr">
          <account-widget field="signer" label="Signer"></account-widget>
          <account-widget field="recipientAddr" label="Recipient Address"></account-widget>
        </action-card>
      
        <!-- BUYING NFT WITH REFERRAL (POST) -->
        <action-card title="Buy NFT with referral" description="5% discount for buyer and 5% bonus for referrer"
          action="characterxBuyingNFTWithReferral" method="post" fields="amount to referrer">
          <text-widget field="amount" label="Amount" placeholder="10.0"></text-widget>
          <account-widget field="to" label="Buyer"></account-widget>
          <account-widget field="referrer" label="Referrer"></account-widget>
        </action-card>
      
        <!-- BUYING NFT WITHOUT REFERRAL (POST) -->
        <action-card title="Buy NFT without referral" description="" action="characterxBuyingNFTWithoutReferral" method="post"
          fields="amount to">
          <text-widget field="amount" label="Amount" placeholder="10.0"></text-widget>
          <account-widget field="to" label="Buyer"></account-widget>
        </action-card>
      
        <!-- GET CURRENT SERIES (GET) -->
        <action-card title="Get current series" description="" action="characterxGetCurrentSeries" method="get" fields="">
        </action-card>
      
        <!-- GET TOTAL SUPPLY (GET) -->
        <action-card title="Get current supply" description="" action="characterxGetTotalSupply" method="get" fields="">
        </action-card>
      
        <!-- CHARATERS GET ALL CHARACTERS (GET) -->
        <action-card title="Get all characters" description="Return with array." action="characterxCharactersGetAllCharacters"
          method="get" fields="">
        </action-card>
      
        <!-- CHARACTERS GET NEXT CHARACTER ID (GET) -->
        <action-card title="Get the next character ID" description="" action="characterxCharactersGetNextCharacterID"
          method="get" fields="">
        </action-card>
      
        <!-- CHARATERS GET CHARATERS DATA (GET) -->
        <action-card title="-Get the next character's data" description="?NOT SURE -> DAPP_RESULT_STRING"
          action="characterxCharactersGetCharacterData" method="get" fields="characterID">
          <text-widget field="characterID" label="Character ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- CHARATERS GET CHARATERS DATA FIELD (GET) -->
        <action-card title="Get the next character's data field" description=""
          action="characterxCharactersGetCharacterDataField" method="get" fields="characterID field">
          <text-widget field="characterID" label="Character ID" placeholder="0"></text-widget>
          <text-widget field="field" label="Field" placeholder=".."></text-widget>
        </action-card>
      
        <!-- CHARATERS GET CHARATERS TRAITS (GET) -->
        <action-card title="-Get the next character's traits" description="?NOT SURE -> DAPP_RESULT_STRING"
          action="characterxCharactersGetCharacterTraits" method="get" fields="characterID">
          <text-widget field="characterID" label="Character ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- CHARATERS GET CHARATERS TRAITS FIELD (GET) -->
        <action-card title="Get the next character's traits field" description=""
          action="characterxCharactersGetCharacterTraitsField" method="get" fields="characterID field">
          <text-widget field="characterID" label="Character ID" placeholder="0"></text-widget>
          <text-widget field="field" label="Field" placeholder=".."></text-widget>
        </action-card>
      
        <!-- SETS GET EDITION RETIRED (GET) -->
        <action-card title="Sets get edition retired" description="Check whether the set edition is retired"
          action="characterxSetsGetEditionRetired" method="get" fields="setID characterID">
          <text-widget field="setID" label="Set ID" placeholder="0"></text-widget>
          <text-widget field="characterID" label="Character ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- SETS GET NEXT SET ID (GET) -->
        <action-card title="Sets get next set ID" description="" action="characterxSetsGetNextSetID" method="get" fields="">
        </action-card>
      
        <!-- SETS GET NUM CHARACTERS IN EDITION (GET) -->
        <action-card title="Sets get num character in edition" description="" action="characterxSetsGetNumCharactersInEdition"
          method="get" fields="setID characterID">
          <text-widget field="setID" label="Set ID" placeholder="0"></text-widget>
          <text-widget field="characterID" label="Character ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- SETS GET CHARACTERS IN SET (GET) -->
        <action-card title="Sets get characters in set" description="Display in array"
          action="characterxSetsGetCharactersInSet" method="get" fields="setID">
          <text-widget field="setID" label="Set ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- SETS GET SET IDS BY NAME (GET) -->
        <action-card title="Sets get set IDs by name" description="Display sets IDs in array"
          action="characterxSetsGetSetIDsByName" method="get" fields="setName">
          <text-widget field="setName" label="Set name" placeholder="Awesome set"></text-widget>
        </action-card>
      
        <!-- SETS GET SET SERIES (GET) -->
        <action-card title="Sets get set series" description="" action="characterxSetsGetSetSeries" method="get"
          fields="setID">
          <text-widget field="setID" label="Set ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- SETS GET SET LOCKED (GET) -->
        <action-card title="Sets get set locked" description="" action="characterxSetsGetSetLocked" method="get"
          fields="setID">
          <text-widget field="setID" label="Set ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- COLLECTIONS GET COLLECTION IDS (GET) -->
        <action-card title="Collections get collection Ids" description="Get a specific account collection"
          action="characterxCollectionsGetCollectionIds" method="get" fields="account">
          <account-widget field="account" label="Account"></account-widget>
        </action-card>
      
        <!-- COLLECTIONS GET ID IN COLLECTION (GET) -->
        <action-card title="Collections get ID in collection" description="Check whether an id is in a collection"
          action="characterxCollectionsGetIdInCollection" method="get" fields="account id">
          <account-widget field="account" label="Account"></account-widget>
          <text-widget field="id" label="ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- COLLECTIONS GET DATA (GET) -->
        <action-card title="-Collections get data" description="*NOT SURE -> DAPP_RESULT_STRING"
          action="characterxCollectionsGetData" method="get" fields="account id">
          <account-widget field="account" label="Account"></account-widget>
          <text-widget field="id" label="ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- COLLECTIONS GET DATA FIELD (GET) -->
        <action-card title="Collections get data field" description="" action="characterxCollectionsGetDataField" method="get"
          fields="account characterID fieldToSearch">
          <account-widget field="account" label="Account"></account-widget>
          <text-widget field="characterID" label="Character ID" placeholder="0"></text-widget>
          <text-widget field="fieldToSearch" label="Field" placeholder=".."></text-widget>
        </action-card>
      
        <!-- COLLECTIONS GET CHARACTER ID (GET) -->
        <action-card title="Collections get character ID" description="" action="characterxCollectionsGetCharacterCharacterID"
          method="get" fields="account id">
          <account-widget field="account" label="Account"></account-widget>
          <text-widget field="id" label="ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- COLLECTIONS GET CHARACTER SERIAL NUM (GET) -->
        <action-card title="Collections get character serial number" description=""
          action="characterxCollectionsGetCharacterSerialNum" method="get" fields="account id">
          <account-widget field="account" label="Account"></account-widget>
          <text-widget field="id" label="ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- COLLECTIONS GET CHARACTER SERIES (GET) -->
        <action-card title="Collections get character series" description="" action="characterxCollectionsGetCharacterSeries"
          method="get" fields="account id">
          <account-widget field="account" label="Account"></account-widget>
          <text-widget field="id" label="ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- COLLECTIONS GET CHARACTER SET ID (GET) -->
        <action-card title="Collections get character set id" description="" action="characterxCollectionsGetCharacterSetID"
          method="get" fields="account id">
          <account-widget field="account" label="Account"></account-widget>
          <text-widget field="id" label="ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- COLLECTIONS GET CHARACTER SET NAME (GET) -->
        <action-card title="Collections get character set id" description="" action="characterxCollectionsGetCharacterSetName"
          method="get" fields="account id">
          <account-widget field="account" label="Account"></account-widget>
          <text-widget field="id" label="ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- COLLECTIONS GET SET CHARACTERS ARE OWNED (GET) -->
        <action-card title="-Collections get character set id" description="*NOT SURE -> DAPP_RESULT_STRING"
          action="characterxCollectionsGetSetCharactersAreOwned" method="get" fields="account setIDs characterIDs">
          <account-widget field="account" label="Account"></account-widget>
          <text-widget field="setIDs" label="Set IDs" placeholder=".."></text-widget>
          <text-widget field="characterIDs" label="Character IDs" placeholder=".."></text-widget>
        </action-card>
      
        <!-- Flow Token -->
        <action-card title="Flow Token - Mint Flow Tokens" description="Mint Flow Tokens" action="mintFlowTokens"
          method="post" fields="amount recipient">
      
          <text-widget field="amount" label="Amount" placeholder="30.0">
          </text-widget>
      
          <account-widget field="recipient" label="Recipient">
          </account-widget>
      
        </action-card>
      
        <action-card title="Flow Token - Get Flow Balance" description="Get Flow Balance" action="getFlowBalance" method="get"
          fields="account">
      
          <account-widget field="account" label="Account">
          </account-widget>
      
        </action-card>
      
        <action-card title="NFT - Provision an Account for NFTs" description="Gives an account the ability to deal with NFTs"
          action="provisionNFTs" method="post" fields="account">
      
          <account-widget field="account" label="Account">
          </account-widget>
      
        </action-card>
      
        <action-card title="NFT - Get Owned NFTs" description="Get Owned NFTs" action="getNFTsInCollection" method="get"
          fields="account">
      
          <account-widget field="account" label="Account">
          </account-widget>
      
        </action-card>
      
        <action-card title="Packs - Provision an Account for Packs"
          description="Gives an account the ability to deal with Packs" action="provisionPacks" method="post"
          fields="account">
      
          <account-widget field="account" label="Account">
          </account-widget>
      
        </action-card>
      
        <action-card title="Packs - Add Pack Type" description="Add a new Pack Type to mint" action="addPackType"
          method="post" fields="packType numberOfNFTs">
      
          <text-widget field="packType" label="Pack Type" placeholder="5">
          </text-widget>
      
          <text-widget field="numberOfNFTs" label="Number of NFT" placeholder="3">
          </text-widget>
      
        </action-card>
      
        <action-card title="Packs - Mint Pack" description="Mint a Pack into the Admin's account" action="mintPacks"
          method="post" fields="packType numberOfPacks">
      
          <text-widget field="packType" label="Pack Type" placeholder="5">
          </text-widget>
      
          <text-widget field="numberOfPacks" label="Number of Packs" placeholder="4">
          </text-widget>
      
        </action-card>
      
        <action-card title="Packs - Get Owned Packs" description="Get the Pack IDs of all the Packs you own"
          action="getOwnedPacks" method="get" fields="account">
      
          <account-widget field="account" label="Account">
          </account-widget>
      
        </action-card>
      
        <action-card title="Packs - Get Pack Info" description="Get the info of a Pack" action="getPackInfo" method="get"
          fields="id acct">
      
          <text-widget field="id" label="Pack ID" placeholder="0">
          </text-widget>
      
          <account-widget field="acct" label="Account">
          </account-widget>
      
        </action-card>
      
        <action-card title="Packs - Get Pack Type Info" description="Get the info of a Pack Type" action="getPackTypeInfo"
          method="get" fields="packType">
      
          <text-widget field="packType" label="Pack Type" placeholder="5">
          </text-widget>
      
        </action-card>
      
        <action-card title="Packs - Transfer Pack" description="Transfer Pack" action="transferPack" method="post"
          fields="giver id recipient">
      
          <account-widget field="giver" label="Giver">
          </account-widget>
      
          <text-widget field="id" label="Pack ID" placeholder="0">
          </text-widget>
      
          <account-widget field="recipient" label="Recipient">
          </account-widget>
      
        </action-card>
      
        <action-card title="Packs - Open Pack" description="Open Pack" action="openPack" method="post" fields="id recipient">
      
          <text-widget field="id" label="Pack ID" placeholder="0">
          </text-widget>
      
          <account-widget field="recipient" label="Pack Owner">
          </account-widget>
      
        </action-card>
      
        <action-card title="NFT - Transfer NFT" description="Transfer NFT" action="transferNFT" method="post"
          fields="giver id recipient">
      
          <account-widget field="giver" label="Giver">
          </account-widget>
      
          <text-widget field="id" label="ID" placeholder="0">
          </text-widget>
      
          <account-widget field="recipient" label="Recipient">
          </account-widget>
      
        </action-card>
      
        <action-card title="NFT - Get NFT Info" description="Get NFT Info" action="getNFTInfo" method="get"
          fields="account id">
      
          <account-widget field="account" label="Account">
          </account-widget>
      
          <text-widget field="id" label="ID" placeholder="0">
          </text-widget>
      
        </action-card>
      
        <!-- Marketplace -->
      
        <action-card title="Marketplace - Provision an Account for a Marketplace"
          description="Gives an account the ability to interact with a Marketplace" action="provisionMarketplace"
          method="post" fields="account">
      
          <account-widget field="account" label="Account">
          </account-widget>
      
        </action-card>
      
        <action-card title="Marketplace - List Packs for sale"
          description="List Packs for sale. Price must be of type double." action="listPacksForSale" method="post"
          fields="price">
      
          <text-widget field="price" label="Price" placeholder="10.0">
          </text-widget>
      
        </action-card>
      
        <action-card title="Marketplace - Get Available Packs" description="Get the Available Packs to Buy"
          action="getPacksAvailable" method="get" fields="">
        </action-card>
      
        <action-card title="Marketplace - Buy Pack" description="Buy a Pack" action="buyPack" method="post"
          fields="id recipient">
      
          <text-widget field="id" label="Pack ID" placeholder="0">
          </text-widget>
      
          <account-widget field="recipient" label="Recipient">
          </account-widget>
      
        </action-card>
      
      
      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}