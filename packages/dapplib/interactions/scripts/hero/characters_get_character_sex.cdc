import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(characterID: UInt32): String {

    let sex = CharacterX.getCharacterSex(characterID: characterID)
        ?? panic("Character doesn't exist")

    return sex
}