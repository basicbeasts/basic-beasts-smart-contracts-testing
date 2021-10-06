// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/interactions CHANGES
// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN
// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

const fcl = require("@onflow/fcl");

module.exports = class DappScripts {

	static flowtoken_get_flow_balance() {
		return fcl.script`
import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x0ae53cb6e3f42a79

// Returns the balance of a FlowToken Vault

pub fun main(account: Address): UFix64 {
    // Borrow the account's FlowToken Vault
    let vaultRef = getAccount(account)
        .getCapability(/public/flowTokenBalance)
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    // Return the balance in the FlowToken Vault
    return vaultRef.balance
}  
		`;
	}

	static hero_characters_get_character_bloodline() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): {String: Bool} {

    let bloodline = CharacterX.getCharacterBloodline(characterID: characterID)
        ?? panic("Character doesn't exist")

    return bloodline
}
		`;
	}

	static hero_characters_get_character_created_from_1() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): UInt64 {

    let createdFrom_1 = CharacterX.getCharacterCreatedFrom_1(characterID: characterID)
        ?? panic("Character doesn't exist")

    return createdFrom_1
}
		`;
	}

	static hero_characters_get_character_data_field() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32, field: String): String {
    let field = CharacterX.getCharacterDataByField(characterID: characterID, field: field)
        ?? panic("Character doesn't exist")

    return field
}
		`;
	}

	static hero_characters_get_character_data() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): {String: String} {
    let data = CharacterX.getCharacterData(characterID: characterID)
        ?? panic("Character doesn't exist")

    return data
}
		`;
	}

	static hero_characters_get_character_created_from_2() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): UInt64 {

    let createdFrom_2 = CharacterX.getCharacterCreatedFrom_2(characterID: characterID)
        ?? panic("Character doesn't exist")

    return createdFrom_2
}
		`;
	}

	static hero_characters_get_character_description() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): String {

    let description = CharacterX.getCharacterDescription(characterID: characterID)
        ?? panic("Character doesn't exist")

    return description
}
		`;
	}

	static hero_characters_get_character_element() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): {String: Bool} {

    let element = CharacterX.getCharacterElement(characterID: characterID)
        ?? panic("Character doesn't exist")

    return element
}
		`;
	}

	static hero_characters_get_character_name() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): String {

    let name = CharacterX.getCharacterName(characterID: characterID)
        ?? panic("Character doesn't exist")

    return name
}
		`;
	}

	static hero_characters_get_character_race() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): String {

    let race = CharacterX.getCharacterRace(characterID: characterID)
        ?? panic("Character doesn't exist")

    return race
}
		`;
	}

	static hero_characters_get_character_traits() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): {String: String} {
    let traits = CharacterX.getCharacterTraits(characterID: characterID)
        ?? panic("Character doesn't exist")

    return traits
}
		`;
	}

	static hero_characters_get_character_sex() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): String {

    let sex = CharacterX.getCharacterSex(characterID: characterID)
        ?? panic("Character doesn't exist")

    return sex
}
		`;
	}

	static hero_characters_get_nextCharacterID() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(): UInt32 {
    return CharacterX.nextCharacterID
}
		`;
	}

	static hero_characters_get_character_traits_field() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32, field: String): String {
    let field = CharacterX.getCharacterTraitsByField(characterID: characterID, field: field)
        ?? panic("Character doesn't exist")

    return field
}
		`;
	}

	static hero_characters_get_rarity() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): String {

    let rarity = CharacterX.getCharacterRarity(characterID: characterID)
        ?? panic("Character doesn't exist")

    return rarity
}
		`;
	}

	static hero_collections_get_character_characterID() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, id: UInt64): UInt32 {

    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let token = collectionRef.borrowCharacterNFT(id: id)
        ?? panic("Couldn't borrow a reference to the specified character")

    let data = token.data
    
        return data.characterID
}
		`;
	}

	static hero_collections_get_character_series() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, id: UInt64): UInt32 {

    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let token = collectionRef.borrowCharacterNFT(id: id)
        ?? panic("Couldn't borrow a reference to the specified character")

    let data = token.data
    
    return CharacterX.getSetSeries(setID: data.setID)!
}
		`;
	}

	static hero_collections_get_character_serialNum() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, id: UInt64): UInt32 {

    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let token = collectionRef.borrowCharacterNFT(id: id)
        ?? panic("Couldn't borrow a reference to the specified character")

    let data = token.data
    
    return data.serialNumber
}
		`;
	}

	static hero_collections_get_character_setID() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, id: UInt64): UInt32 {

    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let token = collectionRef.borrowCharacterNFT(id: id)
        ?? panic("Couldn't borrow a reference to the specified character")

    let data = token.data
    
        return data.setID
}
		`;
	}

	static hero_collections_get_character_setName() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, id: UInt64): String {

    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let token = collectionRef.borrowCharacterNFT(id: id)
        ?? panic("Couldn't borrow a reference to the specified character")

    let data = token.data
    
        return CharacterX.getSetName(setID: data.setID)!
}
		`;
	}

	static hero_characters_get_character_image() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): String {

    let image = CharacterX.getCharacterImage(characterID: characterID)
        ?? panic("Character doesn't exist")

    return image
}
		`;
	}

	static hero_collections_get_collection_ids() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address): [UInt64] {
    
    let acct = getAccount(account)

    let collectionRef = acct.getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()!

    return collectionRef.getIDs()

}
		`;
	}

	static hero_collections_get_data() {
		return fcl.script`
