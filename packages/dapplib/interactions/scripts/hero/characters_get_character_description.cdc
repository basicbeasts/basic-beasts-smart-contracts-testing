import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(characterID: UInt32): String {

    let description = CharacterX.getCharacterDescription(characterID: characterID)
        ?? panic("Character doesn't exist")

    return description
}