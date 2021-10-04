import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(characterID: UInt32): {String: Bool} {

    let lineage = CharacterX.getCharacterLineage(characterID: characterID)
        ?? panic("Character doesn't exist")

    return lineage
}