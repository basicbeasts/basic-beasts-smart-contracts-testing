import BasicBeast from "./../../../contracts/Project/BasicBeast.cdc"

pub fun main(beastTemplateID: UInt32): BasicBeast.BeastTemplate {

    let beastTemplate = BasicBeast.getBeastTemplate(beastTemplateID: beastTemplateID)
        ?? panic("BeastTemplate doesn't exist")

    return beastTemplate
}