//TODO: Write more scripts that get the rest of a character's data. We have more separated data than NBATS' metadata

import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, id: UInt64): {String: String} {
    
    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let token = collectionRef.borrowCharacterNFT(id: id)
        ?? panic("Couldn't borrow a reference to the specified character")

    let data = token.data

    let characterData = CharacterX.getCharacterData(characterID: data.characterID) ?? panic("Character doesn't exist") 

    return characterData
}

		`;
	}

	static hero_collections_get_id_in_Collection() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, id: UInt64): Bool {
    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    return collectionRef.borrowNFT(id: id) != nil
}
		`;
	}

	static hero_collections_get_setCharacters_are_owned() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, setIDs: [UInt32], characterIDs: [UInt32]): Bool {
    assert(setIDs.length == characterIDs.length, 
    message: "set and character ID arrays have mismatched lengths"
    )

    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let characterNFTIDs = collectionRef.getIDs()

    var i = 0

    while i < setIDs.length {
        var hasMatchingCharacter = false
        for characterID in characterNFTIDs {
            let token = collectionRef.borrowCharacterNFT(id: characterID)
                ?? panic("Couldn't borrow a reference to the specified character")

            let characterData = token.data
            if characterData.setID == setIDs[i] && characterData.characterID == characterIDs[i] {
                hasMatchingCharacter = true
                break
            }
        }
        if !hasMatchingCharacter {
            return false
        }
        i = i + 1
    }

    return true
}

		`;
	}

	static hero_collections_get_data_field() {
		return fcl.script`
//TODO: Write more scripts that get the rest of a character's data. We have more separated data than NBATS' metadata
//in case we don't write getters for each field in contract we might do like setdata script
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, characterID: UInt64, fieldToSearch: String): String {
    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let token = collectionRef.borrowCharacterNFT(id: characterID)
        ?? panic("Couldn't borrow a reference to the specified character")

    let data = token.data

    let field = CharacterX.getCharacterDataByField(characterID: data.characterID, field: fieldToSearch) ?? panic("Character doesn't exist")

    return field
}
		`;
	}

	static hero_get_currentSeries() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(): UInt32 {
    return CharacterX.currentSeries
}
		`;
	}

	static hero_get_totalSupply() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(): UInt64 {
    return CharacterX.totalSupply
}
		`;
	}

	static hero_heroes_get_all_heroes() {
		return fcl.script`
import Hero from 0x01cf0e2f2f715450

