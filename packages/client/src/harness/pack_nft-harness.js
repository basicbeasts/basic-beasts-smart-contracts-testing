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
		let content = html`
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
						placeholder="1"
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
						placeholder="Common"
					></text-widget>
					<text-widget
						field="skin"
						label="Skin"
						placeholder="Shiny Gold"
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
						placeholder="Silent fart"
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
						placeholder="1"
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
					description="*Set* Return BeastTemplateID for a specific set."
					action="basicBeastGetBeastTemplatesInEvolutionSet"
					method="get"
					fields="setID"
				>
				<text-widget
						field="setID"
						label="Set ID"
						placeholder="1"
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
						placeholder="1"
					></text-widget>

				<text-widget
						field="beastTemplateID"
						label="beastTemplateID"
						placeholder="1"
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
						placeholder="1"
					></text-widget>

					<array-widget
						field="beastTemplateID"
						label="beastTemplateID"
						valueLabel="beastTemplateID"
						placeholder="1"
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
						placeholder="1"
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
						placeholder="1"
					></text-widget>
					<text-widget
						field="beastTemplateID"
						label="beastTemplateID"
						placeholder="1"
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
						placeholder="1"
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
						placeholder="1"
					></text-widget>
					<text-widget
						field="beastTemplateID"
						label="beastTemplateID"
						placeholder="1"
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
						placeholder="1"
					></text-widget>
					<text-widget
						field="beastTemplateID"
						label="beastTemplateID"
						placeholder="1"
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
						placeholder="1"
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
						placeholder="1"
					></text-widget>
					<text-widget
						field="beastTemplateID"
						label="beastTemplateID"
						placeholder="1"
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
						placeholder="1"
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
					placeholder="1"
				></text-widget>
				</action-card>



				
			</page-body>
			<page-panel id="resultPanel"></page-panel>
		`;

		return content;
	}
}
