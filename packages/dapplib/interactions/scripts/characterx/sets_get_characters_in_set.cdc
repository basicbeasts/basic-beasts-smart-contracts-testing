import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(setID: UInt32): [UInt32] {

    let characters = CharacterX.getCharactersInSet(setID: setID)!

    return characters
}