pub fun main(): [Hero.HeroStruct] {
    return Hero.getAllHeroStructs()
}
		`;
	}

	static hero_sets_get_characters_in_set() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(setID: UInt32): [UInt32] {

    let characters = CharacterX.getCharactersInSet(setID: setID)!

    return characters
}
		`;
	}

	static hero_heroes_get_hero_lineages() {
		return fcl.script`
import Hero from 0x01cf0e2f2f715450

pub fun main(heroStructID: UInt32): {String: Bool} {

    let lineages = Hero.getHeroLineages(heroStructID: heroStructID)
        ?? panic("Hero doesn't exist")

    return lineages
}

		`;
	}

	static hero_sets_get_edition_retired() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(setID: UInt32, characterID: UInt32): Bool {
    let isRetired = CharacterX.isEditionRetired(setID: setID, characterID: characterID)
        ?? panic("Couldn't find the specified edition")

    return isRetired
}
		`;
	}

	static hero_sets_get_nextSetID() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(): UInt32 {
    return CharacterX.nextSetID
}
		`;
	}

	static hero_sets_get_numCharacters_in_edition() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(setID: UInt32, characterID: UInt32): UInt32 {

    let numCharacters = CharacterX.getNumNFTCharactersInEdition(setID: setID, characterID: characterID)
        ?? panic("Couldn't find the specified edition")

    return numCharacters
}
		`;
	}

	static hero_sets_get_setIDs_by_name() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(setName: String): [UInt32] {

    let ids = CharacterX.getSetIDsByName(setName: setName)
        ?? panic("Couldn't find the specified set name")

    return ids

}
		`;
	}

	static hero_sets_get_setName() {
		return fcl.script`
import Hero from 0x01cf0e2f2f715450

pub fun main(setID: UInt32): String {

    let name = Hero.getSetName(setID: setID)
        ?? panic("Couldn't find the specified set")

    return name
}
		`;
	}

	static hero_sets_get_setSeries() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(setID: UInt32): UInt32 {

    let series = CharacterX.getSetSeries(setID: setID)
        ?? panic("Couldn't find the specified set")

    return series
}
		`;
	}

	static hero_sets_get_set_locked() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(setID: UInt32): Bool {

    let isLocked = CharacterX.isSetLocked(setID: setID)
        ?? panic("Coulnd't find the specified set")

    return isLocked
}
		`;
	}

	static nft_get_nfts_in_collection() {
		return fcl.script`
import NonFungibleToken from 0x01cf0e2f2f715450
import NFTContract from 0x01cf0e2f2f715450

// Returns all the IDs of the NFTs in the acct's NFT Collection

pub fun main(acct: Address): [UInt64] {
  // Borrows the acct's NFT Collection
  let acctNFTCollectionRef = getAccount(acct).getCapability(/public/nftCollection)
            .borrow<&NFTContract.Collection{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  // Returns all NFT IDs in that Collection
  return acctNFTCollectionRef.getIDs()
}
		`;
	}

	static nft_get_nft_info() {
		return fcl.script`
import NFTContract from 0x01cf0e2f2f715450
import NonFungibleToken from 0x01cf0e2f2f715450

// Simply returns the id of the NFT back to the client

pub fun main(acct: Address, id: UInt64): &NonFungibleToken.NFT {
  // Borrows the user's NFT Collection
  let acctNFTCollectionRef = getAccount(acct).getCapability(/public/nftCollection)
            .borrow<&NFTContract.Collection{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  // Gets the info for the NFT with correct id
  let borrowedNFT = acctNFTCollectionRef.borrowNFT(id: id)
  
  // You'll notice that this simply returns the id back. 
  // Yes, I know... it's useless. But a good example! Haha :)
  return borrowedNFT
}
		`;
	}

	static characterx_characters_get_all_characters() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(): [CharacterX.CharacterY] {
    return CharacterX.getAllCharacters()
}
		`;
	}

	static characterx_characters_get_character_bloodline() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): {String: Bool} {

    let bloodline = CharacterX.getCharacterBloodline(characterID: characterID)
        ?? panic("Character doesn't exist")

    return bloodline
}
		`;
	}

	static characterx_characters_get_character_created_from_2() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): UInt64 {

    let createdFrom_2 = CharacterX.getCharacterCreatedFrom_2(characterID: characterID)
        ?? panic("Character doesn't exist")

    return createdFrom_2
}
		`;
	}

	static characterx_characters_get_character_created_from_1() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): UInt64 {

    let createdFrom_1 = CharacterX.getCharacterCreatedFrom_1(characterID: characterID)
        ?? panic("Character doesn't exist")

    return createdFrom_1
}
		`;
	}

	static characterx_characters_get_character_data() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): {String: String} {
    let data = CharacterX.getCharacterData(characterID: characterID)
        ?? panic("Character doesn't exist")

    return data
}
		`;
	}

	static characterx_characters_get_character_data_field() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32, field: String): String {
    let field = CharacterX.getCharacterDataByField(characterID: characterID, field: field)
        ?? panic("Character doesn't exist")

    return field
}
		`;
	}

	static characterx_characters_get_character_description() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): String {

    let description = CharacterX.getCharacterDescription(characterID: characterID)
        ?? panic("Character doesn't exist")

    return description
}
		`;
	}

	static characterx_characters_get_character_element() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): {String: Bool} {

    let element = CharacterX.getCharacterElement(characterID: characterID)
        ?? panic("Character doesn't exist")

    return element
}
		`;
	}

	static characterx_characters_get_character_image() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): String {

    let image = CharacterX.getCharacterImage(characterID: characterID)
        ?? panic("Character doesn't exist")

    return image
}
		`;
	}

	static characterx_characters_get_character_lineage() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): {String: Bool} {

    let lineage = CharacterX.getCharacterLineage(characterID: characterID)
        ?? panic("Character doesn't exist")

    return lineage
}
		`;
	}

	static characterx_characters_get_character_race() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): String {

    let race = CharacterX.getCharacterRace(characterID: characterID)
        ?? panic("Character doesn't exist")

    return race
}
		`;
	}

	static characterx_characters_get_character_name() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): String {

    let name = CharacterX.getCharacterName(characterID: characterID)
        ?? panic("Character doesn't exist")

    return name
}
		`;
	}

	static characterx_characters_get_character_traits() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): {String: String} {
    let traits = CharacterX.getCharacterTraits(characterID: characterID)
        ?? panic("Character doesn't exist")

    return traits
}
		`;
	}

	static characterx_characters_get_character_sex() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): String {

    let sex = CharacterX.getCharacterSex(characterID: characterID)
        ?? panic("Character doesn't exist")

    return sex
}
		`;
	}

	static characterx_characters_get_character_traits_field() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32, field: String): String {
    let field = CharacterX.getCharacterTraitsByField(characterID: characterID, field: field)
        ?? panic("Character doesn't exist")

    return field
}
		`;
	}

	static characterx_characters_get_nextCharacterID() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(): UInt32 {
    return CharacterX.nextCharacterID
}
		`;
	}

	static characterx_characters_get_rarity() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(characterID: UInt32): String {

    let rarity = CharacterX.getCharacterRarity(characterID: characterID)
        ?? panic("Character doesn't exist")

    return rarity
}
		`;
	}

	static characterx_collections_get_character_characterID() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, id: UInt64): UInt32 {

    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let token = collectionRef.borrowCharacterNFT(id: id)
        ?? panic("Couldn't borrow a reference to the specified character")

    let data = token.data
    
        return data.characterID
}
		`;
	}

	static characterx_collections_get_character_serialNum() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, id: UInt64): UInt32 {

    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let token = collectionRef.borrowCharacterNFT(id: id)
        ?? panic("Couldn't borrow a reference to the specified character")

    let data = token.data
    
    return data.serialNumber
}
		`;
	}

	static characterx_collections_get_character_setName() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, id: UInt64): String {

    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let token = collectionRef.borrowCharacterNFT(id: id)
        ?? panic("Couldn't borrow a reference to the specified character")

    let data = token.data
    
        return CharacterX.getSetName(setID: data.setID)!
}
		`;
	}

	static characterx_collections_get_character_setID() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, id: UInt64): UInt32 {

    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let token = collectionRef.borrowCharacterNFT(id: id)
        ?? panic("Couldn't borrow a reference to the specified character")

    let data = token.data
    
        return data.setID
}
		`;
	}

	static characterx_collections_get_collection_ids() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address): [UInt64] {
    
    let acct = getAccount(account)

    let collectionRef = acct.getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()!

    return collectionRef.getIDs()

}
		`;
	}

	static characterx_collections_get_character_series() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, id: UInt64): UInt32 {

    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let token = collectionRef.borrowCharacterNFT(id: id)
        ?? panic("Couldn't borrow a reference to the specified character")

    let data = token.data
    
    return CharacterX.getSetSeries(setID: data.setID)!
}
		`;
	}

	static characterx_collections_get_data() {
		return fcl.script`
