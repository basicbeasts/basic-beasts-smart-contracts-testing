import '../components/page-panel.js';
import '../components/page-body.js';
import '../components/action-card.js';
import '../components/account-widget.js';
import '../components/text-widget.js';
import '../components/number-widget.js';
import '../components/switch-widget.js';
import '../components/dictionary-widget.js';
import '../components/array-widget.js';

import DappLib from '@decentology/dappstarter-dapplib';
import { LitElement, html, customElement, property } from 'lit-element';

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
        let content = html `
			<page-body
				title="${this.title}"
				category="${this.category}"
				description="${this.description}"
			>
				<!-- FUSD -->

				<action-card
					title="FUSD - Setup Account"
					description="Setup Account to handle FUSD (create FUSD vault)"
					action="FUSDCreateFUSDVault"
					method="post"
					fields="signer"
				>
					<account-widget field="signer" label="Signer">
					</account-widget>
				</action-card>

				<action-card
					title="FUSD - Get Balance"
					description="Get FUSD balance in an account"
					action="FUSDGetFUSDBalance"
					method="get"
					fields="address"
				>
					<account-widget field="address" label="Address">
					</account-widget>
				</action-card>

				<action-card
					title="FUSD - Get Supply"
					description="Get the total supply of FUSD"
					action="FUSDGetFUSDSupply"
					method="get"
					fields=""
				>
				</action-card>

				<action-card
					title="FUSD - Create FUSD Minter"
					description="Create FUSD minter"
					action="FUSDCreateMinter"
					method="post"
					fields="signer"
				>
					<account-widget field="signer" label="Signer">
					</account-widget>
				</action-card>

				<action-card
					title="FUSD - Mint Tokens"
					description="Mint FUSD into an account"
					action="FUSDMintFUSDs"
					method="post"
					fields="to amount"
				>
					<account-widget field="to" label="Recipient">
					</account-widget>
					<text-widget
						field="amount"
						label="Amount"
						placeholder="30.0"
					></text-widget>
				</action-card>

				<!-- BASIC BEASTS -->

				<!-- 1 SETUP ACCOUNT (POST) -->
				<action-card
					title="1 Setup account - Beast Collection"
					description="Setup account to handle Beast NFTs"
					action="basicBeastSetupAccount"
					method="post"
					fields="signer"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
				</action-card>

				<!-- 2 CREATE EVOLUTIONSET (POST) -->
				<action-card
					title="2 Create an EvolutionSet"
					description="Create an EvolutionSet for Basic Beasts. *Only admin."
					action="basicBeastCreateEvolutionSet"
					method="post"
					fields="signer setName"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<text-widget
						field="setName"
						label="EvolutionSet Name"
						placeholder="Saber Evolution Line"
					></text-widget>
				</action-card>

				<!-- 3 GET EVOLUTIONSET NAME (GET) -->
				<action-card
					title="3 Get EvolutionSet Name"
					description="Enter the setID to get the EvolutionSet's name"
					action="basicBeastGetEvolutionSetName"
					method="get"
					fields="setID"
				>
					<text-widget
						field="setID"
						label="setID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- 4 CREATE BEASTTEMPLATE (POST) -->
				<action-card
					title="4 Create a BeastTemplate"
					description="Enter the required fields to create a BeastTemplate. *Only admin."
					action="basicBeastCreateBeastTemplate"
					method="post"
					fields="signer dexNumber name image description rarity skin starLevel asexual ultimateSkill basicSkills elements data"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<text-widget
						field="dexNumber"
						label="Dex number"
						placeholder="9"
					></text-widget>
					<text-widget
						field="name"
						label="Name"
						placeholder="Willi Blue"
					></text-widget>
					<text-widget
						field="image"
						label="Image"
						placeholder="Image url Standard for OpenSea"
					></text-widget>
					<text-widget
						field="description"
						label="Description"
						placeholder="Beast with the coolest name"
					></text-widget>
					<text-widget
						field="rarity"
						label="Rarity"
						placeholder="Fancy Intense"
					></text-widget>
					<text-widget
						field="skin"
						label="Skin"
						placeholder="Mythic"
					></text-widget>
					<text-widget
						field="starLevel"
						label="Star Level"
						placeholder="1"
					></text-widget>
					<text-widget
						field="asexual"
						label="Asexual"
						placeholder="true"
					></text-widget>
					<text-widget
						field="ultimateSkill"
						label="Ultimate Skill"
						placeholder="Silence fart"
					></text-widget>
					<array-widget
						field="basicSkills"
						label="Basic Skills"
						valueLabel="Basic Skill"
						placeholder="Fart"
					></array-widget>
					<dictionary-widget
						field="elements"
						label="Elements"
						objectLabel="Element Object"
						keyplaceholder="Element Name"
						valueplaceholder="false"
					></dictionary-widget>
					<dictionary-widget
						field="data"
						label="Data"
						objectLabel="Data Object"
						keyplaceholder="Jacob"
						valueplaceholder="Rocks"
					></dictionary-widget>
				</action-card>

				<!-- 5 GET BEASTTEMPLATE  (GET) -->
				<action-card
					title="5 Get BeastTemplate"
					description="Enter the BeastTemplateID to get its BeastTemplate Struct. See the result in the browser console."
					action="basicBeastGetBeastTemplate"
					method="get"
					fields="beastTemplateID"
				>
					<text-widget
						field="beastTemplateID"
						label="beastTemplateID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- 6 GET ALL BEASTTEMPLATES  (GET) -->
				<action-card
					title="6 Get all BeastTemplates"
					description="*Contract* See the results in the browser console."
					action="basicBeastGetAllBeastTemplates"
					method="get"
				>
				</action-card>

				<!-- 7 GET ALL BEASTTEMPLATES IN AN EVOLUTIONSET (GET) -->
				<action-card
					title="7 Get All BeastTemplates In An EvolutionSet"
					description="*Contract* See the results in the browser console. beastTemplateID : setID"
					action="basicBeastGetAllBeastTemplatesInAnEvolutionSet"
					method="get"
				>
				</action-card>

				<!-- 8 GET BEASTTEMPLATES IN EVOLUTIONSET (GET) -->
				<action-card
					title="8 Get BeastTemplates In EvolutionSet"
					description="*Set* Return BeastTemplateID for a specific set. See the results in the browser console."
					action="basicBeastGetBeastTemplatesInEvolutionSet"
					method="get"
					fields="setID"
				>
				<text-widget
						field="setID"
						label="Set ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- 9 ADD BEASTTEMPLATE IN EVOLUTIONSET (POST) -->
				<action-card
					title="9 Add BeastTemplate In EvolutionSet"
					description=""
					action="basicBeastAddBeastTemplateToEvolutionSet"
					method="post"
					fields="signer setID beastTemplateID"
				>

				<account-widget
						field="signer"
						label="Signer"
					></account-widget>
				<text-widget
						field="setID"
						label="Set ID"
						placeholder="0"
					></text-widget>

				<text-widget
						field="beastTemplateID"
						label="beastTemplateID"
						placeholder="0"
				></text-widget>
				</action-card>

				<!-- 10 ADD BEASTTEMPLATES IN EVOLUTIONSET (POST) -->
				<action-card
					title="10 Add BeastTemplates In EvolutionSet"
					description=""
					action="basicBeastAddBeastTemplatesToEvolutionSet"
					method="post"
					fields="signer setID beastTemplateID"
				>

				<account-widget
						field="signer"
						label="Signer"
					></account-widget>
				<text-widget
						field="setID"
						label="Set ID"
						placeholder="0"
					></text-widget>

					<array-widget
						field="beastTemplateID"
						label="beastTemplateID"
						valueLabel="beastTemplateID"
						placeholder="0"
					></array-widget>
				></text-widget>
				</action-card>

				<!-- 11 GET BEASTTEMPLATE EVOLUTIONSET (GET) -->
				<action-card
					title="11 Get BeastTemplate EvolutionSet"
					description="*Set* Return the setID that a specific BeastTemplateID belongs."
					action="basicBeastGetBeastTemplateEvolutionSet"
					method="get"
					fields="beastTemplateID"
				>
				<text-widget
						field="beastTemplateID"
						label="beastTemplateID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- 12 REMOVE BEASTTEMPLATE FROM EVOLUTIONSET (POST) -->
				<action-card
					title="12 Remove BeastTemplate from EvolutionSet"
					description="Enter the setID for EvolutionSet and the BeastTemplateID you want to remove."
					action="basicBeastRemoveBeastTemplateFromEvolutionSet"
					method="post"
					fields="signer setID beastTemplateID"
				>
				<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<text-widget
						field="setID"
						label="setID"
						placeholder="0"
					></text-widget>
					<text-widget
						field="beastTemplateID"
						label="beastTemplateID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- 13 REMOVE ALL BEASTTEMPLATES FROM EVOLUTIONSET (POST) -->
				<action-card
					title="13 Remove all BeastTemplates from EvolutionSet"
					description="Enter the setID for EvolutionSet you want to empty."
					action="basicBeastRemoveAllBeastTemplatesFromEvolutionSet"
					method="post"
					fields="signer setID"
				>
				<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<text-widget
						field="setID"
						label="setID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- 14 MINT BEAST (POST) -->
				<action-card
					title="14 Mint Beast"
					description="Enter the required fields to mint a Beast."
					action="basicBeastMintBeast"
					method="post"
					fields="signer setID beastTemplateID matron sire evolvedFrom recipientAddr"
				>
				<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<text-widget
						field="setID"
						label="setID"
						placeholder="0"
					></text-widget>
					<text-widget
						field="beastTemplateID"
						label="beastTemplateID"
						placeholder="0"
					></text-widget>
					<text-widget
						field="matron"
						label="matron"
						placeholder="0"
					></text-widget>
					<text-widget
						field="sire"
						label="sire"
						placeholder="0"
					></text-widget>
					<array-widget
						field="evolvedFrom"
						label="evolvedFrom"
						valueLabel="evolvedFrom"
						placeholder="0"
					></array-widget>
					<account-widget
						field="recipientAddr"
						label="Recipient Address"
					></account-widget>
				</action-card>

				<!-- 15 BATCH MINT BEAST (POST) -->
				<action-card
					title="15 Batch Mint Beast"
					description="Mint a specific Beast x times."
					action="basicBeastBatchMintBeast"
					method="post"
					fields="signer setID beastTemplateID matron sire evolvedFrom quantity recipientAddr"
				>
				<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<text-widget
						field="setID"
						label="setID"
						placeholder="0"
					></text-widget>
					<text-widget
						field="beastTemplateID"
						label="beastTemplateID"
						placeholder="0"
					></text-widget>
					<text-widget
						field="matron"
						label="matron"
						placeholder="0"
					></text-widget>
					<text-widget
						field="sire"
						label="sire"
						placeholder="0"
					></text-widget>
					<array-widget
						field="evolvedFrom"
						label="evolvedFrom"
						valueLabel="evolvedFrom"
						placeholder="0"
					></array-widget>
					<text-widget
						field="quantity"
						label="quantity"
						placeholder="0"
					></text-widget>
					<account-widget
						field="recipientAddr"
						label="Recipient Address"
					></account-widget>
				</action-card>

				<!-- 16 GET TOTAL SUPPLY (GET) -->
				<action-card
					title="16 Get total supply"
					description="Total supply of minted Beast NFTs"
					action="basicBeastGetTotalSupply"
					method="get"
				>
				</action-card>

				<!-- 17 GET COLLECTION OWNED BEASTS IDS (GET) -->
				<action-card
					title="17 Get Collection owned Beasts ids"
					description="Choose the address to see its Collection of Beast NFTs. Return an array with the ids"
					action="basicBeastGetCollectionOwnedBeastsIds"
					method="get"
					fields="account"
				>
				<account-widget
						field="account"
						label="account"
					></account-widget>
				</action-card>

				<!-- 18 GET BEAST ID IN COLLECTION (GET) -->
				<action-card
					title="18 Get Beast id in Collection"
					description="Check whether the Beast id is in an address's Collection. Return true or false."
					action="basicBeastGetBeastIdInCollection"
					method="get"
					fields="account id"
				>
				<account-widget
						field="account"
						label="account"
					></account-widget>
					<text-widget
						field="id"
						label="id"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- 19 LOCK EVOLUTIONSET (POST) -->
				<action-card
					title="19 Lock EvolutionSet"
					description="Lock an EvolutionSet so BeastTemplates cannot be added to it anymore. *Only admin"
					action="basicBeastLockEvolutionSet"
					method="post"
					fields="signer setID"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<text-widget
						field="setID"
						label="setID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- 20 RETIRE BEASTTEMPLATE FROM EVOLUTIONSET (POST) -->
				<action-card
					title="20 Retire BeastTemplate From EvolutionSet"
					description="Enter the BeastTemplateID and the EvolutionSet prevent minting in the future. *Only admin"
					action="basicBeastRetireBeastTemplateFromEvolutionSet"
					method="post"
					fields="signer setID beastTemplateID"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<text-widget
						field="setID"
						label="setID"
						placeholder="0"
					></text-widget>
					<text-widget
						field="beastTemplateID"
						label="beastTemplateID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- 21 RETIRE ALL BEASTTEMPLATES FROM EVOLUTIONSET (POST) -->
				<action-card
					title="21 Retire All BeastTemplates From EvolutionSet"
					description="Enter the EvolutionSet to retire all the BeastTemplates in it. *Only admin"
					action="basicBeastRetireAllBeastTemplatesFromEvolutionSet"
					method="post"
					fields="signer setID"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<text-widget
						field="setID"
						label="setID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- 22 START NEW GENERATION (POST) -->
				<action-card
					title="22 Start new generation"
					description="Enter the EvolutionSet to retire all the BeastTemplates in it. *Only admin"
					action="basicBeastStartNewGeneration"
					method="post"
					fields="signer"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
				</action-card>

				<!-- 23 GET CURRENT GENERATION (POST) -->
				<action-card
					title="23 Get current generation"
					description=""
					action="basicBeastGetCurrentGeneration"
					method="get"
				>
				</action-card>

				<!-- 24 DEPOSIT BEAST NFT (POST) -->
				<action-card
					title="24 Deposit Beast NFT"
					description=""
					action="basicBeastDepositBeastNft"
					method="post"
					fields="signer recipientAddr beastID"
				>
				<account-widget
					field="signer"
					label="signer"
				></account-widget>
					<account-widget
					field="recipientAddr"
					label="recipientAddr"
				></account-widget>
				<text-widget
					field="beastID"
					label="beastID"
					placeholder="0"
				></text-widget>
				</action-card>

				<!-- 25 DEPOSIT BEAST NFTS (POST) -->
				<action-card
					title="25 Deposit Beast NFTs"
					description=""
					action="basicBeastDepositBeastNfts"
					method="post"
					fields="signer recipientAddr beastIDs"
				>

				<account-widget
					field="signer"
					label="signer"
				></account-widget>
					<account-widget
					field="recipientAddr"
					label="recipientAddr"
				></account-widget>
				<array-widget
					field="beastIDs"
					label="beastIDs"
					valueLabel="beastIDs"
					placeholder="0"
				></array-widget>
				</action-card>

				<!-- 26 GET EVOLUTION SET DATA (POST) -->
				<action-card
					title="26 Get EvolutionSet data"
					description="See the result in the browser console."
					action="basicBeastGetEvolutionSetData"
					method="get"
					fields="setID"
				>
				<text-widget
					field="setID"
					label="setID"
					placeholder="0"
				></text-widget>
				</action-card>



				<!-- ADD LINEAGE KEY VALUE PAIR TO STRUCT  (POST) -->
				<action-card
					title="Add lineage key value pair to struct"
					description="*Only admin"
					action="characterxAddLineageKeyValuePair"
					method="post"
					fields="signer lineageKey lineageValue"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<text-widget
						field="lineageKey"
						label="Targaryen"
						placeholder="0"
					></text-widget>
					<text-widget
						field="lineageValue"
						label="true"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- ADD CHARACTER TO SET (POST) -->
				<action-card
					title="Add a character to a set"
					description="*Only admin"
					action="characterxAddCharacterToSet"
					method="post"
					fields="signer setID characterID"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<text-widget
						field="setID"
						label="Set ID"
						placeholder="0"
					></text-widget>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- ADD CHARACTERS TO SET (POST) -->
				<action-card
					title="Add a characters to a set"
					description="*Only admin"
					action="characterxAddCharactersToSet"
					method="post"
					fields="signer setID characters"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<text-widget
						field="setID"
						label="Set ID"
						placeholder="0"
					></text-widget>
					<array-widget
						field="characters"
						label="Characters"
						valueLabel="CharacterID"
						placeholder="0"
					></array-widget>
				</action-card>

				<!-- MINT CHARACTER (POST) -->
				<action-card
					title="Mint a character"
					description="Mint a character. *Only admin."
					action="characterxMintCharacter"
					method="post"
					fields="signer setID characterID recipientAddr"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<text-widget
						field="setID"
						label="Set ID"
						placeholder="0"
					></text-widget>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
					<account-widget
						field="recipientAddr"
						label="Recipient Address"
					></account-widget>
				</action-card>

				<!-- BATCH MINT CHARACTER (POST) -->
				<action-card
					title="Batch mint a character"
					description="*Only admin"
					action="characterxBatchMintCharacter"
					method="post"
					fields="signer setID characterID quantity recipientAddr"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<text-widget
						field="setID"
						label="Set ID"
						placeholder="0"
					></text-widget>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
					<text-widget
						field="quantity"
						label="Quantity"
						placeholder="0"
					></text-widget>
					<account-widget
						field="recipientAddr"
						label="Recipient Address"
					></account-widget>
				</action-card>

				<!-- FULFILL SINGLE (POST) -->
				<action-card
					title="-Fulfill single"
					description="*Only admin."
					action="characterxFulfillSingle"
					method="post"
					fields="signer recipientAddr characterID"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<account-widget
						field="recipientAddr"
						label="Recipient Address"
					></account-widget>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="1"
					></text-widget>
				</action-card>

				<!-- FULFILL PACK (POST) -->
				<action-card
					title="-Fulfill pack"
					description="*Only admin. Array input"
					action="characterxFulfillPack"
					method="post"
					fields="signer recipientAddr characterIDs"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<account-widget
						field="recipientAddr"
						label="Recipient Address"
					></account-widget>
					<array-widget
						field="characterIDs"
						label="CharacterIDs"
						valueLabel="CharacterIDs"
						placeholder="0"
					></array-widget> </action-card
				>yan

				<!-- LOCK SET (POST) -->
				<action-card
					title="Lock a set"
					description="*Only admin"
					action="characterxLockSet"
					method="post"
					fields="signer setID"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<text-widget
						field="setID"
						label="Set ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- RETIRE CHARACTER FROM SET (POST) -->
				<action-card
					title="Retire a character from a set"
					description="*Only admin"
					action="characterxRetireCharacterFromSet"
					method="post"
					fields="signer setID characterID"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<text-widget
						field="setID"
						label="Set ID"
						placeholder="0"
					></text-widget>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- RETIRE ALL CHARACTERS FROM SET (POST) -->
				<action-card
					title="Retire all characters from a set"
					description="*Only admin"
					action="characterxRetireAllCharactersFromSet"
					method="post"
					fields="signer setID"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
					<text-widget
						field="setID"
						label="Set ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- START NEW SERIES (POST) -->
				<action-card
					title="Start new series"
					description="*Only admin"
					action="characterxStartNewSeries"
					method="post"
					fields="signer"
				>
					<account-widget
						field="signer"
						label="Signer"
					></account-widget>
				</action-card>

				<!-- BUYING NFT WITH REFERRAL (POST) -->
				<action-card
					title="Buy NFT with referral"
					description="5% discount for buyer and 5% bonus for referrer"
					action="characterxBuyingNFTWithReferral"
					method="post"
					fields="signer to amount referrer"
				>
					<account-widget
						field="signer"
						label="Buyer"
					></account-widget>
					<account-widget
						field="to"
						label="Receiver"
					></account-widget>
					<text-widget
						field="amount"
						label="Amount"
						placeholder="10.0"
					></text-widget>
					<account-widget
						field="referrer"
						label="Referrer"
					></account-widget>
				</action-card>

				<!-- BUYING NFT WITHOUT REFERRAL (POST) -->
				<!-- Signer is the buyer -->
				<!-- To is the one who receiving the fusd. -->

				<action-card
					title="Buy NFT without referral"
					description=""
					action="characterxBuyingNFTWithoutReferral"
					method="post"
					fields="signer to amount"
				>
					<account-widget
						field="signer"
						label="Buyer"
					></account-widget>
					<account-widget
						field="to"
						label="Receiver"
					></account-widget>
					<text-widget
						field="amount"
						label="Amount"
						placeholder="10.0"
					></text-widget>
				</action-card>

				<!-- GET CHARACTER'S NAME (GET) -->
				<action-card
					title="Get character's name"
					description="Enter characterID"
					action="characterxCharactersGetCharacterName"
					method="get"
					fields="characterID"
				>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- GET CHARACTER'S DESCRIPTION (GET) -->
				<action-card
					title="Get character's description"
					description="Enter characterID"
					action="characterxCharactersGetCharacterDescription"
					method="get"
					fields="characterID"
				>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- GET CHARACTER'S IMAGE (GET) -->
				<action-card
					title="Get character's image"
					description="Enter characterID"
					action="characterxCharactersGetCharacterImage"
					method="get"
					fields="characterID"
				>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- GET CHARACTER'S CREATED FROM 1 (GET) -->
				<action-card
					title="Get character's ancestor 1"
					description="Enter characterID"
					action="characterxCharactersGetCharacterCreatedFrom1"
					method="get"
					fields="characterID"
				>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- GET CHARACTER'S CREATED FROM 2 (GET) -->
				<action-card
					title="Get character's ancestor 2"
					description="Enter characterID"
					action="characterxCharactersGetCharacterCreatedFrom2"
					method="get"
					fields="characterID"
				>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- GET CHARACTER'S SEX (GET) -->
				<action-card
					title="Get character's sex"
					description="Enter characterID"
					action="characterxCharactersGetCharacterSex"
					method="get"
					fields="characterID"
				>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- GET CHARACTER'S RACE (GET) -->
				<action-card
					title="Get character's race"
					description="Enter characterID"
					action="characterxCharactersGetCharacterRace"
					method="get"
					fields="characterID"
				>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- GET CHARACTER'S RARITY (GET) -->
				<action-card
					title="Get character's rarity"
					description="Enter characterID"
					action="characterxCharactersGetCharacterRarity"
					method="get"
					fields="characterID"
				>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- GET CHARACTER'S LINEAGE (GET) -->
				<action-card
					title="Get character's lineage"
					description="Enter characterID"
					action="characterxCharactersGetCharacterLineage"
					method="get"
					fields="characterID"
				>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- GET CHARACTER'S BLOODLINE (GET) -->
				<action-card
					title="Get character's bloodline"
					description="Enter characterID"
					action="characterxCharactersGetCharacterBloodline"
					method="get"
					fields="characterID"
				>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- GET CHARACTER'S ELEMENT (GET) -->
				<action-card
					title="Get character's element"
					description="Enter characterID"
					action="characterxCharactersGetCharacterElement"
					method="get"
					fields="characterID"
				>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- GET TOTAL SUPPLY (GET) -->
				<action-card
					title="Get current supply"
					description="Total minted characters"
					action="characterxGetTotalSupply"
					method="get"
					fields=""
				>
				</action-card>

				<!-- CHARATERS GET ALL CHARACTERS (GET) -->
				<action-card
					title="Get all characters"
					description="Return with array containing struct. See the result in the browser console"
					action="characterxCharactersGetAllCharacters"
					method="get"
					fields=""
				>
				</action-card>

				<!-- CHARACTERS GET NEXT CHARACTER ID (GET) -->
				<action-card
					title="Get the next character ID"
					description=""
					action="characterxCharactersGetNextCharacterID"
					method="get"
					fields=""
				>
				</action-card>

				<!-- CHARATERS GET CHARATER'S DATA (GET) -->
				<action-card
					title="Get character's data"
					description="Enter characterID to get character data"
					action="characterxCharactersGetCharacterData"
					method="get"
					fields="characterID"
				>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- CHARATERS GET CHARATERS DATA FIELD (GET) -->
				<action-card
					title="Get character's data field"
					description="Get value of data dictionary"
					action="characterxCharactersGetCharacterDataField"
					method="get"
					fields="characterID field"
				>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
					<text-widget
						field="field"
						label="Field"
						placeholder=".."
					></text-widget>
				</action-card>

				<!-- CHARATERS GET CHARATERS TRAITS (GET) -->
				<action-card
					title="Get character's traits"
					description=""
					action="characterxCharactersGetCharacterTraits"
					method="get"
					fields="characterID"
				>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- CHARATERS GET CHARATERS TRAITS FIELD (GET) -->
				<action-card
					title="Get character's traits field"
					description=""
					action="characterxCharactersGetCharacterTraitsField"
					method="get"
					fields="characterID field"
				>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
					<text-widget
						field="field"
						label="Field"
						placeholder=".."
					></text-widget>
				</action-card>

				<!-- SETS GET EDITION RETIRED (GET) -->
				<action-card
					title="Sets get edition retired"
					description="Check whether the set edition is retired"
					action="characterxSetsGetEditionRetired"
					method="get"
					fields="setID characterID"
				>
					<text-widget
						field="setID"
						label="Set ID"
						placeholder="0"
					></text-widget>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- SETS GET NEXT SET ID (GET) -->
				<action-card
					title="Sets get next set ID"
					description=""
					action="characterxSetsGetNextSetID"
					method="get"
					fields=""
				>
				</action-card>

				<!-- SETS GET NUM CHARACTERS IN EDITION (GET) -->
				<action-card
					title="Sets get num character in edition"
					description="Return the number of the character that has been minted in the setID"
					action="characterxSetsGetNumCharactersInEdition"
					method="get"
					fields="setID characterID"
				>
					<text-widget
						field="setID"
						label="Set ID"
						placeholder="0"
					></text-widget>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- SETS GET CHARACTERS IN SET (GET) -->
				<action-card
					title="Sets get characters in set"
					description="Display characterID(s) in array"
					action="characterxSetsGetCharactersInSet"
					method="get"
					fields="setID"
				>
					<text-widget
						field="setID"
						label="Set ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- SETS GET SET IDS BY NAME (GET) -->
				<action-card
					title="Sets get set IDs by name - bug"
					description="Display sets IDs in array"
					action="characterxSetsGetSetIDsByName"
					method="get"
					fields="setName"
				>
					<text-widget
						field="setName"
						label="Set name"
						placeholder="Awesome set"
					></text-widget>
				</action-card>

				<!-- SETS GET SET SERIES (GET) -->
				<action-card
					title="Sets get set series"
					description=""
					action="characterxSetsGetSetSeries"
					method="get"
					fields="setID"
				>
					<text-widget
						field="setID"
						label="Set ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- SETS CURRENT SERIES (GET) -->
				<action-card
					title="Get current series"
					description=""
					action="characterxGetCurrentSeries"
					method="get"
					fields=""
				>
				</action-card>

				<!-- SETS GET SET LOCKED (GET) -->
				<action-card
					title="Sets get set locked"
					description=""
					action="characterxSetsGetSetLocked"
					method="get"
					fields="setID"
				>
					<text-widget
						field="setID"
						label="Set ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- COLLECTIONS GET COLLECTION IDS (GET) -->
				<action-card
					title="Collections get collection Ids"
					description="Get a specific account collection. The result id(s) are in order of minted characters"
					action="characterxCollectionsGetCollectionIds"
					method="get"
					fields="account"
				>
					<account-widget
						field="account"
						label="Account"
					></account-widget>
				</action-card>

				<!-- COLLECTIONS GET ID IN COLLECTION (GET) -->
				<action-card
					title="Collections get ID in collection"
					description="Check whether a minted id is in a collection"
					action="characterxCollectionsGetIdInCollection"
					method="get"
					fields="account id"
				>
					<account-widget
						field="account"
						label="Account"
					></account-widget>
					<text-widget
						field="id"
						label="ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- COLLECTIONS GET DATA (GET) -->
				<action-card
					title="Collections get data"
					description=""
					action="characterxCollectionsGetData"
					method="get"
					fields="account id"
				>
					<account-widget
						field="account"
						label="Account"
					></account-widget>
					<text-widget
						field="id"
						label="ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- COLLECTIONS GET DATA FIELD (GET) -->
				<action-card
					title="Collections get data field"
					description="CharacterID == minted id"
					action="characterxCollectionsGetDataField"
					method="get"
					fields="account characterID fieldToSearch"
				>
					<account-widget
						field="account"
						label="Account"
					></account-widget>
					<text-widget
						field="characterID"
						label="Character ID"
						placeholder="0"
					></text-widget>
					<text-widget
						field="fieldToSearch"
						label="Field"
						placeholder=".."
					></text-widget>
				</action-card>

				<!-- COLLECTIONS GET CHARACTER ID (GET) -->
				<action-card
					title="Collections get character ID"
					description=""
					action="characterxCollectionsGetCharacterCharacterID"
					method="get"
					fields="account id"
				>
					<account-widget
						field="account"
						label="Account"
					></account-widget>
					<text-widget
						field="id"
						label="ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- COLLECTIONS GET CHARACTER SERIAL NUM (GET) -->
				<action-card
					title="Collections get character serial number"
					description=""
					action="characterxCollectionsGetCharacterSerialNum"
					method="get"
					fields="account id"
				>
					<account-widget
						field="account"
						label="Account"
					></account-widget>
					<text-widget
						field="id"
						label="ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- COLLECTIONS GET CHARACTER SERIES (GET) -->
				<action-card
					title="Collections get character series"
					description=""
					action="characterxCollectionsGetCharacterSeries"
					method="get"
					fields="account id"
				>
					<account-widget
						field="account"
						label="Account"
					></account-widget>
					<text-widget
						field="id"
						label="ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- COLLECTIONS GET CHARACTER SET ID (GET) -->
				<action-card
					title="Collections get character set id"
					description=""
					action="characterxCollectionsGetCharacterSetID"
					method="get"
					fields="account id"
				>
					<account-widget
						field="account"
						label="Account"
					></account-widget>
					<text-widget
						field="id"
						label="ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- COLLECTIONS GET CHARACTER SET NAME (GET) -->
				<action-card
					title="Collections get character set name"
					description=""
					action="characterxCollectionsGetCharacterSetName"
					method="get"
					fields="account id"
				>
					<account-widget
						field="account"
						label="Account"
					></account-widget>
					<text-widget
						field="id"
						label="ID"
						placeholder="0"
					></text-widget>
				</action-card>

				<!-- COLLECTIONS GET SET CHARACTERS ARE OWNED (GET) -->
				<action-card
					title="Collections get set characters are owned"
					description=""
					action="characterxCollectionsGetSetCharactersAreOwned"
					method="get"
					fields="account setIDs characterIDs"
				>
					<account-widget
						field="account"
						label="Account"
					></account-widget>
					<array-widget
						field="setIDs"
						label="Characters"
						valueLabel="setIDs"
						placeholder="0"
					></array-widget>
					<array-widget
						field="characterIDs"
						label="characterIDs"
						valueLabel="characterIDs"
						placeholder="0"
					></array-widget>
				</action-card>
			</page-body>
			<page-panel id="resultPanel"></page-panel>
		`;

        return content;
    }
}