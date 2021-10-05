import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(characterID: UInt32): String {

    let name = CharacterX.getCharacterName(characterID: characterID)
        ?? panic("Character doesn't exist")

    return name
}