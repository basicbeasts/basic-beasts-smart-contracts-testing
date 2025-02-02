import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(setID: UInt32, characterID: UInt32): Bool {
    let isRetired = CharacterX.isEditionRetired(setID: setID, characterID: characterID)
        ?? panic("Couldn't find the specified edition")

    return isRetired
}