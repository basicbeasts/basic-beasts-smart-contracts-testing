import CharacterX from Project.CharacterX

pub fun main(characterID: UInt32): {String: String} {
    let data = CharacterX.getCharacterData(characterID: characterID)
        ?? panic("Character doesn't exist")

    return data
}