import BasicBeast from "./../../../contracts/Project/BasicBeast.cdc"

pub fun main(setID: UInt32): [UInt32] {

    let beastTemplates = BasicBeast.getBeastTemplatesInSet(setID: setID)!

    return beastTemplates
}