import BasicBeast from "../../../contracts/Project/BasicBeast.cdc"

pub fun main(): {UInt32: UInt32} {
    return BasicBeast.getAllBeastTemplatesInAnEvolutionSet()
}