import BasicBeast from "../../../contracts/Project/BasicBeast.cdc"

pub fun main(beastTemplateID: UInt32): UInt32 {

    if BasicBeast.getBeastTemplate(beastTemplateID: beastTemplateID) == nil {
        panic("BeastTemplate does not exist")
    }
    let setID = BasicBeast.getBeastTemplateEvolutionSet(beastTemplateID: beastTemplateID)
        ?? panic("BeastTemplate is not in an EvolutionSet")

    return setID
}