//TODO: Write more scripts that get the rest of a character's data. We have more separated data than NBATS' metadata

import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, id: UInt64): {String: String} {
    
    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let token = collectionRef.borrowCharacterNFT(id: id)
        ?? panic("Couldn't borrow a reference to the specified character")

    let data = token.data

    let characterData = CharacterX.getCharacterData(characterID: data.characterID) ?? panic("Character doesn't exist") 

    return characterData
}

		`;
	}

	static characterx_collections_get_data_field() {
		return fcl.script`
//TODO: Write more scripts that get the rest of a character's data. We have more separated data than NBATS' metadata
//in case we don't write getters for each field in contract we might do like setdata script
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, characterID: UInt64, fieldToSearch: String): String {
    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let token = collectionRef.borrowCharacterNFT(id: characterID)
        ?? panic("Couldn't borrow a reference to the specified character")

    let data = token.data

    let field = CharacterX.getCharacterDataByField(characterID: data.characterID, field: fieldToSearch) ?? panic("Character doesn't exist")

    return field
}
		`;
	}

	static characterx_collections_get_id_in_Collection() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, id: UInt64): Bool {
    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    return collectionRef.borrowNFT(id: id) != nil
}
		`;
	}

	static characterx_get_currentSeries() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(): UInt32 {
    return CharacterX.currentSeries
}
		`;
	}

	static characterx_sets_get_characters_in_set() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(setID: UInt32): [UInt32] {

    let characters = CharacterX.getCharactersInSet(setID: setID)!

    return characters
}
		`;
	}

	static characterx_collections_get_setCharacters_are_owned() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(account: Address, setIDs: [UInt32], characterIDs: [UInt32]): Bool {
    assert(setIDs.length == characterIDs.length, 
    message: "set and character ID arrays have mismatched lengths"
    )

    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let characterNFTIDs = collectionRef.getIDs()

    var i = 0

    while i < setIDs.length {
        var hasMatchingCharacter = false
        for characterID in characterNFTIDs {
            let token = collectionRef.borrowCharacterNFT(id: characterID)
                ?? panic("Couldn't borrow a reference to the specified character")

            let characterData = token.data
            if characterData.setID == setIDs[i] && characterData.characterID == characterIDs[i] {
                hasMatchingCharacter = true
                break
            }
        }
        if !hasMatchingCharacter {
            return false
        }
        i = i + 1
    }

    return true
}

		`;
	}

	static characterx_get_totalSupply() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(): UInt64 {
    return CharacterX.totalSupply
}
		`;
	}

	static characterx_sets_get_edition_retired() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(setID: UInt32, characterID: UInt32): Bool {
    let isRetired = CharacterX.isEditionRetired(setID: setID, characterID: characterID)
        ?? panic("Couldn't find the specified edition")

    return isRetired
}
		`;
	}

	static characterx_sets_get_numCharacters_in_edition() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(setID: UInt32, characterID: UInt32): UInt32 {

    let numCharacters = CharacterX.getNumNFTCharactersInEdition(setID: setID, characterID: characterID)
        ?? panic("Couldn't find the specified edition")

    return numCharacters
}
		`;
	}

	static characterx_sets_get_setName() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(setID: UInt32): String {

    let name = CharacterX.getSetName(setID: setID)
        ?? panic("Couldn't find the specified set")

    return name
}
		`;
	}

	static characterx_sets_get_setIDs_by_name() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(setName: String): [UInt32] {

    let ids = CharacterX.getSetIDsByName(setName: setName)
        ?? panic("Couldn't find the specified set name")

    return ids

}
		`;
	}

	static characterx_sets_get_nextSetID() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(): UInt32 {
    return CharacterX.nextSetID
}
		`;
	}

	static packs_get_owned_packs() {
		return fcl.script`
