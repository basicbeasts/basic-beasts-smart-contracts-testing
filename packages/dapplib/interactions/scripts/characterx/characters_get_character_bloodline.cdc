import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(characterID: UInt32): {String: Bool} {

    let bloodline = CharacterX.getCharacterBloodline(characterID: characterID)
        ?? panic("Character doesn't exist")

    return bloodline
}