import BasicBeast from "../../../../contracts/Project/BasicBeast.cdc"

pub fun main(setID: UInt32): String {

    let name = BasicBeast.getEvolutionSetName(setID: setID)
        ?? panic("Couldn't find the specified set")

    return name
}