import BasicBeast from "./../../../contracts/Project/BasicBeast.cdc"

pub fun main(): [BasicBeast.BeastTemplate] {
    return BasicBeast.getAllBeastTemplates()
}