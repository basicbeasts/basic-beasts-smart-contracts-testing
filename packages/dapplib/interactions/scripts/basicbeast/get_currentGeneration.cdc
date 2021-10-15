import BasicBeast from "../../../contracts/Project/BasicBeast.cdc"

pub fun main(): UInt32 {
    return BasicBeast.currentGeneration
}