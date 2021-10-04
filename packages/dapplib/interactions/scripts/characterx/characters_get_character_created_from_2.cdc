import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(characterID: UInt32): UInt64 {

    let createdFrom_2 = CharacterX.getCharacterCreatedFrom_2(characterID: characterID)
        ?? panic("Character doesn't exist")

    return createdFrom_2
}