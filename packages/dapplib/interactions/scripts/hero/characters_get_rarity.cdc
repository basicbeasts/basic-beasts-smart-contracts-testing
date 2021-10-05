import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(characterID: UInt32): String {

    let rarity = CharacterX.getCharacterRarity(characterID: characterID)
        ?? panic("Character doesn't exist")

    return rarity
}