import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(characterID: UInt32): UInt64 {

    let createdFrom_1 = CharacterX.getCharacterCreatedFrom_1(characterID: characterID)
        ?? panic("Character doesn't exist")

    return createdFrom_1
}