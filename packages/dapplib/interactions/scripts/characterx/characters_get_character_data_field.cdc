import CharacterX from Project.CharacterX

pub fun main(characterID: UInt32, field: String): String {
    let field = CharacterX.getCharacterDataByField(characterID: characterID, field: field)
        ?? panic("Character doesn't exist")

    return field
}