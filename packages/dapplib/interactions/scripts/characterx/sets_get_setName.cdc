import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(setID: UInt32): String {

    let name = CharacterX.getSetName(setID: setID)
        ?? panic("Couldn't find the specified set")

    return name
}