import PackContract from 0x01cf0e2f2f715450
import NonFungibleToken from 0x01cf0e2f2f715450

// Gets all the owned Packs in the user's PackCollection

pub fun main(acct: Address): [UInt64] {
  // Borrows the acct's Pack Collection
  let acctPackCollectionRef = getAccount(acct).getCapability(/public/packCollection)
            .borrow<&PackContract.Collection{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  // Returns all the IDs of the Packs in the Collection
  return acctPackCollectionRef.getIDs()
}
		`;
	}

	static characterx_sets_get_setSeries() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(setID: UInt32): UInt32 {

    let series = CharacterX.getSetSeries(setID: setID)
        ?? panic("Couldn't find the specified set")

    return series
}
		`;
	}

	static characterx_sets_get_set_locked() {
		return fcl.script`
import CharacterX from 0x01cf0e2f2f715450

pub fun main(setID: UInt32): Bool {

    let isLocked = CharacterX.isSetLocked(setID: setID)
        ?? panic("Coulnd't find the specified set")

    return isLocked
}
		`;
	}

	static packs_get_pack_type_info() {
		return fcl.script`
import PackContract from 0x01cf0e2f2f715450

// Gets the info of a Pack Type

pub fun main(packType: UInt64): PackContract.PackType {
  // Gets the info of the packType
  return PackContract.getPackTypeInfo(packType: packType) 
}
		`;
	}

	static packs_get_pack_info() {
		return fcl.script`
import PackContract from 0x01cf0e2f2f715450

// Returns all the info of a Pack

pub fun main(id: UInt64, acct: Address): &PackContract.NFT {
  // Borrows the account's Pack Collection
  let packCollectionRef = getAccount(acct).getCapability(/public/packCollection)
            .borrow<&PackContract.Collection{PackContract.IPackCollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  
  // Borrows the a reference to that Pack
  let packRef = packCollectionRef.borrowPack(id: id) 
    ?? panic("This Pack does not belong to this user or does not exist")
  
  // Will return all the info of the Pack to the client
  return packRef
}
		`;
	}

	static marketplace_get_packs_available() {
		return fcl.script`
import MarketplaceContract from 0x01cf0e2f2f715450

// Gets all the Packs up for sale in the admin's account

pub fun main(admin: Address): {UFix64: UFix64} {
  // Borrows the admin's SaleCollection so we can see what Packs are available
  let acctPackCollectionRef = getAccount(admin).getCapability(/public/packSaleCollection)
              .borrow<&MarketplaceContract.SaleCollection{MarketplaceContract.SalePublic}>()
              ?? panic("Could not borrow the public capability for the recipient's account")
  // Gets all the IDs in the SaleCollection above
  let ids = acctPackCollectionRef.getIDs()
  let available: {UFix64: UFix64} = {}

  // Loops over every ID and maps it to the price of the Pack with that ID
  for id in ids {
    available[UFix64(id)] = acctPackCollectionRef.idPrice(id: id)!
  }

  return available
}
		`;
	}

	static FUSD_get_FUSD_balance() {
		return fcl.script`
import FungibleToken from 0xee82856bf20e2aa6
import FUSD from 0x01cf0e2f2f715450

pub fun main(address: Address): UFix64? {
  let account = getAccount(address)

  if let vaultRef = account.getCapability(/public/fusdBalance).borrow<&FUSD.Vault{FungibleToken.Balance}>() {
    return vaultRef.balance
  } 
  return nil
  
}
		`;
	}

	static FUSD_get_FUSD_supply() {
		return fcl.script`

import FUSD from 0x01cf0e2f2f715450

// This script returns the total amount of FUSD currently in existence.

pub fun main(): UFix64 {

    let supply = FUSD.totalSupply

    log(supply)

    return supply
}
		`;
	}

}
