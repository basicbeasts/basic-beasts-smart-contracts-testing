// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/interactions CHANGES
// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN
// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

const fcl = require("@onflow/fcl");

module.exports = class DappTransactions {

	static FUSD_create_FUSD_minter() {
		return fcl.transaction`

import FUSD from 0xe223d8a629e49c68

transaction {
  prepare (acct: AuthAccount) {
    let adminRef = acct.borrow<&FUSD.Administrator>(from: FUSD.AdminStoragePath) ?? panic("Could not borrow reference")
    acct.save(<- adminRef.createNewMinter(), to: /storage/fusdMinter)
  }
}
		`;
	}

	static FUSD_create_FUSD_vault() {
		return fcl.transaction`

import FungibleToken from 0x9a0766d93b6608b7
import FUSD from 0xe223d8a629e49c68

transaction {
  prepare(signer: AuthAccount) {

    if(signer.borrow<&FUSD.Vault>(from: /storage/fusdVault) != nil) {
      return
    }
  
    signer.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)

    signer.link<&FUSD.Vault{FungibleToken.Receiver}>(
      /public/fusdReceiver,
      target: /storage/fusdVault
    )

    signer.link<&FUSD.Vault{FungibleToken.Balance}>(
      /public/fusdBalance,
      target: /storage/fusdVault
    )
  }
}
		`;
	}

	static FUSD_mint_FUSDs() {
		return fcl.transaction`

import FungibleToken from 0x9a0766d93b6608b7
import FUSD from 0xe223d8a629e49c68

transaction (to: Address, amount: UFix64) {
  let sentVault: @FungibleToken.Vault

  prepare(signer: AuthAccount) {
    let minterRef = signer.borrow<&FUSD.Minter>(from: /storage/fusdMinter) ?? panic("Cannot borrow reference")
    self.sentVault <- minterRef.mintTokens(amount: amount)
  }

  execute {
    let recipient = getAccount(to)
    let receiverRef = recipient.getCapability(/public/fusdReceiver).borrow<&{FungibleToken.Receiver}>()
            ?? panic("Could not borrow receiver reference to the recipient's Vault")

    // Deposit the withdrawn tokens in the recipient's receiver
    receiverRef.deposit(from: <-self.sentVault)
  }
}
		`;
	}

	static flowtoken_mint_flow_tokens() {
		return fcl.transaction`
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7

// Mints FlowTokens

transaction(recipient: Address, amount: UFix64) {
    let tokenAdmin: &FlowToken.Administrator
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(acct: AuthAccount) {
        // NOTE: acct MUST be the service account in the wallet. 
        // This borrows a FlowToken Administrator resource reference to mint FlowToken.
        self.tokenAdmin = acct.borrow<&FlowToken.Administrator>(from: /storage/flowTokenAdmin)
            ?? panic("Signer is not the token admin")

        // Borrows the recipient's FlowToken Vault
        self.tokenReceiver = getAccount(recipient)
            .getCapability(/public/flowTokenReceiver)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")
    }

    execute {
        // Creates a new minter
        let minter <- self.tokenAdmin.createNewMinter(allowedAmount: amount)
        // Mints FlowToken and receives a Vault with the FlowToken
        let mintedVault <- minter.mintTokens(amount: amount)

        // Deposits the Vault filled with FlowToken into the receiver's 
        // FlowToken Vault
        self.tokenReceiver.deposit(from: <-mintedVault)

        destroy minter
    }
}
		`;
	}

	static basicbeast_add_beastTemplate_to_evolutionSet() {
		return fcl.transaction`
import BasicBeast from 0x4742010dbfe107da

transaction(setID: UInt32, beastTemplateID: UInt32) {
    let adminRef: &BasicBeast.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath) 
            ?? panic("Could not borrow a reference to the Admin resource")
    }

    execute {
        let setRef = self.adminRef.borrowEvolutionSet(setID: setID)

        setRef.addBeastTemplate(beastTemplateID: beastTemplateID)
    }

    post {
        BasicBeast.getBeastTemplatesInSet(setID: setID)!.contains(beastTemplateID):
            "Set does not contain beastTemplateID"
    }
}
		`;
	}

	static basicbeast_batch_mint_beast() {
		return fcl.transaction`
import BasicBeast from 0x4742010dbfe107da

transaction(setID: UInt32, beastTemplateID: UInt32, matron: UInt64, sire: UInt64, evolvedFrom: [UInt64], quantity: UInt64, recipientAddr: Address) {
    
    let adminRef: &BasicBeast.Admin

    prepare(acct: AuthAccount) {

        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath)!

    }

    execute {
        let setRef = self.adminRef.borrowEvolutionSet(setID: setID)

        let beastTemplateToMint = BasicBeast.getBeastTemplate(beastTemplateID: beastTemplateID)!

        if beastTemplateToMint == nil {
            panic("BeastTemplate does not exist")
        }

        let collection <- setRef.batchMintBeast(beastTemplate: beastTemplateToMint, matron: matron, sire: sire, evolvedFrom: evolvedFrom, quantity: quantity)

        let recipient = getAccount(recipientAddr)

        let receiverRef = recipient.getCapability(BasicBeast.CollectionPublicPath).borrow<&{BasicBeast.BeastCollectionPublic}>()
            ?? panic("Cannot borrow a reference to the recipient's collection")

        receiverRef.batchDeposit(tokens: <-collection)
    }
}
		`;
	}

	static basicbeast_add_beastTemplates_to_evolutionSet() {
		return fcl.transaction`
import BasicBeast from 0x4742010dbfe107da

transaction(setID: UInt32, beastTemplateIDs: [UInt32]) {

    let adminRef: &BasicBeast.Admin
    
    prepare(acct: AuthAccount) {

        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath)!

    }

    execute {
        let setRef = self.adminRef.borrowEvolutionSet(setID: setID)

        setRef.addBeastTemplates(beastTemplateIDs: beastTemplateIDs)
    }
}
		`;
	}

	static basicbeast_create_beastTemplate() {
		return fcl.transaction`
import BasicBeast from 0x4742010dbfe107da

transaction(
            dexNumber: UInt32,
            name: String, 
            image: String,
            description: String,
            rarity: String,
            skin: String,
            starLevel: UInt32,
            asexual: Bool,
            ultimateSkill: String,
            basicSkills: [String],
            elements: {String: Bool},
            data: {String: String}
    ) {
    let adminRef: &BasicBeast.Admin
    let currentBeastTemplateID: UInt32

    prepare(acct: AuthAccount) {
        self.currentBeastTemplateID = BasicBeast.nextBeastTemplateID;
        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath)
            ?? panic("No admin resource in storage")
    }
    execute {
        self.adminRef.createBeastTemplate(
                                        dexNumber: dexNumber,
                                        name: name, 
                                        image: image,
                                        description: description,
                                        rarity: rarity,
                                        skin: skin,
                                        starLevel: starLevel,
                                        asexual: asexual,
                                        ultimateSkill: ultimateSkill,
                                        basicSkills: basicSkills,
                                        elements: elements,
                                        data: data
        )
    }

    post {
        BasicBeast.getBeastTemplate(beastTemplateID: self.currentBeastTemplateID) != nil:
            "BeastTemplate doesn't exist"
    }
            }
		`;
	}

	static basicbeast_create_evolutionSet() {
		return fcl.transaction`
import BasicBeast from 0x4742010dbfe107da

transaction(setName: String) {
    let adminRef: &BasicBeast.Admin
    let currentSetID: UInt32
    
    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath)
            ?? panic("Couldn't borrow a reference to the Admin resource")
            self.currentSetID = BasicBeast.nextSetID;
    }

    execute {
        self.adminRef.createEvolutionSet(name: setName)
    }

    post {
        BasicBeast.getEvolutionSetName(setID: self.currentSetID) == setName:
            "Couldn't find the specified set"
    }
}
		`;
	}

	static basicbeast_deposit_beast_nft() {
		return fcl.transaction`
import NonFungibleToken from 0x631e88ae7f1d7c20
import BasicBeast from 0x4742010dbfe107da

transaction(recipientAddr: Address, beastID: UInt64) {
    
    prepare(acct: AuthAccount) {
        let recipient = getAccount(recipientAddr)

        let receiverRef = recipient.getCapability(BasicBeast.CollectionPublicPath)
            .borrow<&{BasicBeast.BeastCollectionPublic}>()
                ?? panic("Couldn't borrow reference to Receiver's collection")
    

        if let collection = acct.borrow<&BasicBeast.Collection>(from: BasicBeast.CollectionStoragePath) {
            receiverRef.deposit(token: <-collection.withdraw(withdrawID: beastID))
        }

    }
}
		`;
	}

	static basicbeast_fulfill_pack() {
		return fcl.transaction`
import NonFungibleToken from 0x631e88ae7f1d7c20
import CharacterX from 0x0

transaction(recipientAddr: Address, characterIDs: [UInt64]) {
    
    prepare(acct: AuthAccount) {
        let recipient = getAccount(recipientAddr)

        let receiverRef = recipient.getCapability(CharacterX.CollectionPublicPath)
            .borrow<&{CharacterX.CharacterCollectionPublic}>()
                ?? panic("Couldn't borrow reference to Receiver's collection")
    

        if let collection = acct.borrow<&CharacterX.Collection>(from: CharacterX.CollectionStoragePath) {
            receiverRef.batchDeposit(tokens: <-collection.batchWithdraw(ids: characterIDs))
        }

    }
}
		`;
	}

	static basicbeast_deposit_beast_nfts() {
		return fcl.transaction`
import NonFungibleToken from 0x631e88ae7f1d7c20
import BasicBeast from 0x4742010dbfe107da

transaction(recipientAddr: Address, beastIDs: [UInt64]) {
    
    prepare(acct: AuthAccount) {
        let recipient = getAccount(recipientAddr)

        let receiverRef = recipient.getCapability(BasicBeast.CollectionPublicPath)
            .borrow<&{BasicBeast.BeastCollectionPublic}>()
                ?? panic("Couldn't borrow reference to Receiver's collection")
    

        if let collection = acct.borrow<&BasicBeast.Collection>(from: BasicBeast.CollectionStoragePath) {
            receiverRef.batchDeposit(tokens: <-collection.batchWithdraw(ids: beastIDs))
        }

    }
}
		`;
	}

	static basicbeast_fulfill_single() {
		return fcl.transaction`
import NonFungibleToken from 0x631e88ae7f1d7c20
import CharacterX from 0x0

transaction(recipientAddr: Address, characterID: UInt64) {
    
    prepare(acct: AuthAccount) {
        let recipient = getAccount(recipientAddr)

        let receiverRef = recipient.getCapability(CharacterX.CollectionPublicPath)
            .borrow<&{CharacterX.CharacterCollectionPublic}>()
                ?? panic("Couldn't borrow reference to Receiver's collection")
    

        if let collection = acct.borrow<&CharacterX.Collection>(from: CharacterX.CollectionStoragePath) {
            receiverRef.deposit(token: <-collection.withdraw(withdrawID: characterID))
        }

    }
}
		`;
	}

	static basicbeast_lock_evolutionSet() {
		return fcl.transaction`
import BasicBeast from 0x4742010dbfe107da

transaction(setID: UInt32) {
    let adminRef: &BasicBeast.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath)
            ?? panic("No Admin resource in storage")
    }

    execute {
        let setRef = self.adminRef.borrowEvolutionSet(setID: setID)
        setRef.lock()
    }

    post {
        BasicBeast.isEvolutionSetLocked(setID: setID)!:
            "EvolutionSet didn't lock"
    }
}
		`;
	}

	static basicbeast_mint_beast() {
		return fcl.transaction`
import BasicBeast from 0x4742010dbfe107da

transaction(setID: UInt32, beastTemplateID: UInt32, matron: UInt64, sire: UInt64, evolvedFrom: [UInt64], recipientAddr: Address) {
    let adminRef: &BasicBeast.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath)!
    }

    execute {
        let setRef = self.adminRef.borrowEvolutionSet(setID: setID)

        let beastTemplateToMint = BasicBeast.getBeastTemplate(beastTemplateID: beastTemplateID)!

        if beastTemplateToMint == nil {
            panic("BeastTemplate does not exist")
        }

        let newMintedBeast <- setRef.mintBeast(
                                                beastTemplate: beastTemplateToMint, 
                                                matron: matron, 
                                                sire: sire, 
                                                evolvedFrom: evolvedFrom
        )

        let recipient = getAccount(recipientAddr)

        let receiverRef = recipient.getCapability(BasicBeast.CollectionPublicPath).borrow<&{BasicBeast.BeastCollectionPublic}>()
            ?? panic("Can't borrow a reference to the Recipient's Beast collection")

        receiverRef.deposit(token: <-newMintedBeast)
    }
}
		`;
	}

	static basicbeast_remove_all_beastTemplates_from_evolutionSet() {
		return fcl.transaction`
import BasicBeast from 0x4742010dbfe107da

transaction(setID: UInt32) {
    let adminRef: &BasicBeast.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath)
            ?? panic("No Admin resource in storage")
    }

    execute {
        let setRef = self.adminRef.borrowEvolutionSet(setID: setID)

        setRef.removeAllBeastTemplates()
    }

    post {
        BasicBeast.getBeastTemplatesInSet(setID: setID)!.length == 0:
            "BeastTemplates are not removed"
    }
}
		`;
	}

	static basicbeast_remove_beastTemplate_from_evolutionSet() {
		return fcl.transaction`
import BasicBeast from 0x4742010dbfe107da

transaction(setID: UInt32, beastTemplateID: UInt32) {
    let adminRef: &BasicBeast.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath)
            ?? panic("No Admin resource in storage")
    }

    execute {
        let setRef = self.adminRef.borrowEvolutionSet(setID: setID)

        setRef.removeBeastTemplate(beastTemplateID: beastTemplateID)
    }

    post {
        BasicBeast.getBeastTemplatesInSet(setID: setID)!.contains(beastTemplateID) == false:
            "BeastTemplate is not removed"
    }
}
		`;
	}

	static basicbeast_retire_all_beastTemplates_from_evolutionSet() {
		return fcl.transaction`
import BasicBeast from 0x4742010dbfe107da

transaction(setID: UInt32) {
    let adminRef: &BasicBeast.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath)
            ?? panic("No Admin resource in storage")
    }

    execute {
        let setRef = self.adminRef.borrowEvolutionSet(setID: setID)

        setRef.retireAllBeastTemplates()
    }

}
		`;
	}

	static basicbeast_retire_beastTemplate_from_evolutionSet() {
		return fcl.transaction`
import BasicBeast from 0x4742010dbfe107da

transaction(setID: UInt32, beastTemplateID: UInt32) {
    let adminRef: &BasicBeast.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath)
            ?? panic("No Admin resource in storage")
    }

    execute {
        let setRef = self.adminRef.borrowEvolutionSet(setID: setID)

        setRef.retireBeastTemplate(beastTemplateID: beastTemplateID)
    }

    post {
        BasicBeast.isEditionRetired(setID: setID, beastTemplateID: beastTemplateID) == true:
            "BeastTemplate is not retired"
    }
}
		`;
	}

	static basicbeast_setup_account() {
		return fcl.transaction`
import BasicBeast from 0x4742010dbfe107da

transaction() {

    prepare(acct: AuthAccount) {

        if acct.borrow<&BasicBeast.Collection>(from: BasicBeast.CollectionStoragePath) == nil {

            let collection <- BasicBeast.createEmptyCollection() as! @BasicBeast.Collection

            acct.save(<- collection, to: BasicBeast.CollectionStoragePath)

            acct.link<&{BasicBeast.BeastCollectionPublic}>(BasicBeast.CollectionPublicPath, target: BasicBeast.CollectionStoragePath)
        }

    }
}


		`;
	}

	static basicbeast_start_new_generation() {
		return fcl.transaction`
import BasicBeast from 0x4742010dbfe107da

transaction {

    let adminRef: &BasicBeast.Admin
    let currentGeneration: UInt32

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath)
            ?? panic("No Admin resource in storage")

        self.currentGeneration = BasicBeast.currentGeneration

    }

    execute {
        self.adminRef.startNewGeneration()
    }

    post {
        BasicBeast.currentGeneration == self.currentGeneration + 1 as UInt32:
            "New Generation is not started"
    }
}
		`;
	}

	static characterx_Buying_a_NBATS_Pack() {
		return fcl.transaction`
import FungibleToken from 0x9a0766d93b6608b7

transaction(amount: UFix64, to: Address) {
    let vault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {
        self.vault <- signer.borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!.withdraw(amount: amount)
    }

    execute {
        getAccount(to).getCapability(/public/flowTokenReceiver)!.borrow<&{FungibleToken.Receiver}>()!
            .deposit(from: <-self.vault)
    }
}
		`;
	}

	static characterx_add_character_to_set() {
		return fcl.transaction`
//TODO: Do this for all transactions check flowscan how it is used and whether improvements have been made.

import CharacterX from 0x0

transaction(setID: UInt32, characterID: UInt32) {
    let adminRef: &CharacterX.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath) 
            ?? panic("Could not borrow a reference to the Admin resource")
    }

    execute {
        let setRef = self.adminRef.borrowSet(setID: setID)

        setRef.addCharacter(characterID: characterID)
    }

    post {
        CharacterX.getCharactersInSet(setID: setID)!.contains(characterID):
            "Set does not contain characterID"
    }
}
		`;
	}

	static characterx_add_characters_to_set() {
		return fcl.transaction`
import CharacterX from 0x0

transaction(setID: UInt32, characters: [UInt32]) {

    let adminRef: &CharacterX.Admin
    
    prepare(acct: AuthAccount) {

        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)!

    }

    execute {
        let setRef = self.adminRef.borrowSet(setID: setID)

        setRef.addCharacters(characterIDs: characters)
    }
}
		`;
	}

	static characterx_add_lineage_key_value_pair() {
		return fcl.transaction`
import CharacterX from 0x0

transaction(lineageKey: String, lineageValue: Bool) {
    let adminRef: &CharacterX.Admin
    let lineage: {String: Bool}
    
    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)
            ?? panic("Couldn't borrow a reference to the Admin resource")
    }

    execute {
        self.adminRef.CharacterY.addLineageKeyVaulePair(lineageKey: lineageKey, lineageValue: lineageValue)
    }
/*
    post {
        CharacterX.getSetName(setID: self.currentSetID) == setName:
            "Couldn't find the specified set"
    }*/
}
		`;
	}

	static characterx_batch_mint_character() {
		return fcl.transaction`
import CharacterX from 0x0

transaction(setID: UInt32, characterID: UInt32, quantity: UInt64, recipientAddr: Address) {
    
    let adminRef: &CharacterX.Admin

    prepare(acct: AuthAccount) {

        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)!

    }

    execute {
        let setRef = self.adminRef.borrowSet(setID: setID)

        let collection <- setRef.batchMintCharacter(characterID: characterID, quantity: quantity)

        let recipient = getAccount(recipientAddr)

        let receiverRef = recipient.getCapability(CharacterX.CollectionPublicPath).borrow<&{CharacterX.CharacterCollectionPublic}>()
            ?? panic("Cannot borrow a reference to the recipient's collection")

        receiverRef.batchDeposit(tokens: <-collection)
    }
}
		`;
	}

	static characterx_buying_NFT_with_referral() {
		return fcl.transaction`
import FungibleToken from 0x9a0766d93b6608b7
import FUSD from 0xe223d8a629e49c68

transaction(amount: UFix64, to: Address, referrer: Address) {

    let vault: @FungibleToken.Vault
    let referrerBonus: @FungibleToken.Vault
    

    prepare(signer: AuthAccount) {
        
       if   {
            self.vault <- signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)!.withdraw(amount: amount)

            //amount is 95% of actual price as 5% has been subtracted due to referral 
            //referrerBonus is 5% of the actual price
            let referrerBonusAmount = amount / 0.95 * 0.05

            self.referrerBonus <- self.vault.withdraw(amount: referrerBonusAmount)
        } //?? panic("You can not referer to yourself")
    }

    execute {

        getAccount(referrer).getCapability(/public/fusdReceiver)!.borrow<&{FungibleToken.Receiver}>()!
            .deposit(from: <-self.referrerBonus)

        getAccount(to).getCapability(/public/fusdReceiver)!.borrow<&{FungibleToken.Receiver}>()!
            .deposit(from: <-self.vault)
    }
}

		`;
	}

	static characterx_buying_NFT_without_referral() {
		return fcl.transaction`
import FungibleToken from 0x9a0766d93b6608b7
import FUSD from 0xe223d8a629e49c68

transaction(amount: UFix64, to: Address) {

    let vault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {
        self.vault <- signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)!.withdraw(amount: amount)
    }

    execute {
        getAccount(to).getCapability(/public/fusdReceiver)!.borrow<&{FungibleToken.Receiver}>()!
            .deposit(from: <-self.vault)
    }
}

/* 

import FungibleToken from 0x9a0766d93b6608b7

transaction(amount: UFix64, to: Address) {

    let vault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {
        self.vault <- signer.borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!.withdraw(amount: amount)
    }

    execute {
        getAccount(to).getCapability(/public/flowTokenReceiver)!.borrow<&{FungibleToken.Receiver}>()!
            .deposit(from: <-self.vault)
    }
}

 */
		`;
	}

	static characterx_create_character() {
		return fcl.transaction`
import CharacterX from 0x0

transaction(
            name: String, //might be removed
            description: String, //might be removed
            image: String, //might be removed
            createdFrom_1: UInt64,
            createdFrom_2: UInt64,
            sex: String,
            race: String,
            rarity: String, 
            lineage: {String: Bool},
            bloodline: {String: Bool},
            element: {String: Bool},
            traits: {String: String}, 
            data: {String: String}
            ) {
    let adminRef: &CharacterX.Admin
    let currentCharacterID: UInt32

    prepare(acct: AuthAccount) {
        self.currentCharacterID = CharacterX.nextCharacterID;
        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)
            ?? panic("No admin resource in storage")
    }
    execute {
        self.adminRef.createCharacter(name: name, description: description, image: image, createdFrom_1: createdFrom_1, createdFrom_2: createdFrom_2, sex: sex, race: race, rarity: rarity, lineage: lineage, bloodline: bloodline, element: element, traits: traits, data: data)
    }

    post {
        CharacterX.getCharacterData(characterID: self.currentCharacterID) != nil:
            "characterID doesn't exist"
    }
            }
		`;
	}

	static characterx_create_set() {
		return fcl.transaction`
import CharacterX from 0x0

transaction(setName: String) {
    let adminRef: &CharacterX.Admin
    let currentSetID: UInt32
    
    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)
            ?? panic("Couldn't borrow a reference to the Admin resource")
            self.currentSetID = CharacterX.nextSetID;
    }

    execute {
        self.adminRef.createSet(name: setName)
    }

    post {
        CharacterX.getSetName(setID: self.currentSetID) == setName:
            "Couldn't find the specified set"
    }
}
		`;
	}

	static characterx_fulfill_single() {
		return fcl.transaction`
import NonFungibleToken from 0x631e88ae7f1d7c20
import CharacterX from 0x0

transaction(recipientAddr: Address, characterID: UInt64) {
    
    prepare(acct: AuthAccount) {
        let recipient = getAccount(recipientAddr)

        let receiverRef = recipient.getCapability(CharacterX.CollectionPublicPath)
            .borrow<&{CharacterX.CharacterCollectionPublic}>()
                ?? panic("Couldn't borrow reference to Receiver's collection")
    

        if let collection = acct.borrow<&CharacterX.Collection>(from: CharacterX.CollectionStoragePath) {
            receiverRef.deposit(token: <-collection.withdraw(withdrawID: characterID))
        }

    }
}
		`;
	}

	static characterx_fulfill_pack() {
		return fcl.transaction`
import NonFungibleToken from 0x631e88ae7f1d7c20
import CharacterX from 0x0

transaction(recipientAddr: Address, characterIDs: [UInt64]) {
    
    prepare(acct: AuthAccount) {
        let recipient = getAccount(recipientAddr)

        let receiverRef = recipient.getCapability(CharacterX.CollectionPublicPath)
            .borrow<&{CharacterX.CharacterCollectionPublic}>()
                ?? panic("Couldn't borrow reference to Receiver's collection")
    

        if let collection = acct.borrow<&CharacterX.Collection>(from: CharacterX.CollectionStoragePath) {
            receiverRef.batchDeposit(tokens: <-collection.batchWithdraw(ids: characterIDs))
        }

    }
}
		`;
	}

	static characterx_lock_set() {
		return fcl.transaction`
//Does not seem to wo

import CharacterX from 0x0

transaction(setID: UInt32) {
    let adminRef: &CharacterX.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)
            ?? panic("No Admin resource in storage")
    }

    execute {
        let setRef = self.adminRef.borrowSet(setID: setID)
        setRef.lock()
    }

    post {
        CharacterX.isSetLocked(setID: setID)!:
            "Set didn't lock"
    }
}
		`;
	}

	static characterx_mint_character() {
		return fcl.transaction`
import CharacterX from 0x0

transaction(setID: UInt32, characterID: UInt32, recipientAddr: Address) {
    let adminRef: &CharacterX.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)!
    }

    execute {
        let setRef = self.adminRef.borrowSet(setID: setID)

        let newMintedCharacter <- setRef.mintCharacter(characterID: characterID)

        let recipient = getAccount(recipientAddr)

        let receiverRef = recipient.getCapability(CharacterX.CollectionPublicPath).borrow<&{CharacterX.CharacterCollectionPublic}>()
            ?? panic("Can't borrow a reference to the Recipient's Character collection")

        receiverRef.deposit(token: <-newMintedCharacter)
    }
}
		`;
	}

	static characterx_retireAll_characters_from_set() {
		return fcl.transaction`
import CharacterX from 0x0

transaction(setID: UInt32) {
    let adminRef: &CharacterX.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)
            ?? panic("No Admin resource in storage")
    }

    execute {
        let setRef = self.adminRef.borrowSet(setID: setID)

        setRef.retireAllCharacters()
    }
}
		`;
	}

	static characterx_retire_character_from_set() {
		return fcl.transaction`
import CharacterX from 0x0

transaction(setID: UInt32, characterID: UInt32) {
    let adminRef: &CharacterX.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)
            ?? panic("No Admin resource in storage")
    }

    execute {
        let setRef = self.adminRef.borrowSet(setID: setID)

        setRef.retireCharacter(characterID: characterID)
    }

    post {
        CharacterX.isEditionRetired(setID: setID, characterID: characterID) == true:
            "Character is not retired"
    }
}
		`;
	}

	static characterx_setup_account() {
		return fcl.transaction`
import CharacterX from 0x0

transaction() {

    prepare(acct: AuthAccount) {

        if acct.borrow<&CharacterX.Collection>(from: CharacterX.CollectionStoragePath) == nil {

            let collection <- CharacterX.createEmptyCollection() as! @CharacterX.Collection

            acct.save(<- collection, to: CharacterX.CollectionStoragePath)

            acct.link<&{CharacterX.CharacterCollectionPublic}>(CharacterX.CollectionPublicPath, target: CharacterX.CollectionStoragePath)
        }

    }
}


		`;
	}

	static characterx_start_new_series() {
		return fcl.transaction`
import CharacterX from 0x0

transaction {

    let adminRef: &CharacterX.Admin
    let currentSeries: UInt32

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)
            ?? panic("No Admin resource in storage")

        self.currentSeries = CharacterX.currentSeries

    }

    execute {
        self.adminRef.startNewSeries()
    }

    post {
        CharacterX.currentSeries == self.currentSeries + 1 as UInt32:
            "New Series is not started"
    }
}
		`;
	}

	static marketplace_buy_pack() {
		return fcl.transaction`
import FungibleToken from 0x9a0766d93b6608b7
import MarketplaceContract from 0xac70648174bc9884
import NonFungibleToken from 0x631e88ae7f1d7c20
import FlowToken from 0x7e60df042a9c0868

// Buys a Pack from the admin's Pack Collection

transaction(id: UInt64, admin: Address) {

    let packSaleCollection: &MarketplaceContract.SaleCollection{MarketplaceContract.SalePublic}

    let userVaultRef: &{FungibleToken.Provider}

    let userCollection: &{NonFungibleToken.CollectionPublic}
    
    prepare(user: AuthAccount) {
        // Borrows the Admin's public SaleCollection so we can purchase from it
        self.packSaleCollection = getAccount(admin).getCapability(/public/packSaleCollection)
            .borrow<&MarketplaceContract.SaleCollection{MarketplaceContract.SalePublic}>()
            ?? panic("Could not borrow from the Admin's saleCollection")

        // Borrow the user's FlowToken Vault
        self.userVaultRef = user.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow reference to the owner's Vault!")

        // Borrows the user's Pack Collection so we can deposit the newly purchased Pack
        // into it
        self.userCollection = user.getCapability(/public/packCollection)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow from the user's PackCollection")

    }

    execute {
        // Checks the price of the Pack we want to purchase
        let cost = self.packSaleCollection.idPrice(id: id) ?? panic("A Pack with this id is not up for sale")
        // Withdraw the correct amount of tokens from the user's FlowToken Vault
        let vault <- self.userVaultRef.withdraw(amount: cost)

        // Purchase the Pack
        self.packSaleCollection.purchase(id: id, recipient: self.userCollection, buyTokens: <-vault)
    }
}

		`;
	}

	static marketplace_list_packs_for_sale() {
		return fcl.transaction`
import MarketplaceContract from 0xac70648174bc9884

// This should be called by the admin to list Packs for sale in 
// their SaleCollection

transaction(ids: [UInt64], price: UFix64) {

  let packSaleCollection: &MarketplaceContract.SaleCollection

  prepare(admin: AuthAccount) {
      // Borrows the admin's SaleCollection
      self.packSaleCollection = admin.borrow<&MarketplaceContract.SaleCollection>(from: /storage/packSaleCollection) 
          ?? panic("Could not borrow the admin's Pack SaleCollection")
  }

  execute {
      // Lists Packs for sale
      self.packSaleCollection.listForSale(ids: ids, price: price)

      log("Listed Pack(s) for sale")
  }
}

		`;
	}

	static marketplace_provision_marketplace() {
		return fcl.transaction`
import MarketplaceContract from 0xac70648174bc9884
import FungibleToken from 0x9a0766d93b6608b7
import NonFungibleToken from 0x631e88ae7f1d7c20

// Sets up the admin to list Packs for sale by giving them a SaleCollection

transaction {

  prepare(acct: AuthAccount) {
    if acct.borrow<&MarketplaceContract.SaleCollection>(from: /storage/packSaleCollection) == nil && acct.borrow<&NonFungibleToken.Collection>(from: /storage/packCollection) != nil {
      // same as doing <&FlowToken.Vault{FungibleToken.Receiver}> but we don't have
      // to import FlowToken this way
      let ownerVault = acct.getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
      assert(ownerVault.borrow() != nil, message: "Missing or mis-typed Token Vault")

      /** The reason we do this part is because we cannot do getCapability for something
      in storage, so because we need a Capability specifically we just put it in a private
      path and get it from there. By making it private its also only available to us **/
      acct.link<&NonFungibleToken.Collection>(/private/packCollection, target: /storage/packCollection)
      
      let ownerPackCollection = acct.getCapability<&NonFungibleToken.Collection>(/private/packCollection)
      assert(ownerPackCollection.borrow() != nil, message: "Missing or mis-typed PackCollection")
      /** **/
      
      // create a new empty collection
      let packSaleCollection <- MarketplaceContract.createSaleCollection(ownerVault: ownerVault, ownerCollection: ownerPackCollection)
            
      // save it to the account
      acct.save(<-packSaleCollection, to: /storage/packSaleCollection)

      // create a public capability for the collection
      acct.link<&MarketplaceContract.SaleCollection{MarketplaceContract.SalePublic}>(/public/packSaleCollection, target: /storage/packSaleCollection)
    
      log("Gave account a sale collection")
    }
  }

  execute {
    
  }
}
		`;
	}

	static nft_provision_nfts() {
		return fcl.transaction`
import NFTContract from 0x0
import NonFungibleToken from 0x631e88ae7f1d7c20

// Sets up an account to handle NFTs. Must be called by an account before
// interacting with NFTs or an error will be thrown.

transaction {

  prepare(acct: AuthAccount) {
    // if the account doesn't already have a NFT collection
    if acct.borrow<&NFTContract.Collection>(from: /storage/nftCollection) == nil {

      // create a new empty collection
      let nftCollection <- NFTContract.createEmptyCollection()
            
      // save it to the account
      acct.save(<-nftCollection, to: /storage/nftCollection)

      // create a public capability for the collection
      acct.link<&NFTContract.Collection{NonFungibleToken.CollectionPublic}>(/public/nftCollection, target: /storage/nftCollection)
    
      log("Gave account a NFT collection")
    }
  }

  execute {
    
  }
}

		`;
	}

	static nft_transfer_nft() {
		return fcl.transaction`
import NFTContract from 0x0
import NonFungibleToken from 0x631e88ae7f1d7c20

// Transfers an NFT from the giver to the recipient

transaction(id: UInt64, recipient: Address) {
  let nftCollectionRef: &NFTContract.Collection

  let recipientNFTCollectionRef: &NFTContract.Collection{NonFungibleToken.CollectionPublic}

  prepare(giver: AuthAccount) {
      // Borrows the giver's NFT Collection
      self.nftCollectionRef = giver.borrow<&NFTContract.Collection>(from: /storage/nftCollection)
        ?? panic("Could not borrow the user's NFT Collection")

      // Borrows the recipient's NFT Collection
      self.recipientNFTCollectionRef = getAccount(recipient).getCapability(/public/nftCollection)
          .borrow<&NFTContract.Collection{NonFungibleToken.CollectionPublic}>()
          ?? panic("Could not borrow the public capability for the recipient's account")
    } 

  execute {
      // withdraws an NFT from the giver's NFT Collection
      let nft <- self.nftCollectionRef.withdraw(withdrawID: id)
      
      // deposits an NFT into the recipient's NFT Collection
      self.recipientNFTCollectionRef.deposit(token: <-nft)

      log("Transfered the NFT from the giver to the recipient")
  }
}
		`;
	}

	static packs_add_pack_type() {
		return fcl.transaction`
import AdminContract from 0x0

// Should be called by the admin to create a new Pack Type.

transaction(packType: UInt64, numberOfNFTs: UInt64) {

  let adminRef: &AdminContract.Admin
  prepare(admin: AuthAccount) {
      // Borrows an Admin resource reference
      self.adminRef = admin.borrow<&AdminContract.Admin>(from: /storage/admin)
      ?? panic("Could not borrow admin resource")
  }

  execute {
      // Calls addPackType on the Admin resource reference
      self.adminRef.addPackType(packType: packType, numberOfNFTs: numberOfNFTs)
      
      log("Added new pack type")
  }
}

		`;
	}

	static packs_mint_pack() {
		return fcl.transaction`
import AdminContract from 0x0

// Called by the admin to mint a Pack.

transaction(packType: UInt64, numberOfPacks: UInt64) {

  let adminRef: &AdminContract.Admin

  prepare(admin: AuthAccount) {
    // Borrows an Admin resource reference
    self.adminRef = admin.borrow<&AdminContract.Admin>(from: /storage/admin)
        ?? panic("Could not borrow the minter reference from the admin")
  }

  execute {
    // Calls mintPacks on the Admin resource reference
    self.adminRef.mintPacks(packType: packType, numberOfPacks: numberOfPacks)

    log("Minted a pack")
  }
}
		`;
	}

	static packs_open_pack() {
		return fcl.transaction`
import PackContract from 0x0
import AdminContract from 0x0
import NonFungibleToken from 0x631e88ae7f1d7c20

// Called by the admin to open a Pack in the "recipient" account.

transaction(id: UInt64, recipient: Address) {

    let recipientPackCollectionRef: &PackContract.Collection{PackContract.IPackCollectionAdminAccessible}

    let recipientNFTCollectionRef: &{NonFungibleToken.CollectionPublic}

    let adminRef: &AdminContract.Admin
    
    prepare(admin: AuthAccount) {
        // Borrows the Pack owner's Pack Collection
        self.recipientPackCollectionRef = getAccount(recipient).getCapability(/public/packCollection)
            .borrow<&PackContract.Collection{PackContract.IPackCollectionAdminAccessible}>()
            ?? panic("Could not borrow the account's pack collection ref")
            
        // Borrows the Pack owner's NFT Collection so we can deposit the NFTs into it
        self.recipientNFTCollectionRef = getAccount(recipient).getCapability(/public/nftCollection)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow the account's NFT collection ref")

        // Borrows a reference to an Admin resource
        self.adminRef = admin.borrow<&AdminContract.Admin>(from: /storage/admin)
            ?? panic("Could not get admin's ref")
    }

    execute {
        // Calls openPack on the admin resource reference
        self.adminRef.openPack(id: id, packCollectionRef: self.recipientPackCollectionRef, nftCollectionRef: self.recipientNFTCollectionRef)
    
        log("Pack opened")
    }
}
		`;
	}

	static packs_transfer_pack() {
		return fcl.transaction`
import PackContract from 0x0
import MarketplaceContract from 0xac70648174bc9884

// Transfers a Pack from the giver to the recipient.

transaction(id: UInt64, recipient: Address) {

  let packCollectionRef: &PackContract.Collection

  let recipientPackCollectionRef: &PackContract.Collection{PackContract.IPackCollectionPublic}

  prepare(giver: AuthAccount) {
    // Borrows the giver's Pack Collection
    self.packCollectionRef = giver.borrow<&PackContract.Collection>(from: /storage/packCollection)
      ?? panic("Could not borrow the user's pack collection")

    // Borrows the recipient's Pack Collection
    self.recipientPackCollectionRef = getAccount(recipient).getCapability(/public/packCollection)
      .borrow<&PackContract.Collection{PackContract.IPackCollectionPublic}>()
      ?? panic("Could not borrow the public capability for the recipient's account")

    // If the Pack owner currently has this Pack up for sale, take it off the market
    if let packSaleCollectionRef = giver.borrow<&MarketplaceContract.SaleCollection>(from: /storage/packSaleCollection) {
      packSaleCollectionRef.unlistSale(id: id)
    }
  }

  execute {
    // Withdraw the Pack from the giver's Pack Collection
    let pack <- self.packCollectionRef.withdraw(withdrawID: id)
    
    // Deposit the Pack into the recipient's Pack Collection
    self.recipientPackCollectionRef.deposit(token: <- pack)

    log("Transfered the pack from the giver to the recipient")
  }
}

		`;
	}

	static packs_provision_packs() {
		return fcl.transaction`
import PackContract from 0x0
import NonFungibleToken from 0x631e88ae7f1d7c20

// Sets up an account to handle Packs. Must be called by an account before
// interacting with Packs or an error will be thrown.

transaction {

  prepare(acct: AuthAccount) {
    // if the account doesn't already have a pack collection
    if (acct.borrow<&PackContract.Collection>(from: /storage/packCollection) == nil) {

      // create a new empty collection
      let packCollection <- PackContract.createEmptyCollection()
            
      // save it to the account
      acct.save(<-packCollection, to: /storage/packCollection)

      // create a public capability for the collection
      acct.link<&PackContract.Collection{PackContract.IPackCollectionPublic, PackContract.IPackCollectionAdminAccessible, NonFungibleToken.CollectionPublic}>(/public/packCollection, target: /storage/packCollection)
    
      log("Gave account a pack collection")
    }
  }

  execute {
    
  }
}
		`;
	}

}
