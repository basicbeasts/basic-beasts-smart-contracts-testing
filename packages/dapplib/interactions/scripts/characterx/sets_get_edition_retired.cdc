import CharacterX from Project.CharacterX

pub fun main(setID: UInt32, characterID: UInt32): Bool {
    let isRetired = CharacterX.isEditionRetired(setID: setID, characterID: characterID)
        ?? panic("Couldn't find the specified edition")

    return isRetired
}