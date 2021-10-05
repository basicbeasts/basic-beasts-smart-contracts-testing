import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(characterID: UInt32): {String: Bool} {

    let element = CharacterX.getCharacterElement(characterID: characterID)
        ?? panic("Character doesn't exist")

    return element
}